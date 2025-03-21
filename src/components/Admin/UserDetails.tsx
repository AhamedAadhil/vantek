import React from "react";
import { Pencil, BadgeCheck } from "lucide-react";
import Image from 'next/image';

const userData = [
  {
    avatar: "/images/users/cus1.jpg",
    name : 'Aadhil Shihabdeen',
    email : 'aadhilshelby@gmail.com',
    landmark : '166/16',
    street : 'Groove Street',
    city : 'Ontario',
    state : 'New York',
    country : 'USA',
    zipCode : '002584',
    phone : '+94752203374',
    lastOrderDate : '24/11/2024',
    lastOrderTime : '11.25AM',
    lastOrderAmount : '158.58',
    lastPaymentMethod : 'VISA',
    totalPurchase : '285',
  },
];

const UserDetails = () => {
  const user = userData[0];

  return (
    <div className="bg-dark text-white m-4 p-5 rounded-lg shadow-md max-w-md">
      <h2 className="text-lg font-semibold border-hidden border-gray-700 pb-2 mb-4 flex items-center">
        <span className="border-l-4 border-purple-500 pl-2">User Details</span>
      </h2>
      <hr className="mb-4"/>
      
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-hidden border-gray-700"
        />
        <div>
          <h3 className="text-md font-bold">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <BadgeCheck className="text-yellow ml-14" />
        <span className="text-xs bg-yellow-dark text-dark px-2 py-1 font-semibold rounded-lg">PRIME</span>
      </div>

      <div className="mt-4 border-t border-dashed border-gray-700 pt-4 relative">
        <h4 className="font-semibold mb-2">Delivery address :</h4>
        <button className="absolute top-4 right-4 bg-gray-700 p-1 rounded-md hover:bg-gray-600">
          <Pencil className="w-4 h-4 text-gray-300" />
        </button>
        <p>Landmark : <span className="opacity-75">{user.landmark}</span></p>
        <p>Street : <span className="opacity-75">{user.street}</span></p>
        <p>City : <span className="opacity-75">{user.city}</span></p>
        <p>State : <span className="opacity-75">{user.state}</span></p>
        <p>Country : <span className="opacity-75">{user.country}</span></p>
        <p>Zipcode : <span className="opacity-75">{user.zipCode}</span></p>
      </div>

      <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
        <h4 className="font-semibold mb-2">Send updates to :</h4>
        <p>Phone : <span className="opacity-75">{user.phone}</span></p>
        <p>Email : <span className="opacity-75">{user.email}</span></p>
      </div>

      <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
        <h4 className="font-semibold mb-2">Latest Order Summary</h4>
        <p>Ordered Date : <span className="opacity-75">{user.lastOrderDate}</span></p>
        <p>Ordered Time : <span className="opacity-75">{user.lastOrderTime}</span></p>
        <p>Payment Interface : <span className="opacity-75">{user.lastPaymentMethod}</span></p>
      </div>
      
      <div className="mt-4 border-t border-gray-700 pt-4 text-center">
        <p>
          Total <span className="text-green font-semibold">{user.totalPurchase} items</span> purchased upto now
        </p>
      </div>
    </div>
  );
};

export default UserDetails;