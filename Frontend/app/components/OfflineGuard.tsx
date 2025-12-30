// app/components/OfflineGuard.tsx
"use client";

import { useEffect, useState } from "react";
import OfflinePage from "../offline/page";

export function OfflineGuard({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Navigation Blocker Overlay */}
      {!isOnline && (
        <div className="fixed inset-0 z-[9999] bg-black/60 cursor-not-allowed">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <OfflinePage /> {/* Your offline UI we created earlier */}
          </div>
        </div>
      )}
  
      {/* This content is "under" the overlay and unclickable when offline */}
      {children}
    </div>
  );
}