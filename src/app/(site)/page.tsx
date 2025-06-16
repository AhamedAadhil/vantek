// app/page.tsx — SERVER COMPONENT (no "use client")
import { Metadata } from "next";
import HomePage from "./(pages)/homepage/page";

export const metadata: Metadata = {
  title: "Vantek - UK’s Trusted Volkswagen Vehicle Parts Online Store",
  description:
    "Shop genuine and high-quality Volkswagen vehicle parts at Vantek. Serving customers across the UK and internationally with fast delivery and expert support.",
  keywords:
    "Vantek, Volkswagen parts, vehicle parts, UK ecommerce, car parts, automotive, Volkswagen accessories, UK, international shipping",
  icons: {
    icon: "src\app\favicon.png", // can be .ico, .png, .svg
  },
  alternates: {
    canonical: "https://www.vantekid.com",
  },
  openGraph: {
    title: "Vantek - Volkswagen Vehicle Parts Online Store",
    description:
      "Find a wide range of Volkswagen vehicle parts and accessories. Reliable service and fast shipping across the UK and beyond.",
    url: "https://www.vantekid.com",
    siteName: "Vantek",
    images: [
      {
        url: "https://www.vantekid.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vantek Volkswagen Parts Store Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@VantekStore",
    title: "Vantek - UK Volkswagen Vehicle Parts",
    description:
      "Shop genuine Volkswagen parts online with fast delivery in the UK and worldwide.",
    images: ["https://www.vantekid.com/og-image.png"],
  },
  robots: "index, follow",
};

export default function Page() {
  return <HomePage />;
}
