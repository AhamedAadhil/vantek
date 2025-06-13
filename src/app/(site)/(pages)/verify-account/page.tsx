import React from "react";
import { Metadata } from "next";
import VerifyAccount from "@/components/Auth/Verify-Account";
export const metadata: Metadata = {
  title: "Verify-Account Page | Vantek E-commerce",
  description: "This is Verify-Account Page for Vantek E-commerce Site",
  // other metadata
};

const VerifyAccountPage = () => {
  return (
    <main>
      <VerifyAccount />
    </main>
  );
};

export default VerifyAccountPage;
