import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  add: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  add: (n) =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        { ...n, id: crypto.randomUUID(), timestamp: Date.now() },
      ].slice(-50),
    })),
  dismiss: (id) =>
    set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) })),
}));
