import { firestore } from '@/config/firebase';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface Like {
  userId: string;
  postId: string;
  created_at: string;
}

// 좋아요
export async function addLike(postId: string, userId: string | null) {
  if (!userId) {
    return;
  }

  const likeRef = doc(firestore, 'posts', postId, 'likes', userId);

  await setDoc(likeRef, {
    userId,
    postId,
    created_at: serverTimestamp(),
  });
}

// 취소
export async function removeLike(postId: string, userId: string | null) {
  if (!userId) {
    return;
  }
  const likeRef = doc(firestore, 'posts', postId, 'likes', userId);

  await deleteDoc(likeRef);
}

// 좋아요 확인
export async function isLiked(postId: string, userId: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const likeRef = doc(firestore, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeRef);

  return likeDoc.exists();
}
