import React, { useState, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Brush,
} from 'recharts';
import { ExternalLink } from 'lucide-react';

interface MonthlyData {
  month: string;
  orders: number;
  sales: number;
}

const SalesReportChart = () => {
  const data: MonthlyData[] = [
    { month: 'Jan', orders: 22, sales: 42 },
    { month: 'Feb', orders: 10, sales: 52 },
    { month: 'Mar', orders: 20, sales: 42 },
    { month: 'Apr', orders: 25, sales: 65 },
    { month: 'May', orders: 12, sales: 22 },
    { month: 'Jun', orders: 20, sales: 30 },
    { month: 'Jul', orders: 35, sales: 42 },
    { month: 'Aug', orders: 20, sales: 38 },
    { month: 'Sep', orders: 45, sales: 50 },
    { month: 'Oct', orders: 20, sales: 35 },
    { month: 'Nov', orders: 45, sales: 42 },
    { month: 'Dec', orders: 32, sales: 30 },
  ];

  // State to manage zoom domain
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(data.length - 1);

  // Function to handle brush change
  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setStartIndex(brushData.startIndex);
      setEndIndex(brushData.endIndex);
    }
  };

  return (
    <div className="w-full bg-gray-7 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-gray-6 pb-2">
        <h2 className="text-lg font-semibold border-l-4 border-l-blue-500 pl-2">Sales Report</h2>
        {/* <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1 rounded">
          <ExternalLink size={16} />
          <span className="text-sm font-medium">Export</span>
        </button> */}
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-300">orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-sm text-gray-300">sales</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data.slice(startIndex, endIndex + 1)}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#9ca3af' }} 
                axisLine={{ stroke: '#333' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#9ca3af' }} 
                axisLine={{ stroke: '#333' }}
                tickLine={false}
                domain={[0, 80]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                fill="#22d3ee"
                fillOpacity={0.2}
                stroke="#22d3ee"
                strokeWidth={2}
              />
              <Bar
                dataKey="orders"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '100%', height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#9ca3af' }} 
                axisLine={{ stroke: '#333' }}
                tickLine={false}
                height={20}
              />
              <Brush 
                dataKey="month" 
                height={20} 
                stroke="#4f46e5"
                fill="#111827" 
                onChange={handleBrushChange}
                startIndex={startIndex}
                endIndex={endIndex}
                travellerWidth={10}
              />
              <Area
                type="monotone"
                dataKey="sales"
                fill="#22d3ee"
                fillOpacity={0.2}
                stroke="#22d3ee"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="orders"
                fill="#a855f7"
                fillOpacity={0.2}
                stroke="#a855f7"
                strokeWidth={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesReportChart;