import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { StatsSkeleton } from '@/components/common/Skeleton';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, HelpCircle, Target } from 'lucide-react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useStatsStore } from '@/store/statsStore';

const statCards = [
  { key: 'total', label: 'Total Posts', icon: Shield, color: 'text-blue-400' },
  { key: 'falseCount', label: 'Flagged False', icon: AlertTriangle, color: 'text-red-400' },
  { key: 'suspiciousCount', label: 'Suspicious', icon: HelpCircle, color: 'text-yellow-400' },
  { key: 'trueCount', label: 'Verified True', icon: CheckCircle, color: 'text-green-400' },
  { key: 'avgTruthScore', label: 'Avg Truth Score', icon: Target, color: 'text-purple-400', format: (v: number) => v.toFixed(3) },
];

export function StatsOverview() {
  const setStats = useStatsStore((s) => s.setStats);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  useAutoRefresh(() => refetch(), 5000);

  if (data) setStats(data);

  if (isLoading) return <StatsSkeleton />;

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {statCards.map(({ key, label, icon: Icon, color, format }, i) => {
        const value = data[key as keyof typeof data] as number;
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg p-2 bg-gray-800 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{format ? format(value) : value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
