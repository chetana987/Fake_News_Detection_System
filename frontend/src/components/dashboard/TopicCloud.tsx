import { useMemo } from 'react';
import { useLiveFeedStore } from '@/store/liveFeedStore';
import { EmptyState } from '@/components/common/EmptyState';

const STOP_WORDS = new Set(['the','a','an','is','was','are','were','be','has','have','had','do','does','did','will','would','could','should','may','might','shall','can','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','and','but','or','nor','not','so','yet','this','that','these','those','it','its','he','she','they','them','we','you','i','me','my','your','his','her','our','their','all','each','every','both','few','more','most','some','any','no','other','such','only','own','same']);

export function TopicCloud() {
  const posts = useLiveFeedStore((s) => s.posts);

  const topics = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach((p) => {
      (p.text || '').toLowerCase().split(/\W+/).forEach((w) => {
        if (w.length > 2 && !STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([word, count]) => ({ word, count }));
  }, [posts]);

  if (topics.length === 0) return <EmptyState message="No topics yet" />;

  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {topics.map((t) => {
        const ratio = t.count / maxCount;
        return (
          <span
            key={t.word}
            style={{ fontSize: `${0.7 + ratio * 1.3}rem`, opacity: 0.5 + ratio * 0.5 }}
            className="inline-block rounded bg-gray-800 px-2.5 py-1 text-gray-200 transition-colors hover:bg-violet-700/50 cursor-default"
          >
            {t.word}
          </span>
        );
      })}
    </div>
  );
}
