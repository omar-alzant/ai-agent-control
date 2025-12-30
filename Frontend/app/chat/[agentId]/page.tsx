"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Added useState
import { ChatInterface } from "../../components/ChatInterface";
import { MetricsDashboard } from "../../components/MetricsDashboard";
import { useSocketMetrics } from "../../hooks/useSocketMetrics";
import { useAuth } from "../../context/AuthContext";
import { notFound } from "next/navigation";
import { api } from "../../lib/api"; // Ensure you import your api helper

export default function DynamicChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const agentId = params.agentId as string;
  
  // State for agent validation
  const [agentExists, setAgentExists] = useState<boolean | null>(null);
  const [fetchingAgent, setFetchingAgent] = useState(true);

  
  // 1. Auth & Data Guard
  useEffect(() => {
    async function checkAgent() {
      try {
        const data = await api.getAgents(); // Or a specific getAgent(id) call
        const found = data.find((a: any) => a.id === agentId);
        
        if (!found) {
          setAgentExists(false);
        } else {
          setAgentExists(true);
        }
      } catch (err) {
        setAgentExists(false);
      } finally {
        setFetchingAgent(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        checkAgent();
      }
    }
  }, [user, authLoading, agentId, router]);

  if (agentExists === false) {
    notFound();
  }

  const { metrics, totalTokens, isLive } = useSocketMetrics(agentId);

  // 3. Loading State
  if (authLoading || fetchingAgent) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="animate-pulse">Initializing Agent Session...</p>
      </div>
    );
  }

  if (!user || !agentExists) return null;

  return (
<div className="h-full flex flex-col p-6 gap-6 bg-black min-h-screen">

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

  {/* Chat window takes most of the screen */}

  <div className="lg:col-span-3 h-[85vh]">

 {!isLive && (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20">
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-2xl text-center">
        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm font-medium text-white">Connection Lost</p>
        <p className="text-[10px] text-zinc-500">Attempting to reconnect to agent...</p>
      </div>
    </div>
  )}

  <ChatInterface agentId={agentId} />
  </div>



  {/* Analytics on the side */}

  <div className="flex flex-col gap-4">

    <div className="flex justify-between items-center mb-2">

      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">

        Live Stats

      </h3>

      <div className="flex items-center gap-2">

        <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />

        <span className="text-[10px] text-zinc-400">{isLive ? 'Live' : 'Offline'}</span>

      </div>

    </div>



    <MetricsDashboard

      title="Live Latency"

      data={metrics.latency}

      color="#10b981"

      dataKey="value"

    />



    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-lg">

      <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Session Tokens</p>

      <p className="text-2xl font-bold text-blue-500 font-mono">

        {totalTokens.toLocaleString()}

      </p>

    </div>



    <MetricsDashboard

      title="Token Throughput"

      data={metrics.tokens}

      color="#3b82f6"

      dataKey="value"

    />

  </div>

</div>

</div>
  );
}