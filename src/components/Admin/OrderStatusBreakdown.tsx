import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface OrderStatusBreakdownItem {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

interface SalesByOrderStatusChartProps {
  data: OrderStatusBreakdownItem[];
}

const OrderStatusBreakdown: React.FC<SalesByOrderStatusChartProps> = ({
  data,
}) => {
  const totalOrders = data?.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-gray-800 text-white text-sm p-2 rounded shadow-lg">
          <p className="font-semibold capitalize">{item.name}</p>
          <p>Orders: {item.value}</p>
          <p>Share: {item.percentage}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#202020] border border-gray-600 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-500">
        <div className="flex items-center">
          <div className="w-1 h-5 bg-blue-500 mr-2"></div>
          <h2 className="text-white text-sm font-medium">
            Order Status Breakdown
          </h2>
        </div>
        <button className="text-purple-light-1 text-xs hover:text-purple-light-4 transition-colors">
          View All
        </button>
      </div>

      {/* Chart */}
      <div className="p-4 flex justify-center">
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-base">Total</p>
            <p className="text-white text-2xl font-semibold">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 border-t border-gray-500">
        {data?.map((status) => (
          <div
            key={status.name}
            className="flex flex-col items-center justify-center py-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: status.color }}
              ></span>
              <p className="text-gray-400 text-xs capitalize">{status.name}</p>
            </div>
            <p className="text-white text-sm font-medium">
              {status.percentage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusBreakdown;
