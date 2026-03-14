'use client';

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Bell } from 'lucide-react';
import { getNotifications, markAllAsRead } from '@/lib/notification';
import { NotificationType } from '@/lib/notification';
import { timeCheck } from '@/shared/timeUtils';
import Link from 'next/link';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
        // 페이지 진입 시 읽음 처리
        if (data.unreadCount > 0) {
          await markAllAsRead();
        }
      } catch {
        // 무시
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
      case 'comment_like':
        return <Heart size={16} className="fill-paw-like text-paw-like" />;
      case 'comment':
        return <MessageCircle size={16} className="text-paw-orange" />;
      default:
        return <Bell size={16} className="text-paw-sub" />;
    }
  };

  const getMessage = (type: string, actorName: string) => {
    switch (type) {
      case 'like':
        return (
          <>
            <strong>{actorName}</strong>님이 게시물을 좋아합니다.
          </>
        );
      case 'comment':
        return (
          <>
            <strong>{actorName}</strong>님이 댓글을 남겼습니다.
          </>
        );
      case 'comment_like':
        return (
          <>
            <strong>{actorName}</strong>님이 댓글을 좋아합니다.
          </>
        );
      default:
        return (
          <>
            <strong>{actorName}</strong>님의 활동
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-paw-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {notifications.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center text-paw-inactive">
          <Bell size={32} strokeWidth={1.2} />
          <p className="mt-2 text-sm">알림이 없습니다</p>
        </div>
      )}

      <div className="space-y-1">
        {notifications.map((noti) => (
          <Link
            key={noti.id}
            href={noti.post_id ? '/' : '#'}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-paw-cream-dark ${
              !noti.is_read ? 'bg-paw-cream-dark' : ''
            }`}>
            {/* 프로필 이미지 */}
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-paw-border">
              {noti.actor?.profile_image ? (
                <img src={noti.actor.profile_image} alt={noti.actor.nickname} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-paw-cream-dark text-xs font-semibold text-paw-sub">
                  {noti.actor?.nickname?.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5">{getIcon(noti.type)}</div>
            </div>

            {/* 내용 */}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-paw-brown">{getMessage(noti.type, noti.actor?.nickname || '알 수 없음')}</p>
              <span className="text-[10px] text-paw-inactive">{timeCheck(noti.created_at)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
