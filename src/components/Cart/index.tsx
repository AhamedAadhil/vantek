"use client";
import React from "react";
import OrderSummary from "./OrderSummary";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const user = useSelector((state: RootState) => state.auth.user);

  const clearCart = async () => {
    try {
      const res = await fetch(
        `/cart`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "clearCart",
            userId: user._id,
          }),
        }
      );
      const response = await res.json();
      if (res.ok) {
        dispatch(removeAllItemsFromCart());
        toast.success("Cart cleared successfully!");
      } else {
        console.error("Error clearing cart:", response.message);
        toast.error("Failed to clear cart. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Your Cart</h2>
              <button onClick={clearCart} className="text-blue">
                Clear Shopping Cart
              </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header --> */}
                  <div className="flex items-center py-5.5 px-7.5">
                    <div className="min-w-[400px]">
                      <p className="text-dark">Product</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark">Price</p>
                    </div>

                    <div className="min-w-[275px]">
                      <p className="text-dark">Quantity</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark">Subtotal</p>
                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark text-right">Action</p>
                    </div>
                  </div>

                  {/* <!-- cart item --> */}
                  {cartItems.length > 0 &&
                    cartItems.map((item, key) => (
                      <SingleItem item={item} key={key} />
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              {/* <Discount /> */}
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="text-center mt-8">
            <div className="mx-auto pb-7.5">
              <div className="mx-auto w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart size={40} className="text-muted-foreground" />
              </div>
            </div>

            <p className="pb-6">Your cart is empty!</p>

            <Link
              href="/shop"
              className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
            >
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
