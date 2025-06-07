import React, { useEffect, useState } from "react";
import { Pencil, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { generateAvatarUrl } from "@/helper/generateAvatarUrl";
import { formatDateTime } from "@/helper/formatDateTime";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

// const userData = [
//   {
//     avatar: "/images/users/cus1.jpg",
//     name: "Aadhil Shihabdeen",
//     email: "aadhilshelby@gmail.com",
//     landmark: "166/16",
//     street: "Groove Street",
//     city: "Ontario",
//     state: "New York",
//     country: "USA",
//     zipCode: "002584",
//     phone: "+94752203374",
//     lastOrderDate: "24/11/2024",
//     lastOrderTime: "11.25AM",
//     lastOrderAmount: "158.58",
//     lastPaymentMethod: "VISA",
//     totalPurchase: "285",
//   },
// ];

const UserDetails = ({ user }) => {
  console.log(user, "user details");

  if (!user) {
    return <div className="m-4 p-5 text-white">Loading user details...</div>;
  }

  return (
    <div className="bg-[#1f1f1f] border border-dashed text-white m-4 p-5 rounded-lg shadow-md max-w-md">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <span className="border-l-4 border-l-purple-light-2 pl-2">
          User Details
        </span>
      </h2>
      <hr className="mb-4" />

      {/* User Info */}
      <div className="flex items-center gap-3">
        <Image
          src={generateAvatarUrl(user.email)}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
          width={32}
          height={32}
        />
        <div>
          <h3 className="text-md font-bold">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <BadgeCheck className="text-yellow ml-auto" />
        <span className="text-xs bg-yellow-dark text-dark px-2 py-1 font-semibold rounded-lg">
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Delivery Address */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-700 relative">
        <h4 className="font-semibold mb-2">Delivery address:</h4>
        
        <ul className="space-y-1 text-sm">
          <li>
            houseNumber:{" "}
            <span className="opacity-75">{user.address?.[0]?.houseNumber}</span>
          </li>
          <li>
            Street:{" "}
            <span className="opacity-75">{user.address?.[0]?.street}</span>
          </li>
          <li>
            City: <span className="opacity-75">{user.address?.[0]?.city}</span>
          </li>
          <li>
            State:{" "}
            <span className="opacity-75">{user.address?.[0]?.province}</span>
          </li>
          <li>
            Country:{" "}
            <span className="opacity-75">{user.address?.[0]?.country}</span>
          </li>
          <li>
            Zipcode:{" "}
            <span className="opacity-75">{user.address?.[0]?.zipCode}</span>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-700">
        <h4 className="font-semibold mb-2">Send updates to:</h4>
        <ul className="space-y-1 text-sm">
          <li>
            Phone:{" "}
            <span className="opacity-75">{user.address?.[0]?.phone}</span>
          </li>
          <li>
            Email: <span className="opacity-75">{user.email}</span>
          </li>
        </ul>
      </div>

      {/* Additional Info Summary */}
      <div className="mt-6 pt-4 border-t border-dashed border-gray-700">
        <h4 className="font-semibold mb-2">Additional Info</h4>
        <ul className="space-y-1 text-sm">
          <li>
            Member Since:{" "}
            <span className="opacity-75">{formatDateTime(user.createdAt)}</span>
          </li>
          <li>
            Last Update On:{" "}
            <span className="opacity-75">{formatDateTime(user.updatedAt)}</span>
          </li>
          <li>
            has Cart:{" "}
            <span className="opacity-75">
              {user.cart?.length > 1 ? "Yes" : "No"}
            </span>
          </li>
          <li>
            has Wishlist:{" "}
            <span className="opacity-75">{user.wishlist ? "Yes" : "No"}</span>
          </li>
        </ul>
      </div>

      {/* Total Purchases */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-center text-sm">
        <p>
          Total{" "}
          <span className="text-green font-semibold">
            {formatToEuro(user.totalSpent)}
          </span>{" "}
          purchased up to now
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
