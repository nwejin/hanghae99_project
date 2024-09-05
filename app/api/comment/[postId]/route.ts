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
import { cookies } from 'next/headers';
import { CommentType, ProfileType, CommentDataType } from '@/lib/comment';
import { auth } from '@/config/firebase_admin';

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    // const url = new URL(req.url);
    // const postId = url.searchParams.get('postId');

    const { postId } = params;

    if (!postId) {
      return NextResponse.json({ message: 'postId가 필요합니다.' }, { status: 400 });
    }

    const commentsRef = collection(firestore, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('created_at', 'desc'));

    const querySnapshot = await getDocs(q);

    const commentsWithUserData = [];

    for (const commentDoc of querySnapshot.docs) {
      const commentData = commentDoc.data();
      const userId = commentData.userId;

      // 유저 정보 가져오기
      const userRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userRef);

      let userData = null;

      if (userDoc.exists()) {
        const userDocData = userDoc.data();
        userData = {
          profileImage: userDocData.profile_image,
          nickname: userDocData.nickname,
        };
      }

      commentsWithUserData.push({
        ...commentData,
        id: commentDoc.id, // 댓글 ID 추가
        user: userData,
      });
    }

    return NextResponse.json(commentsWithUserData, { status: 200 });
  } catch (error) {
    console.error('댓글 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params;
    const sessionCookie = cookies().get('session')?.value;
    // console.log(sessionCookie);
    if (!sessionCookie) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    if (!decodedClaims) {
      return NextResponse.json({ message: '세션이 만료되었거나 유효하지 않습니다.' }, { status: 401 });
    }

    const data: CommentDataType = await req.json();

    // 댓글에 대한 고유 ID 생성
    const commentsRef = collection(firestore, 'posts', data.postId, 'comments');
    const newCommentRef = doc(commentsRef); // 자동 생성된 ID 사용

    await setDoc(newCommentRef, {
      userId: decodedClaims.uid,
      postId: data.postId,
      comment: data.comment,
      created_at: serverTimestamp(),
    });

    return NextResponse.json({ message: '댓글 추가 완료' }, { status: 200 });
  } catch (error) {
    console.error('댓글 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
