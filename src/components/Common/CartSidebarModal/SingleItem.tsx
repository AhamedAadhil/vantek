import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import { Trash } from "lucide-react";
import { removeFromCartHelper } from "@/helper/removeFromCartHelper";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";

const SingleItem = ({ item, removeItemFromCart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleRemoveFromCart = () => {
    // dispatch(removeItemFromCart(item.id));
    removeFromCartHelper(user, item, dispatch, removeItemFromCart);
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
          <Image src={item?.images} alt="product" width={100} height={100} />
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            <a href="#"> {item.name} </a>
          </h3>
          <p className="text-custom-sm">Price: {formatToEuro(item.actualPrice)}</p>
          <p className="text-custom-sm">Quantity: x {item.quantity}</p>
        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <Trash />
      </button>
    </div>
  );
};

export default SingleItem;
