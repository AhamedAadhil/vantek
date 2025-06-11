"use client";

// pages/redirect.jsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TempRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop");
  }, [router]);

  return null;
}
