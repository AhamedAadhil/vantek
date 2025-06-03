import ResetPassword from "@/components/Auth/Reset-Password";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reset-Password Page | Vantek E-commerce",
  description: "This is Reset-Password Page for Vantek E-commerce Site",
  // other metadata
};

const SigninPage = () => {
  return (
    <main>
      <ResetPassword />
    </main>
  );
};

export default SigninPage;
