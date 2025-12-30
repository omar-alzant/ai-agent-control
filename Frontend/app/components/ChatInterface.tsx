"use client";
import { useEffect, useRef, useState } from 'react';
import { api } from "../lib/api"; 

export function ChatInterface({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // UI feedback for AI response
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Load History on Mount
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await api.getMessages(agentId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [agentId]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // 3. Handle Message Sending
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Sends to protected backend route /api/chat
      const data = await api.sendMessage(agentId, currentInput);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error("Error sending message:", err);
      // Optional: Add an error message to the chat UI
    } finally {
      setIsTyping(false);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-zinc-500 italic">Loading encrypted session...</div>;

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
        <input 
          disabled={isTyping}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isTyping ? "Agent is thinking..." : "Ask your agent anything..."}
        />
        <button 
          onClick={handleSend} 
          disabled={isTyping || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}