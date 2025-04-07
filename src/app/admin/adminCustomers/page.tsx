import React from "react";
import { Metadata } from "next";
import Customers from "@/components/Admin/Customers";

export const metadata: Metadata = {
  title: "Customer management Page | Vantek E-commerce",
  description: "This is Customer management Page for Vantek E-commerce Site",
  // other metadata
};

const AdminCustomerPage = () => {
  return (
    <div className="bg-gray-900 w-screen h-auto">
      <div>
        <Customers/>
      </div>
    </div>
  );
};

export default AdminCustomerPage;