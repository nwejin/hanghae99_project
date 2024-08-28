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
import { Timestamp } from 'firebase/firestore';
import { getUserProfile, UserProfileProps } from '@/lib/userAuth';
import { date } from 'zod';

export interface PostComment {
  userId: string;
  postId: string;
  comment: string;
  created_at: string;
}

export async function addComment(postId: string, userId: string | null, comment: string) {
  if (!userId) {
    return;
  }

  // 댓글에 대한 고유 ID 생성
  const commentsRef = collection(firestore, 'posts', postId, 'comments');
  const newCommentRef = doc(commentsRef); // 자동 생성된 ID 사용

  await setDoc(newCommentRef, {
    userId,
    postId,
    comment,
    created_at: serverTimestamp(),
  });
}

export async function getComments(postId: string): Promise<(PostComment & { user: UserProfileProps })[]> {
  const commentsRef = collection(firestore, 'posts', postId, 'comments');
  const q = query(commentsRef, orderBy('created_at', 'asc'));
  const querySnapshot = await getDocs(q);

  // 모든 댓글을 비동기로 처리
  const comments = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      // let createdAt = '';

      // if (data.created_at instanceof Timestamp) {
      //   createdAt = data.created_at.toDate().toISOString();
      // } else if (typeof data.created_at === 'string') {
      //   createdAt = data.created_at;
      // }

      const user = await getUserProfile(data.userId);

      return {
        userId: data.userId,
        postId: data.postId,
        comment: data.comment,
        created_at: data.created_at,
        user: user || { profileImage: '', nickname: 'Unknown' },
      } as PostComment & { user: UserProfileProps };
    })
  );

  return comments;
}
