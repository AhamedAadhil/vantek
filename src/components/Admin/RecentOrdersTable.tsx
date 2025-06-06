import React, { useState } from "react";
import {
  Download,
  Edit,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowDown,
  Search,
} from "lucide-react";
import Image from "next/image";
import { generateAvatarUrl } from "@/helper/generateAvatarUrl";
import { formatDateTime } from "@/helper/formatDateTime";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

interface Customer {
  name: string;
  email: string;
}

interface Order {
  id: string;
  orderId: string;
  customer: Customer;
  quantity: number;
  price: number;
  status: "shipped" | "canceled" | "Under Process" | "pending" | "delivered";
  orderedDate: string; // format: "25,Nov 2022"
}

const statusColors: Record<Order["status"], string> = {
  shipped: "text-blues-500 bg-blues-500/10",
  canceled: "text-red-light bg-red-dark/10",
  "Under Process": "text-blues-500 bg-blues-500/10",
  pending: "text-amber-500 bg-amber-500/10",
  delivered: "text-emerald-500 bg-emerald-500/10",
};

interface RecentOrdersTableProps {
  recentOrders: Order[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  recentOrders = [],
}) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getSortedOrders = (): Order[] => {
    if (!Array.isArray(recentOrders)) return []; // guard clause

    if (!sortBy) return recentOrders;

    return [...recentOrders].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case "orderId":
          valueA = a.orderId;
          valueB = b.orderId;
          break;
        case "customer":
          valueA = a.customer.name.toLowerCase();
          valueB = b.customer.name.toLowerCase();
          break;
        case "quantity":
          valueA = a.quantity;
          valueB = b.quantity;
          break;
        case "price":
          valueA = a.price;
          valueB = b.price;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "orderedDate":
          const parseDate = (dateStr: string) => {
            const [day, month, year] = dateStr.split(/,| /).filter(Boolean);
            return new Date(`${month} ${day}, ${year}`).getTime();
          };
          valueA = parseDate(a.orderedDate);
          valueB = parseDate(b.orderedDate);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column)
      return <ArrowDown size={14} className="ml-1 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  return (
    <div className="bg-[#202020] border border-gray-600 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <div className="flex items-center">
          <div className="w-1 h-5 bg-blues-500 mr-2"></div>
          <h2 className="text-white font-medium">Recent Orders</h2>
        </div>
        {/* <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders"
              className="bg-gray-700 text-gray-300 text-sm border border-gray-600 rounded-md pl-9 pr-4 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300"
              size={16}
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md flex items-center">
            Sort By <ChevronDown size={16} className="ml-1" />
          </button>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-xs">
              {[
                { key: "orderId", label: "Order Id" },
                { key: "customer", label: "Customer" },
                { key: "quantity", label: "No.of Items" },
                { key: "price", label: "Price" },
                { key: "status", label: "Status" },
                { key: "orderedDate", label: "Ordered Date" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="p-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center">
                    {label}
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(getSortedOrders() || []).map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-600 text-white hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-3 text-emerald-300">{order.orderId}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <Image
                      src={generateAvatarUrl(order.customer.email)}
                      alt={`${order.customer.name} avatar`}
                      width={45}
                      height={45}
                      className="rounded-full mr-2"
                    />
                    <span>{order.customer.name}</span>
                  </div>
                </td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{formatToEuro(order.price)}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{formatDateTime(order.orderedDate)}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button className="p-1 text-emerald-500 hover:bg-emerald-900 hover:text-white rounded">
                      <Download size={18} />
                    </button>
                    <button className="p-1 text-violet-500 hover:bg-violet-900 hover:text-white rounded">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-600">
        <div className="flex items-center text-sm text-gray-300">
          Showing Recent {recentOrders?.length} Entries{" "}
          {/* <ChevronRight size={14} className="ml-1" /> */}
        </div>
        {/* <div className="flex items-center space-x-1">
          <button className="flex items-center justify-center w-8 h-8 rounded text-gray-300 hover:bg-gray-700">
            <ChevronLeft size={18} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded bg-violet-600 text-white">
            1
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded text-gray-300 hover:bg-gray-700">
            2
          </button>
          <button className="flex items-center justify-center w-12 h-8 rounded text-gray-300 hover:bg-gray-700">
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RecentOrdersTable;
