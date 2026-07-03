import { create } from 'zustand';
import type { FlaggedPost } from '@/types/claim';

const MAX = 100;

interface LiveFeedState {
  posts: FlaggedPost[];
  addPost: (post: FlaggedPost) => void;
  setPosts: (posts: FlaggedPost[]) => void;
}

export const useLiveFeedStore = create<LiveFeedState>((set) => ({
  posts: [],
  addPost: (post) =>
    set((s) => ({ posts: [post, ...s.posts].slice(0, MAX) })),
  setPosts: (posts) => set({ posts }),
}));
