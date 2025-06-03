"use client";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react"; // optional icon library

const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine
  );

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex flex-col items-center text-center text-gray-800 dark:text-white">
          <WifiOff className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">You&apos;re Offline</h2>
          <p className="text-base mb-1">
            Please check your internet connection.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This message will disappear when you&apos;re back online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineOverlay;
