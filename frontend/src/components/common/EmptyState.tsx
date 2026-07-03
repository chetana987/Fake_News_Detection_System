import { ShieldAlert } from 'lucide-react';

export function EmptyState({ message = 'No data available yet' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <ShieldAlert className="h-10 w-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
