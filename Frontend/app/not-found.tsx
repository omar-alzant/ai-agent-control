"use client";

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-9xl font-bold text-zinc-800">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Agent Not Found</h2>
      <p className="text-zinc-500 mt-2 mb-8 text-center max-w-md">
        The page or agent you are looking for doesn't exist or has been deactivated.
      </p>
      
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all"
      >
        <Home size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}