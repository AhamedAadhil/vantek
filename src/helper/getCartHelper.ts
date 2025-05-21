 
  //Fetch CartData
export const fetchCartHelper = async (user, dispatch, setCart) => {
  if (user) {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${user._id}`);
      const data = await res.json();
      console.log("Fetched Cart:", data);

      if (res.ok && data.success && data.data) {
        const transformedItems = data.data.items.map((item: any) => ({
          _id: item.product._id,
          name:item.product.name,
          actualPrice: item.variantActualPrice,
          variantId:item.variantId,
          quantity: item.quantity,
          images: item.product.images?.[0] || "/placeholder.png",
        }));

        dispatch(
          setCart({
            items: transformedItems,
            totalPrice: data.data.totalPrice,
            totalItems: data.data.totalItems,
          })
        );
      } else {
        throw new Error(data.message || "Failed to fetch cart");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
};
