"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link"; // Import Link for navigation
import { api } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-zinc-900 rounded-xl border border-zinc-800 w-96 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Ai-ojz Agent</h1>
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 bg-black border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <input 
              type="password" placeholder="Password" required
              className="w-full p-3 bg-black border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-blue-400">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 p-3 mt-6 rounded font-bold hover:bg-blue-700 transition">
          Sign In
        </button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}