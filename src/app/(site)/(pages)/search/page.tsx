import SearchPage from "@/components/Search";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Search Page | Vantek E-commerce",
  description: "This is Search Page for Vantek E-commerce Site",
  // other metadata
};

const SigninPage = () => {
  return (
    <main>
      <SearchPage />
    </main>
  );
};

export default SigninPage;
