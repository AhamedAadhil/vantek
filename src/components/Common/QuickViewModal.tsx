"use client";
import React, { useEffect, useState } from "react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { CheckCircle, CircleX, Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const wishlist = useSelector(
    (state: RootState) => state.wishlistReducer.items
  );
  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);
  const isInWishlist = wishlist.some(
    (wishItem) => wishItem._id === product._id
  );

  const handleItemToWishList = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    // Optimistically update the Redux state
    const isInWishlist = wishlist.some(
      (wishItem) => wishItem._id === product._id
    );

    if (isInWishlist) {
      // Remove from wishlist if item already exists
      dispatch(removeItemFromWishlist(product._id));
    } else {
      // Add to wishlist if item doesn't exist
      dispatch(addItemToWishlist(product));
    }

    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/products/wishlist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle product state!");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const [activePreview, setActivePreview] = useState(0);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);

  return (
    <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            <div className="max-w-[526px] w-full">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {product?.images?.map((img, key) => (
                    <button
                      onClick={() => setActivePreview(key)}
                      key={key}
                      className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                        activePreview === key && "border-2 border-blue"
                      }`}
                    >
                      <Image
                        src={img || ""}
                        alt="thumbnail"
                        width={61}
                        height={61}
                        className="aspect-square"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                  <div>
                    {product?.images?.[activePreview] ? (
                      <Image
                        src={product.images[activePreview]}
                        alt="products-details"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="text-gray-500 text-sm">
                        No preview available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[445px] w-full">
              <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-green mb-6.5">
                SALE 20% OFF
              </span>

              <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                {product.name}
              </h3>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div className="flex items-center gap-1.5">
                  {/* <!-- stars --> */}
                  <div className="flex items-center gap-1">
                    <Star color="gold" fill="gold" />
                  </div>

                  <span>
                    <span className="font-medium text-dark">
                      {product.overAllRating} Rating
                    </span>
                    <span className="text-dark-2">
                      {" "}
                      ({product.reviews?.length} reviews){" "}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {product.variants?.[0]?.stock > 1 ? (
                    <CheckCircle size={16} color="green" />
                  ) : (
                    <CircleX size={16} color="red" />
                  )}

                  <span className="font-medium text-dark">
                    {product.variants?.[0]?.stock > 1
                      ? "In Stock"
                      : " Ot of Stock"}
                  </span>
                </div>
              </div>

              <p
                className="prose prose-sm max-w-none text-gray-800 line-clamp-5"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              ></p>

              <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    Price
                  </h4>

                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-xl xl:text-heading-4">
                      ${product.variants[0].actualPrice}
                    </span>
                    <span className="font-medium text-dark-4 text-lg xl:text-2xl line-through">
                      ${product.variants[0].labelPrice}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  disabled={quantity === 0 && true}
                  onClick={() => {
                    closeModal();
                    router.push(`/product/${product._id}`);
                  }}
                  className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark
                  `}
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleItemToWishList()}
                  className={`inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-95 `}
                >
                  <Heart
                    size={16}
                    color={isInWishlist ? "red" : "white"}
                    fill={isInWishlist ? "red" : "white"}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
