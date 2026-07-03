import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useLiveFeedStore } from '@/store/liveFeedStore';
import { toast } from 'sonner';
import type { FlaggedPost } from '@/types/claim';

export function useWebSocket() {
  const addPost = useLiveFeedStore((s) => s.addPost);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws/flagged-claims'),
      onConnect: () => {
        client.subscribe('/topic/flagged-claims', (msg) => {
          try {
            const post: FlaggedPost = JSON.parse(msg.body);
            addPost(post);
            if (post.verdict === 'FALSE') {
              toast.error('FALSE claim detected', { description: post.text?.slice(0, 80) });
            } else if (post.verdict === 'SUSPICIOUS') {
              toast.warning('Suspicious claim detected', { description: post.text?.slice(0, 80) });
            }
          } catch {
            /* ignore */
          }
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [addPost]);
}
