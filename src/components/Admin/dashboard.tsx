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

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/admin/insights", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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

  console.log("Insights Data:", insights);
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
                insights?.change?.salesGrowth?.impact === "postive"
                  ? `text-xs text-green-light-2`
                  : `text-xs text-red-light-2`
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
                insights?.change?.orderGrowth?.impact === "postive"
                  ? `text-xs text-green-light-2`
                  : `text-xs text-red-light-2`
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
                insights?.change?.customerGrowth?.impact === "postive"
                  ? `text-xs text-green-light-2`
                  : `text-xs text-red-light-2`
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
          <SalesReportChart />
        </div>
        <div className="">
          <RecentOrdersTable />
        </div>
      </div>

      <div className="col-span-3 row-span-3 col-start-4 row-start-1">
        <div className="mb-4">
          <SalesByCatergoryChart categoryData={insights?.categoryData} />
        </div>
        <div className="mb-4">
          <TopCustomerTable />
        </div>
      </div>
      <div className="col-span-2 row-span-2 row-start-4">
        <TopSellingProductsTable />
      </div>
      <div className="col-span-3 row-span-2 col-start-3 row-start-4">
        <LowStocksTable />
      </div>
    </div>
  );
};

export default Dashboard;
