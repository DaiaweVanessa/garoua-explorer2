import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notifications';
import { AppNotification } from '@/types';

const typeIcons: Record<AppNotification['type'], string> = {
  COMMENT_REPLY: '💬',
  COMMENT_LIKE: '❤️',
  NEW_PLACE: '📍',
  ANNOUNCEMENT: '📢',
};

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    function refreshCount() {
      fetchUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    }

    refreshCount();
    const interval = setInterval(refreshCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      fetchNotifications()
        .then((res) => {
          setNotifications(res.items);
          setUnreadCount(res.unreadCount);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }

  async function handleNotificationClick(notif: AppNotification) {
    if (!notif.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(notif.id).catch(() => {});
    }
    setOpen(false);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      // silencieux : le prochain refresh corrigera l'etat si besoin
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-indigo/70 transition-colors hover:bg-indigo/5 hover:text-indigo"
        aria-label="Notifications"
      >
        <span className="text-lg" aria-hidden>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-laterite px-1 font-mono text-[10px] font-bold text-sable">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-indigo/10 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-indigo/10 px-4 py-3">
            <p className="font-sans text-sm font-semibold text-indigo">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-sans text-xs font-semibold text-laterite hover:underline"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-center font-sans text-sm text-ink/50">Chargement...</p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="px-4 py-6 text-center font-sans text-sm text-ink/50">
                Aucune notification pour l'instant.
              </p>
            )}
            {!loading &&
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link ?? '#'}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 border-b border-indigo/5 px-4 py-3 transition-colors last:border-0 hover:bg-sable-light ${
                    notif.read ? '' : 'bg-benoue/5'
                  }`}
                >
                  <span className="text-lg" aria-hidden>
                    {typeIcons[notif.type]}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans text-sm text-ink/80">{notif.message}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-ink/40">
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notif.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-laterite" />}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}