import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import Sidebar from "@/components/Admin/Sidebar";
import OfflineOverlay from "@/components/Common/OfflineOverlay";
import { Toaster } from "sonner";
import ClientOnly from "@/components/Common/ClientOnly";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Vantek E-commerce",
  description: "Admin dashboard for managing Vantek E-commerce site",
  icons: {
    icon: "/favicon.png", // can be .ico, .png, .svg
  },
  robots: "noindex, nofollow", // Prevents search engines from indexing this page
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
                  {/* <Header /> */}
                  <div className="flex flex-row">
                    <Sidebar />
                    {children}
                  </div>

                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ReduxProvider>
          <ScrollToTop />
        </ClientOnly>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
