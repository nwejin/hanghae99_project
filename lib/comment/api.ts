import { CommentDataType, CommentType } from './types';

export async function getComment(postId: string): Promise<CommentType[]> {
  try {
    const response = await fetch(`/api/comment/${postId}`);

    if (!response.ok) {
      throw new Error('fetch 오류');
    }

    const data: CommentType[] = await response.json();
    return data;
  } catch (error) {
    console.error('댓글 조회 fetch 오류', error);
    return [];
  }
}

export async function addComment(commentData: CommentDataType): Promise<void> {
  try {
    const postId = commentData.postId;

    const response = await fetch(`/api/comment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error('댓글 추가 오류');
    }

    const result = await response.json();
    console.log('댓글 추가 fetch성공', result.message);
  } catch (error) {
    console.error('댓글 추가 fetch 오류', error);
  }
}
