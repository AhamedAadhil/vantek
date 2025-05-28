"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.cartReducer);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isUk, setIsUk] = useState(true); // Assume true by default (UK shipping)
  const [shippingFee, setShippingFee] = useState(0);
  const totalAmount = cart.totalPrice;
  const [billingData, setBillingData] = useState({
    firstName: "",
    email: "",
    houseNumber: "",
    address: "",
    addressTwo: "",
    town: "",
    countryName: "England",
    country: "",
    phone: "",
    zipCode: "",
    province: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting all data:", billingData);

    // You can now submit billingData along with other checkout data here
  };

  useEffect(() => {
    let fee = 0;
    if (isUk && totalAmount < 150000) {
      if (shippingMethod === "express") {
        fee = 8.5;
      } else if (shippingMethod === "standard") {
        fee = 4.5;
      }
    }
    setShippingFee(fee);
  }, [shippingMethod, isUk, totalAmount]);

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
            Billing details
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                {/* <Login /> */}

                {/* <!-- billing details --> */}
                <Billing
                  formValues={billingData}
                  setFormValues={setBillingData}
                  isUk={isUk}
                  setIsUk={setIsUk}
                />

                {/* <!-- address box two --> */}
                {/* <Shipping /> */}

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- shipping box --> */}
                <ShippingMethod
                  isUk={isUk}
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                />

                {/* <!-- payment box --> */}
                {/* <PaymentMethod /> */}

                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items dynamically --> */}
                    {cart.items.map((item) => (
                      <div
                        key={`${item._id}-${item.variantId}`}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <div className="flex items-start gap-2">
                          {item.images && (
                            <Image
                              src={item.images}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          )}
                          <div className="flex flex-col">
                            <p className="text-dark line-clamp-2 text-sm sm:text-base">
                              {item.name}
                            </p>
                            <span className="text-dark-5 text-xs">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-dark text-right text-sm sm:text-base">
                            ${item.actualPrice * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- shipping fee --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">
                          ${shippingFee.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${(totalAmount + shippingFee).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Pay with Paypal
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
