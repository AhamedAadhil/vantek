"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "./RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { productData } from "./productData"; // Import product data
const ShopDetails = () => {
  const [activeColor, setActiveColor] = useState("blue");
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [storage, setStorage] = useState("gb128");
  const [quantity, setQuantity] = useState(1);

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
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <div>
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        🔍
                      </button>

                      <Image
                        src={productData.imgs?.previews[previewImg]}
                        alt="products-details"
                        width={400}
                        height={400}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {productData.imgs?.thumbnails.map((item, key) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          key === previewImg ? "border-blue" : "border-transparent"
                        }`}
                      >
                        <Image width={50} height={50} src={item} alt="thumbnail" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-w-[539px] w-full">
                  <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                    {productData.title}
                  </h2>

                  <h3 className="font-medium text-custom-1 mb-4.5">
                    <span className="text-sm sm:text-base text-dark">
                      Price: ${productData.price}
                    </span>
                    <span className="line-through"> ${productData.discountedPrice} </span>
                  </h3>

                  <ul className="flex flex-col gap-2">
                    <li>Availability: {productData.availability}</li>
                    <li>Rating: {productData.ratings} ⭐</li>
                  </ul>

                  <div className="flex flex-wrap items-center gap-4.5">
                    <button
                      onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                      aria-label="Decrease quantity"
                    >
                      ➖
                    </button>

                    <span>{quantity}</span>

                    <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                      ➕
                    </button>
                  </div>

                  <button className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md">
                    Purchase Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ShopDetails;
