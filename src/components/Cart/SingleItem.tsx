import React, { useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";

import Image from "next/image";
import { Trash } from "lucide-react";
import { removeFromCartHelper } from "@/helper/removeFromCartHelper";

const SingleItem = ({ item }) => {
  console.log("SingleItem", item);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleRemoveFromCart = () => {
    // dispatch(removeItemFromCart(item.id));
    removeFromCartHelper(user, item, dispatch, removeItemFromCart);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    dispatch(
      updateCartItemQuantity({
        id: item.id,
        quantity: quantity + 1,
        variantId: 0,
      })
    );
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(
        updateCartItemQuantity({
          id: item.id,
          quantity: quantity - 1,
          variantId: 0,
        })
      );
    } else {
      return;
    }
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
              <Image width={200} height={200} src={item.images} alt="product" />
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <a href="#"> {item.name} </a>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[180px]">
        <p className="text-dark">${item.actualPrice}</p>
      </div>

      <div className="min-w-[275px]">
        <div className="w-max flex items-center ">
          <span className="flex items-center justify-center w-16 h-11.5 ">
            {quantity}
          </span>
        </div>
      </div>

      <div className="min-w-[200px]">
        <p className="text-dark">${item.actualPrice * quantity}</p>
      </div>

      <div className="min-w-[50px] flex justify-end">
        <button
          onClick={() => handleRemoveFromCart()}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
