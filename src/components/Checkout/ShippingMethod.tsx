import Image from "next/image";
import React from "react";

const ShippingMethod = ({
  isUk,
  shippingMethod,
  setShippingMethod,
}: {
  isUk: boolean;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
}) => {
  if (!isUk) return null; // Hide for non-UK users

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5 flex flex-col gap-4">
        {/* Standard Delivery */}
        <label
          htmlFor="standard"
          className="flex cursor-pointer select-none items-center gap-3.5"
        >
          <input
            type="radio"
            name="shipping"
            id="standard"
            checked={shippingMethod === "standard"}
            onChange={() => setShippingMethod("standard")}
            className="sr-only"
          />
          <div
            className={`flex h-4 w-4 items-center justify-center rounded-full ${
              shippingMethod === "standard"
                ? "border-4 border-blue"
                : "border border-gray-4"
            }`}
          ></div>

          <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none">
            <div className="flex items-center">
              <div className="pr-4 flex flex-row">
                <Image
                  src={"/images/checkout/standard.png"}
                  className="mr-3"
                  width={50}
                  height={50}
                  alt={"shipping icon"}
                />
                <span className="font-semibold text-dark">£4.50</span>
              </div>
              <div className="border-l border-gray-4 pl-4">
                <p className="text-custom-xs">Standard Delivery</p>
              </div>
            </div>
          </div>
        </label>

        {/* Next Day Delivery */}
        <label
          htmlFor="express"
          className="flex cursor-pointer select-none items-center gap-3.5"
        >
          <input
            type="radio"
            name="shipping"
            id="express"
            checked={shippingMethod === "express"}
            onChange={() => setShippingMethod("express")}
            className="sr-only"
          />
          <div
            className={`flex h-4 w-4 items-center justify-center rounded-full ${
              shippingMethod === "express"
                ? "border-4 border-blue"
                : "border border-gray-4"
            }`}
          ></div>

          <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none">
            <div className="flex items-center">
              <div className="pr-4 flex flex-row">
                <Image
                  className="mr-3"
                  src={"/images/checkout/Royal_Mail.svg.png"}
                  width={50}
                  height={50}
                  alt={"shipping icon"}
                />
                <span className="font-semibold text-dark">£8.50</span>
              </div>
              <div className="border-l border-gray-4 pl-4">
                <p className="text-custom-xs">Next Day Delivery (Express)</p>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ShippingMethod;
