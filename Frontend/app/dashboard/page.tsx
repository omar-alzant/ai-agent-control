"use client";

import { useSocketMetrics } from "../hooks/useSocketMetrics";
import { MetricsDashboard } from "../components/MetricsDashboard";
import { Cpu, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AgentList } from "../components/AgentList";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    // Pass user.id to join the private socket room for this specific user
    const { metrics, totalTokens: liveTokens, isLive } = useSocketMetrics(user?.id ? `user_${user.id}` : undefined);
    const [initialTokens, setInitialTokens] = useState(0);

    useEffect(() => {
        // 1. Redirect if not logged in
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        // 2. Fetch historical tokens from DB
        if (user) {
            api.totalTokens().then(data => {
                setInitialTokens(data.totalTokens);
            }).catch(err => console.error("Failed to load initial stats", err));
        }
    }, [user, loading, router]);

    // Show a basic loader while checking auth
    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!user) return null;

    const displayTotal = initialTokens + liveTokens;

    return (
        <main className="p-8 bg-black min-h-screen text-white">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">System Performance</h1>
                    <p className="text-zinc-500">Welcome back, {user.email}</p>
                </div>
            </header>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Cpu size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Tokens</span>
                    </div>
                    <h1 className="text-4xl font-bold font-mono">
                        {displayTotal.toLocaleString()}
                    </h1>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3 text-emerald-500 mb-2">
                        <Zap size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xl font-semibold">{isLive ? 'Online' : 'Disconnected'}</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MetricsDashboard title="Network Latency" data={metrics.latency} color="#10b981" dataKey="value"/>
                <MetricsDashboard title="Token Throughput" data={metrics.tokens} color="#3b82f6" dataKey="value"/>
            </div>

            <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Active Agents</h2>
                    <Link href="/create" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        + New Agent
                    </Link>
                </div>
                <AgentList />
            </section>
        </main>
    );
}