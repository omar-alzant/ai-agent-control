"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.forgotPassword(email);
    
    if (res.ok) {
      setMessage("Check your email for the reset link!");
    } else {
      alert("Error sending reset email");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-zinc-500 text-sm mb-6">Enter your email to receive a reset link.</p>
        
        {message ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded mb-4">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" placeholder="Email Address" required
              className="w-full p-3 bg-black border border-zinc-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition">
              Send Reset Link
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-500 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}