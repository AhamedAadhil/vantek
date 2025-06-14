"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Pencil, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ordersPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NODE_ENV === "production"
              ? process.env.NEXT_PUBLIC_BASEURL
              : process.env.NEXT_PUBLIC_BASEURL_LOCAL
          }/admin/order`
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log(orders);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const orderId = order.orderId || "Unknown";
      console.log(orderId, "orderid");
      const matchesSearch = orderId
        .toLowerCase()
        .includes(search.toLowerCase());

      const orderDate = new Date(order.createdAt);
      const isAfterFromDate = fromDate ? orderDate >= new Date(fromDate) : true;
      const isBeforeToDate = toDate ? orderDate <= new Date(toDate) : true;

      return matchesSearch && isAfterFromDate && isBeforeToDate;
    });

    setFilteredOrders(filtered);
  }, [orders, search, fromDate, toDate]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (loading) return <p className="text-white p-4">Loading orders...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="m-4 p-6 bg-[#202020] border border-gray-600 text-sm text-white rounded-lg">
      {/* --- Search & Filters --- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Order List</h2>
        <div className="flex">
          <div className="flex items-center gap-4 mx-4">
            <div className="relative flex items-center">
              <Search className="absolute ml-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg pl-10 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="text-sm font-medium text-gray-300 mb-1">
                From Date :
              </label>
              <input
                type="date"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <label className="text-sm font-medium text-gray-300 mb-1">
                To Date :
              </label>
              <input
                type="date"
                className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center justify-center">
                <Upload size={17} className="mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
      <table className="w-full text-left border-collapse">
        <thead className="border-b">
          <tr className="bg-gray-800 text-gray-300 text-base">
            <th className="p-3">Customer</th>
            <th className="p-3">Purchase Date</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Order ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order._id} className="border-b border-gray-700">
              <td className="p-3">{order.user?.name || "Unknown"}</td>
              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">{order.shippingAddress?.phone || "-"}</td>
              <td className="p-3">{order.orderId}</td>
              <td className="p-3"> {formatToEuro(order.totalAmount)}</td>
              <td className="p-3">{order.user?.email || "-"}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    order.status === "delivered"
                      ? "text-green-500"
                      : order.status === "cancelled"
                      ? "text-red-500"
                      : order.status === "pending"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      "selectedOrder",
                      JSON.stringify(order)
                    ); // 🔹 Store order data
                    router.push("/admin/order-details"); // 🔹 Then navigate
                  }}
                  className="flex items-center justify-center rounded-lg w-9 h-9 bg-blue-400 hover:bg-blue-500 text-black hover:text-white"
                >
                  <Eye size={16} />
                </button>
                {/* <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-400 hover:bg-green-500 text-black hover:text-white">
                  <Pencil size={16} />
                </button>
                <button className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-400 hover:bg-red-500 text-black hover:text-white">
                  <Trash2 size={16} />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Pagination --- */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 rounded-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
