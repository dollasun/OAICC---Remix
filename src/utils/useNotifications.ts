import { useCallback, useEffect, useState } from 'react';
import type { Notification } from '../types';
import { inbox, sessionStore } from './schoolData';
import { notificationsStorage } from './storage';

/** Portals whose notifications come from the real, per-user inbox. */
const INBOX_ROLES = ['school', 'teacher', 'parent', 'student'];

const relativeTime = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

/**
 * Notifications for the current portal. School / teacher / parent / student read their own
 * inbox; other portals (admin, counselor) keep the shared legacy list seeded with `legacySeed`.
 */
export function useNotifications(role: string, legacySeed: Notification[]) {
  const inboxMode = INBOX_ROLES.includes(role);
  const recipientId = () => {
    const s = sessionStore.get();
    return s && s.role === role ? s.userId : '';
  };

  const load = useCallback((): Notification[] => {
    if (!inboxMode) return notificationsStorage.get(legacySeed);
    return inbox.forRecipient(role, recipientId()).map(n => ({
      id: n.id, title: n.title, body: n.body, timestamp: relativeTime(n.createdAt), read: n.read, link: n.link,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, inboxMode]);

  const [items, setItems] = useState<Notification[]>(() => load());

  useEffect(() => {
    setItems(load());
    const refresh = () => setItems(load());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 10000);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.clearInterval(timer);
    };
  }, [load]);

  const markRead = (id: string) => {
    if (inboxMode) inbox.markRead(id);
    else notificationsStorage.save(notificationsStorage.get(legacySeed).map((n: Notification) => (n.id === id ? { ...n, read: true } : n)));
    setItems(load());
  };
  const markAllRead = () => {
    if (inboxMode) inbox.markAllRead(role, recipientId());
    else notificationsStorage.save(notificationsStorage.get(legacySeed).map((n: Notification) => ({ ...n, read: true })));
    setItems(load());
  };
  const remove = (id: string) => {
    if (inboxMode) inbox.remove(id);
    else notificationsStorage.save(notificationsStorage.get(legacySeed).filter((n: Notification) => n.id !== id));
    setItems(load());
  };

  return { items, markRead, markAllRead, remove, inboxMode };
}
