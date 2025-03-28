'use client';

import { ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  return (
    
    <div className="grid grid-cols-6 grid-rows-5 gap-4 m-4">
        <div >
            
            <div className="bg-dark-3 p-4 rounded-lg flex items-center space-x-4 shadow-md">
            <div className="p-3 bg-gray-7 rounded-full">
                <ShoppingBag className="text-purple-light-2" size={24} />
            </div>
            <div>
                <p className="text-gray-4 text-sm">Total Sales</p>
                <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-xl">
                    15585 USD
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

        <div >

            <div className="bg-dark-3 p-4 rounded-lg flex items-center space-x-4 shadow-md">
            <div className="p-3 bg-gray-7 rounded-full">
                <ShoppingBag className="text-purple-light-2" size={24} />
            </div>
            <div>
                <p className="text-gray-4 text-sm">Total Sales</p>
                <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-xl">
                    15585 USD
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

        <div >
            <div className="bg-dark-3 p-4 rounded-lg flex items-center space-x-4 shadow-md">
                <div className="p-3 bg-gray-7 rounded-full">
                    <ShoppingBag className="text-purple-light-2" size={24} />
                </div>
                <div>
                    <p className="text-gray-4 text-sm">Total Sales</p>
                    <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-xl">
                        15585 USD
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
        <div className="col-span-3 row-span-2 col-start-1 row-start-2">4</div>
        <div className="col-span-3 row-span-3 col-start-4 row-start-1">5</div>
        <div className="col-span-2 row-span-2 row-start-4">6</div>
        <div className="col-span-2 row-span-2 col-start-3 row-start-4">7</div>
        <div className="col-span-2 row-span-2 col-start-5 row-start-4">8</div>
    </div>
    
  )
}

export default Dashboard