"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Bot,
  Menu,
  X,
  LogOut,
  Settings
} from "lucide-react";
import clsx from "clsx";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Agent {
  id: string;
  name: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth(); 
  const [archiveCount, setArchiveCount] = useState(0);
  useEffect(() => {
    const handleSync = () => {
      // 1. Refresh Active Agents
      api.getAgents()
        .then((data) => setAgents(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Sync Error:", err));
        
      // 2. Refresh Archive Count
      api.getArchivedAgents()
        .then(data => setArchiveCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setArchiveCount(0));
    };
  
    // Run immediately on mount or path change
    if (!loading && user) {
      handleSync();
    }
  
    if (!loading && !user) {
      setAgents([]);
      setArchiveCount(0);
      return;
    }
    // Set up the listener for manual triggers (like the Restore button)
    window.addEventListener("agent-sync", handleSync);
    
    return () => window.removeEventListener("agent-sync", handleSync);
  }, [user, loading, pathname]); 
 
   if (loading) return <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 text-zinc-500">Loading session...</div>;

  return (
    <>
      <div className="md:hidden flex items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <button onClick={() => setOpen(true)} className="text-zinc-400 hover:text-white">
          <Menu size={22} />
        </button>
      </div>

      <aside className={clsx(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 text-white font-bold text-lg px-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">AI</div>
              AgentCenter
            </div>
            <button onClick={() => setOpen(false)} className="md:hidden text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-6 overflow-y-auto">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-3 mb-2">Main</p>
              <div className="space-y-1">
                <Link href="/dashboard" onClick={() => setOpen(false)} className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm", 
                    pathname === "/dashboard" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}>
                  <LayoutDashboard size={18} /> <span>Dashboard</span>
                </Link>
                <Link href="/create" onClick={() => setOpen(false)} className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    pathname === "/create" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}>
                  <PlusCircle size={18} /> <span>New Agent</span>
                </Link>
              </div>
            </div>

            {user && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold px-3 mb-2">My Agents</p>
              <div className="space-y-1">
                {agents.map((agent) => (
                  <Link key={agent.id} href={`/chat/${agent.id}`} onClick={() => setOpen(false)} className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      pathname === `/chat/${agent.id}` ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}>
                    <Bot size={16} /> <span className="truncate">{agent.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            )}
          </nav>
          <div className="mt-auto border-t border-zinc-800 pt-4">
          <Link 
              href="/settings" 
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                pathname === "/settings" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span>Settings & Archive</span>
              </div>
              {archiveCount > 0 && (
                <span className="bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {archiveCount}
                </span>
              )}
            </Link>
        </div>
          {/* User Profile / Logout */}
          <div className="mt-auto pt-4 border-t border-zinc-800 px-2">
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Account</p>
            <div className="flex items-center justify-between group">
              <span className="text-xs text-zinc-300 truncate w-32 font-mono">{user?.email}</span>
              <button onClick={logout} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}