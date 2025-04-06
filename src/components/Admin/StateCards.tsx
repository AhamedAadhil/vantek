"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PendingOrdersWidgetProps {
  percentage: number;
  total: number;
  title?: string;
  color?: string;
  className?: string;
}

const PendingOrdersWidget = ({
  percentage = 65,
  total = 16789,
  title = "Clicks",
  color = "#FFC107",
  className = "",
}: PendingOrdersWidgetProps) => {
  // Create data for the progress chart
  const data = [
    { name: "Complete", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className={`bg-gray-7 text-white p-4 rounded-lg shadow-md flex items-center ${className}`}>
      <div className="w-16 h-16 mr-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="#333333" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color }}>
          {percentage}%
        </div>
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className="text-white text-xl font-semibold mt-1">{total.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersWidget;