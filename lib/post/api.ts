import { PostFormData, PostIdType, EditType } from './types';

export async function addPost(postData: PostFormData): Promise<void> {
  try {
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('게시글 추가 오류');
    }

    const result = await response.json();
    console.log('게시글 추가 fetch성공', result.message);
  } catch (error) {
    console.error('게시글 추가 fetch 오류', error);
  }
}

export async function deletePost(postId: PostIdType): Promise<void> {
  try {
    const response = await fetch('/api/post', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      throw new Error('게시글 삭제 오류');
    }

    const result = await response.json();
    console.log('게시글 삭제 fetch성공', result.message);
  } catch (error) {
    console.error('게시글 삭제 fetch 오류', error);
  }
}

export async function editPost(editData: EditType): Promise<void> {
  try {
    const { id, contents } = editData;

    const response = await fetch('/api/post', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: id, contents }),
    });

    if (!response.ok) {
      throw new Error('게시글 수정 오류');
    }

    const result = await response.json();
    console.log('게시글 수정 fetch성공', result.message);
  } catch (error) {
    console.error('게시글 수정 에러', error);
  }
}
