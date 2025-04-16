"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "./RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { productData } from "./productData"; // Import product data
import {
  CreditCard,
  Heart,
  Link,
  PackageCheck,
  RefreshCcw,
  Share,
  Share2,
  ShieldCheck,
  Store,
  ThumbsUp,
  Truck,
} from "lucide-react";
const ShopDetails = () => {
  const [activeColor, setActiveColor] = useState("");
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [storage, setStorage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["shop details"]} />

      {productData.title === "" ? (
        "Please add products"
      ) : (
        <>          
          <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
            {/* Column 1 - Product Images */}
            <div className="space-y-4">
              <div className="border rounded-xl overflow-hidden">
                <Image
                  src="/images/products/product-gen-bg-1.png"
                  alt="Rusty Lee Bed"
                  width={500}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="border rounded-xl overflow-hidden w-20 h-20"
                  >
                    <Image
                      src="/images/products/product-gen-bg-1.png"
                      alt="Thumbnail"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Product Info */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rusty Lee 3/4 Campervan Bed – T5/T6
              </h2>
              <div className="flex items-center gap-2 text-yellow-500 text-sm">
                <span>⭐⭐⭐⭐☆</span>
                <span className="text-gray-600">4.7 Star Rating (671)</span>
              </div>
              <p className="text-sm text-gray-600">
                Rusty Lee 3/4 Campervan Bed For VW T5/T6 – Legless – 5 Stage
                Recliner – ISOFIX – M1 Tested – Inc Mounting Plate
              </p>
              <div className="text-3xl font-bold text-green-600">$25.00</div>
              <div className="text-sm line-through text-gray-400">$38.00</div>

              <div className="mt-2">
                <span className="text-green-500 font-medium text-sm">
                  Special Offer: 298d : 2h : 49m : 14s
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                <div className="bg-orange-500 h-2 rounded-full w-3/4"></div>
              </div>
              <div className="text-sm text-gray-600">Available only: 45</div>

              <div className="flex items-center mt-4 gap-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Add To Cart
                </button>
                <button className="bg-blue-100 text-blue-500 border-hidden border-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white">
                  <Heart />
                </button>
                <button className="bg-amber-100 text-amber-500 border-hidden border-green-500 px-4 py-2 rounded-md hover:bg-amber-500 hover:text-white">
                  <Share2 />
                </button>
              </div>

              <div className="bg-orange-100 border border-dashed border-orange-300 p-4 rounded-lg mt-4">
                <p className="text-sm font-semibold text-orange-700">
                  Mfr. coupon. $3.00 off 5
                </p>
                <p className="text-sm text-gray-700 mt-1">Buy 1, Get 1 FREE</p>
              </div>
            </div>

            {/* Column 3 - Why Choose Us */}
            <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-gray-200">
              <div className="bg-blueGray-800 p-2 rounded-full flex justify-center">
                <h3 className="text-xl font-semibold text-white">
                  Why you choose us?
                </h3>
              </div>

              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <Truck className="text-green-500" />
                </div>

                <p className="text-sm text-gray-700">
                  Fast Delivery - Lightning-fast shipping, guaranteed.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <RefreshCcw className="text-green-500" />
                </div>

                <p className="text-sm text-gray-700">
                  Free 90-day returns - Shop risk-free with easy returns.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <Store className="text-green-500" />
                </div>

                <p className="text-sm text-gray-700">
                  Pickup available at Shop location - Usually ready in 24 hours.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <CreditCard className="text-green-500" />
                </div>

                <p className="text-sm text-gray-700">
                  Multiple Payment Options - Card, Google Pay, Online payment.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <ShieldCheck className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Warranty - Covered under Consumer Protection Act.
                </p>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <div className="bg-white p-1 rounded-full">
                  <PackageCheck className="text-green-500" />
                </div>
                <p className="text-sm text-gray-700">
                  Secure Packaging - High-quality packaging ensured.
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-[1170px] mx-auto px-4 mt-10 p-6 border bg-white rounded-lg shadow-md">
            {/* Description & Reviews Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 rounded-t-md font-semibold transition ${
                    activeTab === "description"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 rounded-t-md font-semibold transition ${
                    activeTab === "reviews"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* <div className="flex items-center ml-1 space-x-2 text-green-600 text-sm font-semibold">
                <ThumbsUp size={16} />
                <span>100% Satisfaction Guaranteed</span>
              </div> */}
            </div>

            {/* Tab Content */}
            <div className="mt-6 text-gray-800 leading-relaxed">
              {activeTab === "description" ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Rusty Lee 3/4 Campervan Bed For VW T5/T6
                  </h3>
                  <p className="mb-4">
                    This is the ¾ Width TUV-In-Vehicle-Tested and Approved Bed.
                    This is where the ‘ROCK N ROLL’ bed comes into its own! This
                    is the gold standard in bed safety, and no other UK-made bed
                    has this certification. Many other beds are only plate
                    tested. There is a major difference.
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Width 1120mm</li>
                    <li>Length in Bed Mode 1830mm</li>
                    <li>
                      Fully Powder Coated in Black (Other Colours Available To
                      Order)
                    </li>
                    <li>Storage Space Underneath The Bed</li>
                    <li>Includes Gas Strut And Two Seat Belts</li>
                    <li>
                      Please Note: T6.1s Require Our TUV Tested{" "}
                      <a href="#" className="text-green-600 underline">
                        chassis Mounting Plate
                      </a>
                    </li>
                    <li>M1 Tested</li>
                    <li>Easy to Operate</li>
                    <li>All Fittings & Installation components included</li>
                    <li>T5, T5.1, T6 & T6.1</li>
                    <li>2003–Current Models</li>
                    <li>Does Not Fit A LHD Vehicle</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Customer Reviews
                  </h3>
                  <p className="text-gray-600 italic">
                    "Very sturdy, fits perfectly in my T6. Easy to operate and
                    super safe. Worth every penny!"
                  </p>
                  <p className="mt-4 text-gray-600 italic">
                    "Absolutely love the quality. Installation was
                    straightforward and the reclining feature is great."
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShopDetails;
