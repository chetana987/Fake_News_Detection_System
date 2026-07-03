import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useLiveFeedStore } from '@/store/liveFeedStore';

const COLORS = ['#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#fb923c'];

export function PlatformDistributionPieChart() {
  const posts = useLiveFeedStore((s) => s.posts);

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      const platform = p.platform || 'unknown';
      counts[platform] = (counts[platform] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [posts]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]!} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
