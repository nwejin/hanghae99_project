import { AuthType, LikeCountType } from './types';

export async function addLike(LikeData: AuthType): Promise<void> {
  try {
    const cookies = document.cookie.split('; ');
    // console.log('Cookies:', cookies); // 디버깅: 쿠키 값 확인
    const sessionCookie = cookies.find((cookie) => cookie.startsWith('session='));
    // console.log('Session Cookie:', sessionCookie); // 디버깅: 세션 쿠키 확인

    // sessionCookie에서 'session=' 부분을 제거하여 순수한 쿠키 값만 가져오기
    const sessionToken = sessionCookie ? sessionCookie.split('=')[1] : '';
    // console.log('Session Token:', sessionToken); // 디버깅: 세션 토큰 확인

    // console.log(cookies);

    const response = await fetch('/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
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
    return { likeCount: 0, recentUser: null, isLiked: false }; // 에러 시 기본값 리턴
  }
}
