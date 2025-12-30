export default function AgentUsageBar({ count, max }: { count: number; max: number }) {
    const percentage = Math.min((count / max) * 100, 100);
    const isFull = count >= max;
  
    return (
      <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="text-white font-bold text-sm">Agent Capacity</h3>
            <p className="text-zinc-500 text-xs">You can create up to {max} agents on this plan.</p>
          </div>
          <span className={`text-sm font-mono font-bold ${isFull ? 'text-red-500' : 'text-blue-500'}`}>
            {count} / {max}
          </span>
        </div>
        
        {/* The Progress Bar Track */}
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              isFull ? 'bg-red-500' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
            }`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }