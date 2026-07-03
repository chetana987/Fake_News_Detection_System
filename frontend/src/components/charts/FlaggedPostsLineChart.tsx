import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveFeedStore } from '@/store/liveFeedStore';

export function FlaggedPostsLineChart() {
  const posts = useLiveFeedStore((s) => s.posts);

  const data = useMemo(() => {
    const buckets: Record<string, number> = {};
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const key = new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      buckets[key] = 0;
    }
    posts.forEach((p) => {
      const key = new Date(p.flaggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (buckets[key] !== undefined) buckets[key]!++;
    });
    return Object.entries(buckets).map(([time, count]) => ({ time, count }));
  }, [posts]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
          labelStyle={{ color: '#d1d5db' }}
        />
        <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
