import { motion } from 'framer-motion';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { LiveFeedPanel } from '@/components/dashboard/LiveFeedPanel';
import { TopicCloud } from '@/components/dashboard/TopicCloud';
import { FlaggedPostsLineChart } from '@/components/charts/FlaggedPostsLineChart';
import { VerdictDistributionBarChart } from '@/components/charts/VerdictDistributionBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <StatsOverview />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Live Feed</CardTitle></CardHeader>
            <CardContent><LiveFeedPanel /></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Flagged Over Time</CardTitle></CardHeader>
            <CardContent><FlaggedPostsLineChart /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Topic Cloud</CardTitle></CardHeader>
            <CardContent><TopicCloud /></CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Verdict Distribution</CardTitle></CardHeader>
        <CardContent><VerdictDistributionBarChart /></CardContent>
      </Card>
    </motion.div>
  );
}
