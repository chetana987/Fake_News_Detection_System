import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFlagged } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedSkeleton } from '@/components/common/Skeleton';
import { useFilterStore } from '@/store/filterStore';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FlaggedPost } from '@/types/claim';

const PAGE_SIZE = 15;

type SortKey = 'truthScore' | 'confidence' | 'flaggedAt' | 'verdict';

export function ClaimHistoryTable() {
  const navigate = useNavigate();
  const filters = useFilterStore();
  const [sortKey, setSortKey] = useState<SortKey>('flaggedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({ queryKey: ['flagged'], queryFn: fetchFlagged });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data
      .filter((p) => {
        if (filters.verdict !== 'ALL' && p.verdict !== filters.verdict) return false;
        if (filters.search && !(p.text ?? '').toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.platform && p.platform !== filters.platform) return false;
        if (p.confidence < filters.confidenceMin || p.confidence > filters.confidenceMax) return false;
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [data, filters, sortKey, sortDir]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  if (isLoading) return <FeedSkeleton />;
  if (!data || data.length === 0) return <EmptyState message="No claim history yet" />;

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-400 hover:text-gray-200"
        onClick={() => toggleSort(k)}>
      <div className="flex items-center gap-1">
        {label} <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <SortHeader k="flaggedAt" label="Timestamp" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Claim</th>
                <SortHeader k="verdict" label="Verdict" />
                <SortHeader k="confidence" label="Confidence" />
                <SortHeader k="truthScore" label="Truth Score" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Platform</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/claim/${p.id}`)}>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(p.flaggedAt).toLocaleString()}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-200">{p.text || p.id}</td>
                  <td className="px-4 py-3"><Badge variant={p.verdict === 'FALSE' ? 'false' : p.verdict === 'SUSPICIOUS' ? 'suspicious' : p.verdict === 'TRUE' ? 'true' : 'unverifiable'}>{p.verdict}</Badge></td>
                  <td className="px-4 py-3 text-gray-300">{p.confidence.toFixed(3)}</td>
                  <td className="px-4 py-3 text-gray-300">{p.truthScore.toFixed(3)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{p.platform || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 rounded bg-gray-800 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-700">
              <ChevronLeft className="h-3 w-3" /> Prev
            </button>
            <span className="text-xs text-gray-400">{page + 1} / {pageCount}</span>
            <button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 rounded bg-gray-800 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-gray-700">
              Next <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
