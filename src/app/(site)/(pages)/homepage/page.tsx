"use client";

import Home from "@/components/Home";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchWishlistHelper } from "@/helper/getWishlistHelper";
import { setWishlist } from "@/redux/features/wishlist-slice";
import { fetchCartHelper } from "@/helper/getCartHelper";
import { setCart } from "@/redux/features/cart-slice";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    fetchWishlistHelper(user, dispatch, setWishlist);
    fetchCartHelper(user, dispatch, setCart);
  }, [dispatch, user]);

  return <Home />;
};

export default HomePage;
