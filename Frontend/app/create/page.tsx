"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AgentUsageBar from "../components/AgentQuota";

// Progress Bar Component

export default function CreateAgentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const MAX_AGENTS = 5;
  
  const [agentCount, setAgentCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    systemPrompt: "",
    model: "gpt-3.5-turbo",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    async function fetchQuota() {
      try {
        const agents = await api.getAgents();
        setAgentCount(agents.length);
        router.refresh();
      } catch (err) {
        console.error("Failed to fetch quota", err);
      } finally {
        setCheckingLimit(false);
      }
    }

    if (user) fetchQuota();
  }, [user, loading, router]);

  const isOverLimit = agentCount >= MAX_AGENTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) return;

    try {
      await api.createAgent(formData);
      router.push("/dashboard");
      router.refresh(); 
    } catch (err) {
      alert("Failed to create agent");
    }
  };

  if (loading || checkingLimit) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Configure New Agent</h1>
      <p className="text-zinc-500 mb-8">Define your AI's personality and instructions.</p>

      {/* 1. Integrated Quota Bar */}
      <AgentUsageBar count={agentCount} max={MAX_AGENTS} />

      {/* 2. Alert UI */}
      {isOverLimit && (
        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/50 rounded-lg text-red-500 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>
            <strong>Usage Limit Reached:</strong> You must delete an agent to create a new one.
          </span>
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className={`space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 transition-all ${
          isOverLimit ? 'opacity-50 grayscale pointer-events-none' : 'shadow-2xl'
        }`}
      >
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Agent Name</label>
          <input
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sales Assistant"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">System Prompt</label>
          <textarea
            required
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            placeholder="You are a helpful assistant that..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Model</label>
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
            <option value="gpt-4">GPT-4 (Smart)</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isOverLimit}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            isOverLimit 
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
              : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
          }`}
        >
          {isOverLimit ? "Quota Exceeded" : "Initialize Agent"}
        </button>
      </form>
    </div>
  );
}