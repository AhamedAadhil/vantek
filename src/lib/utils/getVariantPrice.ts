import { IProduct } from "@/lib/models/product";

export function getVariantPrice(product: IProduct, variantId: string): number {
  const variant = product.variants.find(
    (v: any) => v._id.toString() === variantId
  );
  return variant?.actualPrice ?? 0;
}
