import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaggedPostsLineChart } from '@/components/charts/FlaggedPostsLineChart';
import { VerdictDistributionBarChart } from '@/components/charts/VerdictDistributionBarChart';
import { PlatformDistributionPieChart } from '@/components/charts/PlatformDistributionPieChart';
import { LatencyAreaChart } from '@/components/charts/LatencyAreaChart';

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Flagged Posts Over Time</CardTitle></CardHeader>
          <CardContent><FlaggedPostsLineChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Verdict Distribution</CardTitle></CardHeader>
          <CardContent><VerdictDistributionBarChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Platform Distribution</CardTitle></CardHeader>
          <CardContent><PlatformDistributionPieChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Verification Latency Trend</CardTitle></CardHeader>
          <CardContent><LatencyAreaChart /></CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
