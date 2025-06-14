//Fetch Wishlist
export const fetchWishlistHelper = async (user, dispatch, setWishlist) => {
  if (user) {
    try {
      const res = await fetch(
        `/products/wishlist`
      );
      const data = await res.json();

      if (res.ok) {
        dispatch(setWishlist(data.data.products));
      } else {
        throw new Error(data.message || "Failed to fetch wishlist");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};
