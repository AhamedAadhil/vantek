'use client';

import { useState } from 'react';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

const ordersData = [
  {
    id: 1,
    name: 'Michael A. Miner',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Pending',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Michael A. Miner',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Pending',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Kabeeb',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Cancelled',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Rafeek',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Cancelled',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Michael A. Miner',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Delivered',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Michael A. Miner',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Cancelled',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Kabeeb',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Delivered',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
  {
    id: 1,
    name: 'Rafeek',
    date: '01/26/2025',
    contact: '+231 06-75820711',
    type: 'Residences',
    amount: '$45,842',
    property: '4604 , Philli Lane Kiowa',
    status: 'Pending',
    statusColor: 'bg-green-500',
    avatar: "/images/users/cus1.jpg",
  },
];

const Orders = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const filteredOrders = ordersData.filter(order =>
    order.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  return (
    <div className="m-4 p-6 bg-dark text-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-dark text-white border border-l-red-light-6 px-4 py-2 rounded-lg pl-10 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2 text-gray-400" size={18} />
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-300">
            <th className="p-3">Customer</th>
            <th className="p-3">Purchase Date</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Item</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Billing Address</th>
            <th className="p-3">Order Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="p-3 flex items-center space-x-3">
                <Image src={order.avatar} alt={order.name} width={40} height={40} className="rounded-full" />
                <span>{order.name}</span>
              </td>
              <td className="p-3">{order.date}</td>
              <td className="p-3">{order.contact}</td>
              <td className="p-3">{order.type}</td>
              <td className="p-3">{order.amount}</td>
              <td className="p-3">{order.property}</td>
              <td className="p-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                order.status === 'Delivered'
                                ? 'text-green-light-2'
                                : order.status === 'Cancelled'
                                ? 'text-red-light'
                                : order.status === 'Pending'
                                ? 'text-yellow-light'
                                : ''
                                }`}>{order.status}</span>
              </td>
              <td className="p-3 flex space-x-2">
                <button className="flex items-center m-3 justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-blue-light-4 border border-blue-light-4 ease-out duration-200 hover:bg-red-light-6 hover:border-white hover:text-dark text-dark"><Eye size={16} /></button>
                <button className="flex items-center m-3 justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-blue-light-4 border border-blue-light-4 ease-out duration-200 hover:bg-green-light-6 hover:border-green-light-6 hover:text-green text-dark"><Pencil size={16} /></button>
                <button className="flex items-center m-3 justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-blue-light-4 border border-blue-light-4 ease-out duration-200 hover:bg-red-light-3 hover:border-red-light-3 hover:text-red-dark text-dark"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50">Previous</button>
        <span className="px-4 py-2 bg-gray-800 rounded-lg">{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Orders;
