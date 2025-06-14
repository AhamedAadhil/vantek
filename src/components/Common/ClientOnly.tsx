"use client";
import { useState, useEffect } from "react";
import PreLoader from "./PreLoader";

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PreLoader />;
  return <>{children}</>;
}
