import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";

interface MonthlyData {
  month: string;
  orders: number;
  sales: number;
}

const SalesReportChart = ({ salesData }) => {
  const months = salesData?.map((d) => d.month) || [];
  const [startMonth, setStartMonth] = useState(
    () => salesData?.[0]?.month || ""
  );
  const [endMonth, setEndMonth] = useState(
    () => salesData?.[salesData.length - 1]?.month || ""
  );

  useEffect(() => {
    if (salesData && salesData.length > 0) {
      setStartMonth(salesData[0].month);
      setEndMonth(salesData[salesData.length - 1].month);
    }
  }, [salesData]);

  const startIndex = months.indexOf(startMonth);
  const endIndex = months.indexOf(endMonth);

  // Guard against -1 (not found)
  const filteredData =
    startIndex !== -1 && endIndex !== -1
      ? salesData.slice(startIndex, endIndex + 1)
      : [];

  if (!salesData || salesData.length === 0) {
    return <div className="text-gray-400 p-4">No data available.</div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded text-white text-sm">
          <p className="font-semibold">{label}</p>
          <p>
            Sales: £
            {payload
              .find((d: any) => d.dataKey === "sales")
              ?.value.toLocaleString()}
          </p>
          <p>
            Orders: {payload.find((d: any) => d.dataKey === "orders")?.value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full bg-[#202020] border border-gray-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-gray-6 pb-2">
        <h2 className="text-lg font-semibold border-l-4 border-l-blue-500 pl-2">
          Sales Report
        </h2>
        {/* Filter section */}
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-300 mr-2">Start Month:</label>
            <select
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300 mr-2">End Month:</label>
            <select
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-300">Orders (Count)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-sm text-gray-300">Sales (£)</span>
          </div>
        </div>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis
                fontSize={14}
                dataKey="month"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#333" }}
                tickLine={false}
              />
              <YAxis
                fontSize={14}
                yAxisId="left"
                orientation="left"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#333" }}
                tickLine={false}
                label={{
                  value: "Orders",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                }}
              />
              <YAxis
                fontSize={14}
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#333" }}
                tickLine={false}
                label={{
                  value: "Sales (£)",
                  angle: -90,
                  position: "insideRight",
                  fill: "#9ca3af",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                fontSize={14}
                yAxisId="right"
                type="monotone"
                dataKey="sales"
                fill="#22d3ee"
                fillOpacity={0.2}
                stroke="#22d3ee"
                strokeWidth={2}
                name="Sales (£)"
              />
              <Bar
                fontSize={14}
                yAxisId="left"
                dataKey="orders"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                barSize={16}
                name="Orders"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesReportChart;
