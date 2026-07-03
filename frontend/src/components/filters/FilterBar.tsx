import { useFilterStore } from '@/store/filterStore';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { Verdict } from '@/types/claim';

const VERDICTS: (Verdict | 'ALL')[] = ['ALL', 'FALSE', 'SUSPICIOUS', 'TRUE', 'UNVERIFIABLE'];

export function FilterBar() {
  const filters = useFilterStore();
  const setFilter = useFilterStore((s) => s.setFilter);
  const reset = useFilterStore((s) => s.reset);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {VERDICTS.map((v) => (
          <button
            key={v}
            onClick={() => setFilter('verdict', v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.verdict === v
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {v === 'ALL' ? 'All' : v.charAt(0) + v.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={reset}>
        <RotateCcw className="h-3 w-3" /> Reset
      </Button>
    </div>
  );
}
