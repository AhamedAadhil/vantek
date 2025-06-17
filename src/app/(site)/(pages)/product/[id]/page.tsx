import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASEURL
          : process.env.NEXT_PUBLIC_BASEURL_LOCAL
      }/products/${params.id}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    const product = data.product;

    // Compose description safely
    const description =
      product.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
      `Buy ${product.name} online from Vantek.`;

    // Compose keywords from tags + categories + product name
    const keywords = [
      ...product.tags,
      product.mainCategory,
      product.subCategory1,
      product.subCategory2,
      product.name,
    ]
      .filter(Boolean)
      .join(", ");

    // First variant for price and stock fallback
    const firstVariant = product.variants?.[0] || {
      actualPrice: 0,
      stock: 0,
      _id: "",
    };

    return {
      title: `${product.name} | ${product.mainCategory} - Vantek E-commerce`,
      description,
      keywords,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASEURL}/shop-details/${product._id}`,
      },
      openGraph: {
        title: product.name,
        description,
        url: `${process.env.NEXT_PUBLIC_BASEURL}/shop-details/${product._id}`,
        images: product.images?.length
          ? product.images.map((url: string) => ({ url }))
          : [],
        siteName: "Vantek E-commerce",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: "@VantekStore",
        creator: "@VantekStore",
        title: product.name,
        description,
        images: product.images?.length ? [product.images[0]] : [],
      },
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASEURL || "https://example.com"
      ),
      robots: "index, follow",
    };
  } catch (error) {
    return {
      title: "Product Not Found | Vantek E-commerce",
      description: "The product you're looking for doesn't exist.",
      robots: "noindex, nofollow",
    };
  }
}

interface Props {
  params: {
    id: string;
  };
}

const ShopDetailsPage = ({ params }: Props) => {
  return (
    <main>
      <ShopDetails productId={params.id} />
    </main>
  );
};

export default ShopDetailsPage;
