import { NotificationResponse } from './types';

// 알림 생성 (좋아요, 댓글, 댓글좋아요 시 호출)
export async function createNotification(data: {
  userId: string;
  type: 'like' | 'comment' | 'comment_like';
  postId?: string;
  commentId?: string;
}): Promise<void> {
  try {
    await fetch('/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('알림 생성 오류', error);
  }
}

// 내 알림 목록 + 읽지 않은 수
export async function getNotifications(): Promise<NotificationResponse> {
  const response = await fetch('/api/notification');
  if (!response.ok) throw new Error('알림 조회 오류');
  return response.json();
}

// 읽지 않은 알림 수만 조회
export async function getUnreadCount(): Promise<number> {
  const response = await fetch('/api/notification');
  if (!response.ok) return 0;
  const data: NotificationResponse = await response.json();
  return data.unreadCount;
}

// 모든 알림 읽음 처리
export async function markAllAsRead(): Promise<void> {
  await fetch('/api/notification', { method: 'PATCH' });
}
