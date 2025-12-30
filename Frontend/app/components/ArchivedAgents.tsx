"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";
import { RefreshCcw, Trash2, Archive } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Import your auth hook


interface ArchivedAgentsProps {
  onRestoreSuccess: () => void;
}

export function ArchivedAgents({ onRestoreSuccess }: ArchivedAgentsProps) {
  const [archived, setArchived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const data = await api.getArchivedAgents();
      setArchived(data);
      router.refresh();

    } catch (err) {
      console.error("Failed to load archive", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await api.restoreAgent(id);
      
      // This is the "magic" that tells the Sidebar to update 
      // without needing a page navigation
      window.dispatchEvent(new Event("agent-sync"));
      
      await fetchArchived(); // Refresh the table you are looking at
      router.refresh(); 
    } catch (err: any) {
      alert(err.message); 
    }
  };

 const handlePermanentDelete = async (id: string) => {
    if (!user?.permissionToDelete) {
      alert("You do not have permission to permanently delete agents.");
      return;
    }

    if (!confirm("Are you sure? This will permanently delete the agent and all associated token logs.")) return;
    
    try {
      await api.deleteAgent(id); 
      window.dispatchEvent(new Event("agent-sync"));
      fetchArchived();
      router.refresh();
    } catch (err) {
      alert("Failed to delete agent permanently.");
    }
  };

  if (loading) return <div className="text-zinc-500 animate-pulse">Loading archive...</div>;

  if (archived.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <Archive className="text-zinc-700 mb-4" size={40} />
        <p className="text-zinc-500">Your archive is empty.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
          <tr>
            <th className="px-6 py-4">Agent Name</th>
            <th className="px-6 py-4">Model</th>
            <th className="px-6 py-4">Deleted On</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {archived.map((agent) => (
            <tr key={agent.id} className="group hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4 text-white font-medium">{agent.name}</td>
              <td className="px-6 py-4 text-zinc-400">{agent.model}</td>
              <td className="px-6 py-4 text-zinc-500">
                {new Date(agent.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleRestore(agent.id)}
                    className="flex items-center gap-1.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold"
                  >
                    <RefreshCcw size={14} />
                    Restore
                  </button>
                  {user?.permissionToDelete && <button
                    onClick={() => handlePermanentDelete(agent.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors"
                    title="Delete Permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}