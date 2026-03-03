import { AuthType, LikeCountType } from './types';

export async function addLike(LikeData: AuthType): Promise<void> {
  try {
    const response = await fetch('/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(LikeData),
    });

    if (!response.ok) {
      throw new Error('좋아요 추가 오류');
    }

    const result = await response.json();
    console.log('좋아요 추가 fetch 성공', result.message);
  } catch (error) {
    console.error('좋아요 추가 fetch 오류', error);
  }
}

export async function deleteLike(likeData: AuthType): Promise<void> {
  try {
    const response = await fetch('/api/like', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeData),
    });

    if (!response.ok) {
      throw new Error('좋아요 제거 오류');
    }

    const result = await response.json();
    console.log('좋아요 제거 fetch 성공', result.message);
  } catch (error) {
    console.error('좋아요 제거 fetch 오류', error);
  }
}

export async function getLike(postId: string, userId: string | null): Promise<LikeCountType> {
  try {
    let isLiked = false;
    if (userId) {
      const responseUser = await fetch(`/api/like?postId=${postId}&userId=${userId}`);
      if (!responseUser.ok) {
        throw new Error('유저 좋아요 상태 조회 오류');
      }
      const userResult = await responseUser.json();
      isLiked = userResult.isLiked;
    }

    // 2. 게시글의 전체 좋아요 데이터 조회
    const response = await fetch(`/api/like?postId=${postId}`);
    if (!response.ok) {
      throw new Error('게시글 좋아요 데이터 조회 오류');
    }
    const { likeCount, recentUser } = await response.json();

    return { likeCount, recentUser, isLiked };
  } catch (error) {
    console.error('좋아요 데이터 조회 오류', error);
    return { likeCount: 0, recentUser: null, isLiked: false };
  }
}
