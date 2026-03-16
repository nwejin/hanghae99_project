export type CommentType = {
  id: string;
  userId: string;
  postId: string;
  comment: string;
  created_at: string;
  user: {
    nickname: string;
    profileImage: string;
  };
};

export interface CommentDataType {
  postId: string;
  comment: string;
}

export interface DeleteCommentType {
  postId: string;
  commentId: string;
}

export interface ProfileType {
  profileImage: string;
  nickname: string;
}
