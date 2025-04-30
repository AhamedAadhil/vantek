import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Vantek E-commerce",
  description: "This is Home Page for Vantek E-commerce Site",
  // other metadata
};

export default function HomePage() {

  return (
    <>
      <Home />
    </>
  );
}
