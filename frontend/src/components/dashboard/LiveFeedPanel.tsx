import { useLiveFeedStore } from '@/store/liveFeedStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe } from 'lucide-react';

const verdictBadge = { FALSE: 'false' as const, SUSPICIOUS: 'suspicious' as const, TRUE: 'true' as const, UNVERIFIABLE: 'unverifiable' as const };

export function LiveFeedPanel() {
  useWebSocket();
  const posts = useLiveFeedStore((s) => s.posts);

  if (posts.length === 0) return <EmptyState message="Waiting for flagged claims..." />;

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
      <AnimatePresence initial={false}>
        {posts.slice(0, 50).map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="rounded-lg border border-gray-800 bg-[#1E293B] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-sm leading-relaxed">{post.text || post.id}</p>
              <Badge variant={verdictBadge[post.verdict]}>{post.verdict}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{post.platform || 'web'}</span>
              <span>Score: {post.truthScore?.toFixed(3)}</span>
              <span>Conf: {post.confidence?.toFixed(3)}</span>
              <span className="flex items-center gap-1 ml-auto"><Clock className="h-3 w-3" />{post.flaggedAt ? new Date(post.flaggedAt).toLocaleTimeString() : ''}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
