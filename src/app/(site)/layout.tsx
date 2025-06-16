import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import { Toaster } from "sonner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import OfflineOverlay from "@/components/Common/OfflineOverlay";
import ClientOnly from "@/components/Common/ClientOnly";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vantek - UK’s Trusted Volkswagen Vehicle Parts Online Store",
  description:
    "Shop genuine and high-quality Volkswagen vehicle parts at Vantek. Serving customers across the UK and internationally with fast delivery and expert support.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <Toaster richColors position="top-right" />
        <OfflineOverlay />
        <ClientOnly>
          <ReduxProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header />
                  {children}

                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ReduxProvider>
          <ScrollToTop />
          <Footer />
        </ClientOnly>
      </body>
    </html>
  );
}
