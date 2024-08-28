import { TotalPostType, PostFormData } from './types';

export async function getPost(): Promise<TotalPostType[]> {
  try {
    const response = await fetch('/api/post');

    // 응답 확인 - 2xx
    if (!response.ok) {
      throw new Error('fetch 오류');
    }

    // JSON 데이터를 파싱
    const data: TotalPostType[] = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 조회 fetch 오류', error);
    return [];
  }
}

export async function addPost(postData: PostFormData): Promise<void> {
  try {
    // 쿠키에서 session 값을 가져오기

    const cookies = document.cookie.split('; ');
    console.log('Cookies:', cookies); // 디버깅: 쿠키 값 확인
    const sessionCookie = cookies.find((cookie) => cookie.startsWith('session='));
    console.log('Session Cookie:', sessionCookie); // 디버깅: 세션 쿠키 확인

    // sessionCookie에서 'session=' 부분을 제거하여 순수한 쿠키 값만 가져오기
    const sessionToken = sessionCookie ? sessionCookie.split('=')[1] : '';
    console.log('Session Token:', sessionToken); // 디버깅: 세션 토큰 확인

    console.log(cookies);

    const response = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(postData),
    });

    // 응답 확인 - 2xx
    if (!response.ok) {
      throw new Error('게시글 추가 오류');
    }

    const result = await response.json();
    console.log('게시글 추가 fetch성공', result.message);
  } catch (error) {
    console.error('게시글 추가 fetch 오류', error);
  }
}
