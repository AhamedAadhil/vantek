import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";
import ProductList from "@/components/Admin/Products";

export const metadata: Metadata = {
  title: "Inventory management Page | Vantek E-commerce",
  description: "This is Inventory management Page for Vantek E-commerce Site",
  // other metadata
};

const InventoryPage = () => {
  return (
    <main>
      <ProductList/>
    </main>
  );
};

export default InventoryPage;
