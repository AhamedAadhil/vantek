"use client";
import React from "react";

import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "@/redux/features/wishlist-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const wishlist = useSelector(
    (state: RootState) => state.wishlistReducer.items
  );

  const isInWishlist = wishlist.some((wishItem) => wishItem._id === item._id);

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleItemToWishList = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    // Optimistically update the Redux state
    const isInWishlist = wishlist.some((wishItem) => wishItem._id === item._id);

    if (isInWishlist) {
      // Remove from wishlist if item already exists
      dispatch(removeItemFromWishlist(item._id));
      toast.info("Item removed from wishlist!");
    } else {
      // Add to wishlist if item doesn't exist
      dispatch(addItemToWishlist(item));
      toast.success("Item added to wishlist!");
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
            productId: item._id,
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

  return (
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex">
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4">
          <Image src={item?.images[0]} alt="" width={250} height={250} />

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <Eye size={16} color="gray" />
          </button>

            <button
              onClick={() => router.push(`/product/${item._id}`)}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
            >
              View Product
            </button>

            <button
              // disabled = {!user}
              onClick={() => handleItemToWishList()}
              aria-label="button for favorite select"
              id="favOne"
              className=" flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
            >
              <Heart
                size={16}
                color={isInWishlist ? "red" : "gray"}
                fill={isInWishlist ? "red" : "white"}
              />
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
              <Link href="/product"> {item?.name} </Link>
            </h3>

            <span className="flex items-center gap-2 font-medium text-lg">
              <span className="text-dark">
                {formatToEuro(item.variants[0]?.actualPrice)}
              </span>
              <span className="text-dark-4 line-through">
                {formatToEuro(item.variants[0]?.labelPrice)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              {/* <Image
                src="/images/icons/icon-star.svg"
                alt="star icon"
                width={15}
                height={15}
              /> */}
              <Star size={15} color="gold" fill="gold" />
            </div>

            <p className="text-custom-sm">
              {item?.overAllRating} ({item?.reviews?.length})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
