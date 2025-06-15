import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop All Products | Vantek E-commerce",
  description:
    "Browse the full range of Volkswagen vehicle parts and accessories at Vantek. Find genuine, high-quality products with fast shipping across the UK and worldwide.",
  keywords:
    "Vantek, Volkswagen parts, vehicle parts, car accessories, automotive, online store, UK, fast shipping",
  alternates: {
    canonical: "https://www.vantekid.com/shop",
  },
  openGraph: {
    title: "Shop All Products | Vantek E-commerce",
    description:
      "Explore a wide selection of Volkswagen vehicle parts and accessories. Shop with confidence at Vantek.",
    url: "https://www.vantekid.com/shop",
    siteName: "Vantek",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@VantekStore",
    title: "Shop All Products | Vantek E-commerce",
    description:
      "Find genuine Volkswagen parts and accessories with fast delivery in the UK and internationally.",
  },
  robots: "index, follow",
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
