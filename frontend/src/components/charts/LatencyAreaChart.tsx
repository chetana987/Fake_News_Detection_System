import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveFeedStore } from '@/store/liveFeedStore';

export function LatencyAreaChart() {
  const posts = useLiveFeedStore((s) => s.posts);

  const data = useMemo(() => {
    const now = Date.now();
    return posts.slice(0, 50).reverse().map((p, i) => ({
      index: i,
      latency: p.confidence ? Math.round((1 - p.confidence) * 1000) : 0,
    }));
  }, [posts]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="index" tick={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
        <Area type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} fill="url(#latencyGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
