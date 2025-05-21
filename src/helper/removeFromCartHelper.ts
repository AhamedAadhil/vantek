// Remove item from cart
export const removeFromCartHelper = async (user, item, dispatch,removeItemFromCart) => {
  if (user && item) {
    try {
        console.log("item==",item)
      const res = await fetch(`http://localhost:3000/api/cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "removeProduct",
          userId: user._id,
          productId: item._id,       
          variantId: item.variantId, 
          quantity:item.quantity
        }),
      });

      const data = await res.json();
      console.log("Cart after removal:", data);

      if (res.ok && data.success && data.data) {
      dispatch(removeItemFromCart({ _id: item._id, variantId: item.variantId }))

      } else {
        throw new Error(data.message || "Failed to remove item from cart");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};
