import { firestore } from '@/config/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  query,
  collection,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';

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

// 로그인 유저 좋아요 확인
export async function isLiked(postId: string, userId: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const likeRef = doc(firestore, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeRef);

  return likeDoc.exists();
}

// 좋아요 수 확인
interface LikeData {
  recentUser: string | null;
  likeCount: number;
}

// 좋아요 데이터 가져오기
export async function fetchLikeData(postId: string): Promise<LikeData> {
  const likesRef = collection(firestore, 'posts', postId, 'likes');
  const q = query(likesRef, orderBy('created_at', 'desc'));
  const likeDocs = await getDocs(q);

  const likeCount = likeDocs.size;

  let recentUser: string | null = null;
  if (!likeDocs.empty) {
    const mostRecentLike = likeDocs.docs[0].data();
    recentUser = mostRecentLike.userId;
  }

  return { recentUser, likeCount };
}
