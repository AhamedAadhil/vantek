import ForgotPassword from "@/components/Auth/Forgot-Password";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot-Password Page | Vantek E-commerce",
  description: "This is Forgot-Password Page for Vantek E-commerce Site",
  // other metadata
};

const SigninPage = () => {
  return (
    <main>
      <ForgotPassword />
    </main>
  );
};

export default SigninPage;
