import { motion } from 'framer-motion';
import { ClaimHistoryTable } from '@/components/tables/ClaimHistoryTable';
import { FilterBar } from '@/components/filters/FilterBar';

export default function HistoryPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-xl font-bold">Fact Check History</h1>
      <FilterBar />
      <ClaimHistoryTable />
    </motion.div>
  );
}
