import { ICart } from "@/lib/models/cart";

export function cleanCart(cart: ICart) {
  const raw = cart.toObject();

  raw.items = raw.items.map((item: any) => {
    const product = item.product;

    // Case 1: Populated product
    if (product && typeof product === "object" && product._doc) {
      const { _id, variants, ...rest } = product._doc;
      return {
        ...item,
        product: {
          _id,
          ...rest,
        },
      };
    }

    // Case 2: Not populated — product is just an ObjectId
    return {
      ...item,
      product: {
        _id: product.toString(), // Convert ObjectId to string directly
      },
    };
  });

  return raw;
}
