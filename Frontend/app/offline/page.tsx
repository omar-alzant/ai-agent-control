"use client";

import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRetry = () => {
    // Force a reload to check if the network is back
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {/* Visual Icon */}
      <div className="bg-zinc-900 p-6 rounded-full mb-6 border border-zinc-800 shadow-xl">
        <WifiOff size={48} className="text-zinc-500 animate-pulse" />
      </div>

      {/* Message */}
      <h1 className="text-2xl font-bold mb-2 text-center">Connection Lost</h1>
      <p className="text-zinc-500 text-center max-w-md mb-8">
        Your dashboard requires an active connection to sync AI agents and live metrics. 
        We'll automatically reconnect once you're back online.
      </p>

      {/* Action Buttons */}
      {/* <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={handleRetry}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
        >
          <RefreshCw size={18} />
          Try Again
        </button>

        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-400 font-medium py-3 rounded-xl border border-zinc-800 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div> */}

      {/* Subtle Hint */}
      <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
        Offline Mode Active
      </p>
    </div>
  );
}