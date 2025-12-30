"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.signup(email, password, name);
      
    if (res.ok) {
      alert("Account created! Please login.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <form onSubmit={handleSignup} className="p-8 bg-zinc-900 rounded-xl border border-zinc-800 w-96 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-3 bg-black border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 bg-black border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 bg-black border border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-blue-600 p-3 mt-6 rounded font-bold hover:bg-blue-700 transition">
          Sign Up
        </button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}