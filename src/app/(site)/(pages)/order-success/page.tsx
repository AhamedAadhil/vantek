import React from "react";
import OrderPlacedSuccess from "@/components/OrderPlacedSuccess";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order Success Page | Vantek E-commerce",
  description: "This is Order Success Page for Vantek E-commerce Site",
  // other metadata
};

const MailSuccessPage = () => {
  return (
    <main>
      <OrderPlacedSuccess />
    </main>
  );
};

export default MailSuccessPage;
