"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export function useSocketMetrics(agentId?: string) {
  // Initialize with both socket state AND browser state
  const [isLive, setIsLive] = useState(socket.connected && typeof navigator !== 'undefined' ? navigator.onLine : false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [metrics, setMetrics] = useState({
    latency: [] as { value: number; timestamp: string }[],
    tokens: [] as { value: number; timestamp: string }[],
  });

  useEffect(() => {
    let staleTimer: NodeJS.Timeout;

    const resetStaleTimer = () => {
      clearTimeout(staleTimer);
      // Only set live if the browser says we have internet
      if (navigator.onLine) setIsLive(true);
      
      staleTimer = setTimeout(() => {
        setIsLive(false);
      }, 5000);
    };

    function onConnect() {
      setIsLive(true);
      if (agentId) socket.emit('join_room', agentId);
    }
    
    function onDisconnect() {
      setIsLive(false);
      clearTimeout(staleTimer);
    }

    function onTelemetryUpdate(data: { type: 'latency' | 'tokens'; value: number; timestamp: string }) {
      resetStaleTimer();
      setMetrics((prev) => {
        const key = data.type;
        const newArray = [...prev[key], { value: data.value, timestamp: data.timestamp }];
        if (newArray.length > 20) newArray.shift();
        return { ...prev, [key]: newArray };
      });

      if (data.type === 'tokens') {
        setTotalTokens((prev) => prev + data.value);
      }
    }

    // --- BROWSER OFFLINE HANDLERS ---
    const handleBrowserOffline = () => {
      setIsLive(false);
      socket.disconnect(); // Explicitly stop trying until back online
    };

    const handleBrowserOnline = () => {
      socket.connect(); // Resume connection
    };

    window.addEventListener("offline", handleBrowserOffline);
    window.addEventListener("online", handleBrowserOnline);

    // Socket listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("telemetry_update", onTelemetryUpdate);

    if (!socket.connected && navigator.onLine) {
      socket.connect();
    } else if (agentId && socket.connected) {
      socket.emit('join_room', agentId);
    }

    return () => {
      if (agentId) socket.emit('leave_room', agentId);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("telemetry_update", onTelemetryUpdate);
      window.removeEventListener("offline", handleBrowserOffline);
      window.removeEventListener("online", handleBrowserOnline);
      clearTimeout(staleTimer);
    };
  }, [agentId]); 

  return { metrics, totalTokens, isLive };
}