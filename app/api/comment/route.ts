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
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { postId, userId, comment } = await req.json();
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

    return NextResponse.json({ message: '댓글 추가 완료' }, { status: 200 });
  } catch (error) {
    console.error('댓글 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
