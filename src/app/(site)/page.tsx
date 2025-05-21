'use client'
import Home from "@/components/Home";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {fetchWishlistHelper} from '@/helper/getWishlistHelper'
import { setWishlist } from "@/redux/features/wishlist-slice";
import { fetchCartHelper } from "@/helper/getCartHelper";
import { setCart } from "@/redux/features/cart-slice";



export default function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user); // ✅ Get user from Redux
  const dispatch = useDispatch();
    useEffect(() => {
       fetchWishlistHelper(user,dispatch,setWishlist);
       fetchCartHelper(user,dispatch,setCart)
    }, []);

  return (
    <>
      <Home />
    </>
  );
}
