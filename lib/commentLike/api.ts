import { CommentLikeResponse } from './types';

export async function addCommentLike(commentId: string): Promise<void> {
  const response = await fetch('/api/comment-like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  });
  if (!response.ok) throw new Error('댓글 좋아요 추가 오류');
}

export async function deleteCommentLike(commentId: string): Promise<void> {
  const response = await fetch('/api/comment-like', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  });
  if (!response.ok) throw new Error('댓글 좋아요 취소 오류');
}

export async function getCommentLike(commentId: string, userId: string | null): Promise<CommentLikeResponse> {
  const params = new URLSearchParams({ commentId });
  if (userId) params.append('userId', userId);

  const response = await fetch(`/api/comment-like?${params}`);
  if (!response.ok) throw new Error('댓글 좋아요 조회 오류');

  return response.json();
}
