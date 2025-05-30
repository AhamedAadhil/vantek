// Remove item from cart
export const removeFromCartHelper = async (
  user,
  item,
  dispatch,
  removeItemFromCart
) => {
  if (user && item) {
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/cart`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "removeProduct",
            userId: user._id,
            productId: item._id,
            variantId: item.variantId,
            quantity: item.quantity,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        dispatch(
          removeItemFromCart({ _id: item._id, variantId: item.variantId })
        );
      } else {
        throw new Error(data.message || "Failed to remove item from cart");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};
