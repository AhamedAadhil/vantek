import React from "react";
import { Metadata } from "next";
import AddProducts from "@/components/Admin/AddProduct";

export const metadata: Metadata = {
  title: "Add Product Page | Vantek E-commerce",
  description: "This is Add Product Page for Vantek E-commerce Site",
  // other metadata
};

const addProductPage = () => {
  return (
    <div className=" bg-gray-900 w-full">
      <AddProducts/>
    </div>
  );
};

export default addProductPage;
