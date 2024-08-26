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
    console.error('게시글 fetch 오류', error);
    return [];
  }
}

export async function addPost(postData: PostFormData): Promise<void> {
  try {
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    // 응답 확인 - 2xx
    if (!response.ok) {
      throw new Error('Failed to add post');
    }

    const result = await response.json();
    console.log('Post added successfully:', result.message);
  } catch (error) {
    console.error('Error adding post:', error);
  }
}
