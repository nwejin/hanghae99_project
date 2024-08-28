export type LikeType = {
  userId: string;
  postId: string;
  created_at: string;
};

export type AuthType = {
  postId: string;
};

export type LikeCountType = {
  recentUser: string | null;
  likeCount: number;
  isLiked: boolean;
};
