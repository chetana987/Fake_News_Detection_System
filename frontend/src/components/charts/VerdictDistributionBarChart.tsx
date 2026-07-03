import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLiveFeedStore } from '@/store/liveFeedStore';

const COLORS: Record<string, string> = {
  FALSE: '#EF4444',
  SUSPICIOUS: '#F59E0B',
  TRUE: '#22C55E',
  UNVERIFIABLE: '#64748B',
};

export function VerdictDistributionBarChart() {
  const posts = useLiveFeedStore((s) => s.posts);

  const data = useMemo(() => {
    const counts = { FALSE: 0, SUSPICIOUS: 0, TRUE: 0, UNVERIFIABLE: 0 };
    posts.forEach((p) => { if (p.verdict in counts) counts[p.verdict]++; });
    return Object.entries(counts).map(([verdict, count]) => ({ verdict, count }));
  }, [posts]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="verdict" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((e) => <Cell key={e.verdict} fill={COLORS[e.verdict] ?? '#64748B'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
