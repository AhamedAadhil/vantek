"use client";
import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import UserDetails from "@/components/Admin/UserDetails";
import UserOrders from "@/components/Admin/UserOrders";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "User detail Page | Vantek E-commerce",
//   description: "This is User Detail Page for Vantek E-commerce Site",
//   // other metadata
// };

const AdminUserDetailsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const selectedUserString = sessionStorage.getItem("selectedUser");
    if (selectedUserString) {
      try {
        const parsedUser = JSON.parse(selectedUserString);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from sessionStorage", e);
      }
    }
  }, []);

  return (
  <div className="bg-gray-900 w-[85vw] xl:w-[90vw] min-h-screen p-2">
    <div className="flex justify-start">
        <button
          onClick={() => router.push("/admin/customers")}
          className="flex items-center bg-teal-700 hover:bg-teal-900 text-white px-4 py-2 ml-4 mt-2 rounded"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>
        <div className="bg-teal-700 text-white px-4 py-2 ml-4 mt-2 mr-4 rounded w-full text-center text-lg">
          CUSTOMER DETAILS
        </div>
      </div>
    <div className="flex flex-col lg:flex-row gap-4">
      {/* User Details Section */}
      <div className="w-full lg:w-auto">
        <UserDetails user={user} />
      </div>

      {/* User Orders Section */}
      <div className="flex-1">
        <UserOrders orderData={user?.orders?.length > 0 ? user.orders : []} />
      </div>
    </div>
  </div>
);

};

export default AdminUserDetailsPage;

// <div className="grid grid-cols-6 grid-rows-1">

//       <div className="col-span-2 row-span-1">
//         <UserDetails user={user} />
//       </div>
//       <div className="col-span-3 row-span-1 col-start-3">
//         <UserOrders orderData={user?.orders?.length > 0 ? user.orders : []} />
//       </div>
//       </div>
