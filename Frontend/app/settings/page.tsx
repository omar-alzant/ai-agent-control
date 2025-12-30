// app/settings/page.tsx
"use client";

import { ArchivedAgents } from "../components/ArchivedAgents";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import AgentUsageBar from "../components/AgentQuota";

export default function SettingsPage() {
  const [activeCount, setActiveCount] = useState(0);

  const fetchActiveCount = async () => {
    const agents = await api.getAgents(); // Only gets isDeleted: false
    setActiveCount(agents.length);
  };

  useEffect(() => {
    fetchActiveCount();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Workspace Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your agents, quota, and archived data.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Current Usage</h2>
        <AgentUsageBar count={activeCount} max={5} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Archived Agents</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
            Tokens are preserved for archived agents
          </span>
        </div>
        <ArchivedAgents onRestoreSuccess={fetchActiveCount} />
      </section>
    </div>
  );
}