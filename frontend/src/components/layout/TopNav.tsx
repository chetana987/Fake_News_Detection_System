import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useFilterStore } from '@/store/filterStore';

export function TopNav() {
  const search = useFilterStore((s) => s.search);
  const setFilter = useFilterStore((s) => s.setFilter);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-800 bg-[#0F172A]/95 backdrop-blur px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          value={search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search claims..."
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <button className="flex items-center gap-2 rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors">
          <User className="h-5 w-5" />
          <span className="hidden text-sm md:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
