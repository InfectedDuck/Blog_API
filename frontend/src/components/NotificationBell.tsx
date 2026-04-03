'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { getUnreadCount, getNotifications, markAllNotificationsRead, type NotificationItem } from '../lib/api';
import { useLang } from '../context/LangContext';
import { timeAgo } from '../lib/utils';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { t } = useLang();

  useEffect(() => {
    getUnreadCount().then((r) => setUnread(r.count)).catch(() => {});
    const interval = setInterval(() => {
      getUnreadCount().then((r) => setUnread(r.count)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = async () => {
    if (!open) {
      try {
        const res = await getNotifications(1);
        setNotifications(res.data);
      } catch {}
    }
    setOpen(!open);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead().catch(() => {});
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotifMessage = (n: NotificationItem) => {
    const name = n.actor.displayName || n.actor.username;
    if (n.type === 'like') return `${name} ${t('notif.liked')}`;
    if (n.type === 'comment') return `${name} ${t('notif.commented')}`;
    if (n.type === 'follow') return `${name} ${t('notif.followed')}`;
    return `${name} ${n.message}`;
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-1.5 rounded-lg hover:bg-surface-secondary transition">
        <Bell size={18} className="text-text-muted" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pastel-pink text-[10px] font-bold rounded-full flex items-center justify-center text-text-primary">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface-secondary rounded-xl shadow-lg border border-surface-tertiary z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-tertiary">
            <span className="text-sm font-medium text-text-primary">{t('notif.title')}</span>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-text-muted hover:text-text-primary transition">
                {t('notif.markAllRead')}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">{t('notif.empty')}</div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || '#'}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 hover:bg-surface-tertiary transition border-b border-surface-tertiary last:border-0 ${!n.read ? 'bg-accent/10' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  {n.actor.avatarUrl ? (
                    <img src={n.actor.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-text-primary flex-shrink-0">
                      {(n.actor.displayName || n.actor.username)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-snug">{getNotifMessage(n)}</p>
                    <p className="text-xs text-text-muted mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
