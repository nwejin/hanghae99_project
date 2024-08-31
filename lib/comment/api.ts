import { CommentDataType, CommentType } from './types';

export async function getComment(postId: string): Promise<CommentType[]> {
  try {
    const response = await fetch(`/api/comment/${postId}`);
    // const response = await fetch(`/api/post?page=${page}&pageSize=${pageSize}`);

    // 응답 확인 - 2xx
    if (!response.ok) {
      throw new Error('fetch 오류');
    }

    // JSON 데이터를 파싱
    const data: CommentType[] = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('댓글 조회 fetch 오류', error);
    return [];
  }
}

export async function addComment(commentData: CommentDataType): Promise<void> {
  try {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find((cookie) => cookie.startsWith('session='));
    const sessionToken = sessionCookie ? sessionCookie.split('=')[1] : '';

    const postId = commentData.postId;

    const response = await fetch(`/api/comment/postId=${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
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
