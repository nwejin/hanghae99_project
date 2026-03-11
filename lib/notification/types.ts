export interface NotificationType {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'comment_like';
  post_id: string | null;
  comment_id: string | null;
  is_read: boolean;
  created_at: string;
  actor: {
    nickname: string;
    profile_image: string | null;
  };
}

export interface NotificationResponse {
  notifications: NotificationType[];
  unreadCount: number;
}
