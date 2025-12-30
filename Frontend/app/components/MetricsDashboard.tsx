// frontend/src/components/MetricsDashboard.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Define the interface for the props
interface MetricsProps {
  data: any[]; // This will come from useSocketMetrics()
}
interface MetricsProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
}

export function MetricsDashboard({ title, data, color, dataKey }: MetricsProps) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 h-[200px] flex flex-col">
      <h3 className="text-zinc-500 text-xs font-bold mb-4 uppercase">{title}</h3>
      <div className="flex-1 w-full min-h-0"> {/* min-h-0 is key for flex containers */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
             <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}