"use client";

import { Currency, DollarSign, ShoppingBag, User } from "lucide-react";
import { PieChart } from "recharts";
import RevenueBreakdownChart from "./SalesByCatChart";
import RecentOrdersTable from "./RecentOrdersTable";
import TopSellingProductsTable from "./TopSellingItems";
import TopCustomerTable from "./TopCustomer";
import SalesReportChart from "./SalesByMonthChart";
import PendingOrdersWidget from "./StateCards";
import LowStocksTable from "./LowStocks";
import SalesByCatergoryChart from "./SalesByCatChart";
import { useEffect, useState } from "react";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import OrderStatusBreakdown from "./OrderStatusBreakdown";

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString();

  const fetchInsights = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/admin/insights`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch insights");
      }
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error.message);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full bg-[#000000] p-4">
      <div className="h-fit">
        <div className="bg-[#202020] border border-gray-600 p-2 rounded-lg flex items-center space-x-4 shadow-md">
          <div className="p-3 bg-gray-6 rounded-full">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <p className="text-gray-4 text-sm">Total Sales this month</p>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">
                {formatToEuro(insights?.totalSalesThisMonth)}
              </span>
            </div>
            <span
              className={
                insights?.change?.salesGrowth?.impact === "positive"
                  ? `text-xs text-green-light-2`
                  : insights?.change?.salesGrowth?.impact === "negative"
                  ? `text-xs text-red-light-2`
                  : `text-xs text-blue-light-2`
              }
            >
              {insights?.change?.salesGrowth?.percentage}%{" "}
              {insights?.change?.salesGrowth?.impact} growth this month
            </span>
          </div>
        </div>
      </div>

      <div className="h-fit">
        <div className="bg-[#202020] border border-gray-600 p-2 rounded-lg flex items-center space-x-4 shadow-md">
          <div className="p-3 bg-gray-6 rounded-full">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <div>
            <p className="text-gray-4 text-sm">Total Orders this month</p>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">
                {insights?.totalOrdersThisMonth}
              </span>
            </div>
            <span
              className={
                insights?.change?.orderGrowth?.impact === "positive"
                  ? `text-xs text-green-light-2`
                  : insights?.change?.orderGrowth?.impact === "negative"
                  ? `text-xs text-red-light-2`
                  : `text-xs text-blue-light-2`
              }
            >
              {insights?.change?.orderGrowth?.percentage}%{" "}
              {insights?.change?.orderGrowth?.impact} growth this month
            </span>
          </div>
        </div>
      </div>

      <div className="h-fit">
        <div className="bg-[#202020] border border-gray-600 p-2 rounded-lg flex items-center space-x-4 shadow-md">
          <div className="p-3 bg-gray-6 rounded-full">
            <User className="text-white" size={24} />
          </div>
          <div>
            <p className="text-gray-4 text-sm">Registered Customers</p>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">
                {insights?.registeredCustomers}
              </span>
            </div>
            <span
              className={
                insights?.change?.customerGrowth?.impact === "positive"
                  ? `text-xs text-green-light-2`
                  : insights?.change?.customerGrowth?.impact === "negative"
                  ? `text-xs text-red-light-2`
                  : `text-xs text-blue-light-2`
              }
            >
              {insights?.change?.customerGrowth?.percentage}%{" "}
              {insights?.change?.customerGrowth?.impact} growth this month
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-span-2 col-start-1 row-start-2">
        <div className="mb-4">
          <SalesReportChart salesData={insights?.salesReport} />
        </div>
        <div className="">
          <RecentOrdersTable
            recentOrders={insights?.recentOrders.recentOrders}
          />
        </div>
      </div>

      <div className="col-span-3 row-span-3 col-start-4 row-start-1">
        <div className="mb-4">
          <SalesByCatergoryChart categoryData={insights?.categoryData} />
        </div>
        <div className="mb-4">
          <OrderStatusBreakdown data={insights?.orderStatusBreakdown} />
        </div>
        <div className="mb-4">
          <TopCustomerTable topCustomers={insights?.topCustomers} />
        </div>
      </div>
      <div className="col-span-2 row-span-2 row-start-4">
        <TopSellingProductsTable
          topSellingProducts={insights?.topSellingProducts}
        />
      </div>
      <div className="col-span-3 row-span-2 col-start-3 row-start-4">
        <LowStocksTable lowStockInfo={insights?.lowStockInfo} />
      </div>
    </div>
  );
};

export default Dashboard;
