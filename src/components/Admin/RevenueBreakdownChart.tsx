import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  SmartphoneIcon, 
  TabletIcon, 
  MonitorIcon, 
  MoreHorizontalIcon 
} from 'lucide-react';

// Sample revenue data by device category
const deviceData = [
  { name: 'Mobile', value: 66.3, color: '#10b981', icon: SmartphoneIcon },
  { name: 'Tablet', value: 17.68, color: '#f59e0b', icon: TabletIcon },
  { name: 'Desktop', value: 10.5, color: '#3b82f6', icon: MonitorIcon },
  { name: 'Others', value: 5.16, color: '#6366f1', icon: MoreHorizontalIcon }
];

const RevenueBreakdownChart: React.FC = () => {
  const totalSessions = deviceData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-dark-3 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Sessions By Device</h2>
        <button className="text-white hover:text-white text-sm">View All</button>
      </div>
      
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
            >
              {deviceData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                color: 'white',
                border: 'none',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value}%`, 'Sessions']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="text-white text-2xl font-bold">{totalSessions.toFixed(0)}</div>
          <div className="text-white text-sm">Total</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {deviceData.map((item) => (
          <div key={item.name} className="flex items-center space-x-2 bg-white rounded-sm p-2">
            <item.icon 
              className="text-white" 
              size={16} 
              style={{ color: item.color }}
            />
            <div className="flex justify-between w-full">
              <span className="text-dark text-sm">{item.name}</span>
              <span 
                className="text-white text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueBreakdownChart;