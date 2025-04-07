'use client';

import { Currency, DollarSign, ShoppingBag, User } from 'lucide-react';
import { PieChart } from 'recharts';
import RevenueBreakdownChart from './RevenueBreakdownChart';
import RecentOrdersTable from './RecentOrdersTable';
import TopSellingProductsTable from './TopSellingItems';
import TopCustomerTable from './TopCustomer';
import SalesReportChart from './SalesByMonthChart';
import PendingOrdersWidget from './StateCards';
import LowStocksTable from './LowStocks';

const Dashboard = () => {
  return (
    
    <div className="grid grid-cols-5 w-full grid-rows-1 gap-4 bg-gray-900 p-4">
        <div className='h-fit' >
            
            <div className="bg-gray-7 p-4 rounded-lg flex items-center space-x-4 shadow-md">
            <div className="p-3 bg-gray-6 rounded-full">
                <DollarSign className="text-white" size={24} />
            </div>
            <div>
                <p className="text-gray-4 text-sm">Total Sales this month</p>
                <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-xl">
                    $ 15585 
                </span>
                </div>
                <span 
                    className='text-xs text-green-light-2'
                >
                    4.5% increased this month
                </span>
            </div>
            </div>

        </div>

        <div className='h-fit'>

            <div className="bg-gray-7 p-4 rounded-lg flex items-center space-x-4 shadow-md">
            <div className="p-3 bg-gray-6 rounded-full">
                <ShoppingBag className="text-white" size={24} />
            </div>
            <div>
                <p className="text-gray-4 text-sm">Total Orders this month</p>
                <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-xl">
                    1685
                </span>
                </div>
                <span 
                    className='text-xs text-green-light-2'
                >
                    15.8% increased this month
                </span>
            </div>
            </div>

        </div>

        <div className='h-fit'>
            <div className="bg-gray-7 p-4 rounded-lg flex items-center space-x-4 shadow-md">
                <div className="p-3 bg-gray-6 rounded-full">
                    <User className="text-white" size={24} />
                </div>
                <div>
                    <p className="text-gray-4 text-sm">Total Registered Customers</p>
                    <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-xl">
                        652
                    </span>
                    </div>
                    <span 
                        className='text-xs text-green-light-2'
                    >
                        2.25% increased this month
                    </span>
                </div>
            </div>
        </div>

        <div className="col-span-3 row-span-2 col-start-1 row-start-2">
            <div className='mb-4'><SalesReportChart/></div>
            <div className=''><RecentOrdersTable/></div>
        </div>
        
        <div className="col-span-3 row-span-3 col-start-4 row-start-1">
            <div className='mb-4'><RevenueBreakdownChart/></div>
            <div className='grid grid-cols-2 grid-rows-1 gap-4'>
                <div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                </div>
                <div>
                    <div className='mb-4'><RevenueBreakdownChart/></div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                    <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div>
                    {/* <div className='mb-4'><PendingOrdersWidget percentage={56} total={100}/></div> */}
                </div>
            </div>
        </div>
        <div className="col-span-2 row-span-2 row-start-4"><TopSellingProductsTable/></div>
        <div className="col-span-2 row-span-2 col-start-3 row-start-4"><LowStocksTable/></div>
        <div className="col-span-2 row-span-2 col-start-5 row-start-4"><TopCustomerTable/></div>
    </div>
    
  )
}

export default Dashboard