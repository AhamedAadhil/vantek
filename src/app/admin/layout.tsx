"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
// import AdminHeader from "../../components/Admin/AdminHeader";
// import AdminFooter from "../../components/Admin/AdminFooter";

import { ReduxProvider } from "@/redux/provider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              {/* <AdminHeader /> */}
              {children}
            </ReduxProvider>
            <ScrollToTop />
            {/* <AdminFooter /> */}
          </>
        )}
      </body>
    </html>
  );
}
