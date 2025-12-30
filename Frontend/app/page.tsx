"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { useSocketMetrics } from "./hooks/useSocketMetrics";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { useAuth } from "./context/AuthContext";
import { notFound } from "next/navigation";


export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const agentId = params.agentId as string;
  if (!agentId) {
    notFound(); // This will trigger the app/not-found.tsx page
  }
  // Pass agentId to the hook so it joins the specific Socket.io room
  const { metrics, isLive } = useSocketMetrics(agentId);

  // AUTH PROTECTION: Redirect if user is null after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Prevent rendering while checking auth state
  if (loading) return <div className="p-8 text-white">Loading session...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col h-full p-6 bg-black"> {/* Changed bg-red to bg-black */}
      <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm w-fit">
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh]">
        {/* Chat Area */}
        <div className="lg:col-span-3 h-full">
          {/* We pass the userId here too in case ChatInterface needs it */}
          <ChatInterface agentId={agentId} />
        </div>

        {/* Local Metrics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agent Performance</h3>
          <div className="relative">
          {!isLive && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                Reconnecting to Stream...
              </span>
            </div>
          )}
            <MetricsDashboard title="Latency" data={metrics.latency} color="#10b981" dataKey="value" />
            <MetricsDashboard title="Tokens" data={metrics.tokens} color="#3b82f6" dataKey="value" />
          </div>
          
          <div className="mt-auto p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Connection State</p>
              <div className="flex items-center gap-2">
                 <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                 <span className="text-xs text-zinc-300">
                    {isLive ? `Room: ${agentId.slice(0, 8)}...` : 'Connecting...'}
                 </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}