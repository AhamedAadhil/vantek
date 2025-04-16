import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Details Page | Vantek E-commerce",
  description: "This is Shop Details Page for Vantek E-commerce Site",
  // other metadata
};

interface Props {
  params: {
    id: string;
  };
}

const ShopDetailsPage = ({ params }: Props) => {
  return (
    <main>
      <ShopDetails productId={params.id} />
    </main>
  );
};

export default ShopDetailsPage;
