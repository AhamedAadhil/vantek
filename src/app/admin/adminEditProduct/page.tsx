import React from "react";
import { Metadata } from "next";
import EditProducts from "@/components/Admin/EditProduct";

export const metadata: Metadata = {
  title: "Edit Product Page | Vantek E-commerce",
  description: "This is Edit Product Page for Vantek E-commerce Site",
  // other metadata
};

const editProductPage = () => {
  return (
    <div className=" bg-gray-900 w-full">
      <EditProducts/>
    </div>
  );
};

export default editProductPage;
