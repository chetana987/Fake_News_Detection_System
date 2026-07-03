import { motion } from 'framer-motion';
import { LiveFeedPanel } from '@/components/dashboard/LiveFeedPanel';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterBar } from '@/components/filters/FilterBar';

export default function LiveFeedPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-xl font-bold">Live Feed</h1>
      <StatsOverview />
      <FilterBar />
      <Card>
        <CardHeader><CardTitle>Real-Time Flagged Claims</CardTitle></CardHeader>
        <CardContent><LiveFeedPanel /></CardContent>
      </Card>
    </motion.div>
  );
}
