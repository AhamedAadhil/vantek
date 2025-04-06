'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Users, ShoppingCart, MessageSquare, Inbox, FileText, Layers, Package, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [active, setActive] = useState('Orders');

  const menuItems = [
    { name: 'Dashboards', icon: Layers, link: '#' },
    { name: 'Orders', icon: ShoppingCart, link: '#', active: true },
    { name: 'Customers', icon: Users, link: '#' },
    { name: 'Transactions', icon: FileText, link: '#' },
    { name: 'Inventory', icon: Package, link: '#' },
    { name: 'Banner', icon: MessageSquare, link: '#' },
    { name: 'Logout', icon: LogOut, link: '#' },
  ];

  return (
    <aside className="w-64 h-screen bg-dark-2 text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-pink-500 p-2 rounded-full">
          <Home className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold">VANTEK</span>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-meta-4 ${
                  active === item.name ? 'bg-gray-800' : ''
                }`}
                onClick={() => setActive(item.name)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;