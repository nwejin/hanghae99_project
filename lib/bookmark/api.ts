import { BookmarkAuthType, BookmarkStatusType, BookmarkPostType } from './types';

export async function addBookmark(data: BookmarkAuthType): Promise<void> {
  try {
    const response = await fetch('/api/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('북마크 추가 오류');
    }
  } catch (error) {
    console.error('북마크 추가 fetch 오류', error);
  }
}

export async function deleteBookmark(data: BookmarkAuthType): Promise<void> {
  try {
    const response = await fetch('/api/bookmark', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('북마크 제거 오류');
    }
  } catch (error) {
    console.error('북마크 제거 fetch 오류', error);
  }
}

export async function getBookmark(postId: string, userId: string | null): Promise<BookmarkStatusType> {
  try {
    if (!userId) return { isBookmarked: false };

    const response = await fetch(`/api/bookmark?postId=${postId}&userId=${userId}`);
    if (!response.ok) {
      throw new Error('북마크 상태 조회 오류');
    }

    const result = await response.json();
    return { isBookmarked: result.isBookmarked };
  } catch (error) {
    console.error('북마크 상태 조회 오류', error);
    return { isBookmarked: false };
  }
}

export async function getBookmarkPosts(userId: string): Promise<BookmarkPostType[]> {
  try {
    const response = await fetch(`/api/bookmark?userId=${userId}`);
    if (!response.ok) {
      throw new Error('북마크 목록 조회 오류');
    }

    const result = await response.json();
    return result.posts || [];
  } catch (error) {
    console.error('북마크 목록 조회 오류', error);
    return [];
  }
}
