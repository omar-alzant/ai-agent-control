"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import { Archive, Bot, MessageSquare, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AgentList() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to Archive "${name}"?`)) return;

    try {
      await api.archiveAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
      router.refresh();
    } catch (err) {
      alert("Failed to Archive agent");
    }
  };

  if (loading) return <div className="text-zinc-500 animate-pulse">Loading agents...</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {agents.map((agent) => (
        <div key={agent.id} className="p-5 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl flex items-center justify-between transition-all group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{agent.name}</h3>
              <p className="text-zinc-500 text-sm line-clamp-1 max-w-md">{agent.systemPrompt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
               {agent.model}
             </span>
             <Link  
               href={`/chat/${agent.id}`}
               title="Open agent to chat"
               className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
             >
               <MessageSquare size={20} />
             </Link>
             <button 
               onClick={() => handleArchive(agent.id, agent.name)}
              title="Archive"
               className="p-2 text-zinc-400 hover:text-green-500 hover:bg-cyan-500/10 rounded-lg transition-all"
             >
               <Archive size={20} />
             </button>
          </div>
        </div>
      ))}
      
      {agents.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500">No agents found. Start by creating your first one!</p>
          <Link href="/create" className="text-blue-500 hover:underline mt-2 inline-block text-sm">
            Create Agent
          </Link>
        </div>
      )}
    </div>
  );
}