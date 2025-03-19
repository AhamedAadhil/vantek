import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import Orders from "../Admin/Orders";
import Customers from "../Admin/Customers";
import AddProduct from "../Admin/AddProduct";
const Home = () => {
  return (
    <main>
      <Hero />
      <AddProduct />
      <Orders />
      <Customers />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
