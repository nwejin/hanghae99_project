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
import { LikeType } from '@/lib/like';
import { NextResponse } from 'next/server';
import { auth } from '@/config/firebase_admin';
import { cookies } from 'next/headers';

// 좋아요
export async function POST(req: Request) {
  try {
    const sessionCookie = cookies().get('session')?.value;
    // console.log(sessionCookie);
    if (!sessionCookie) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 세션 쿠키를 이용해 사용자를 인증
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    // console.log(decodedClaims);
    // console.log(decodedClaims.uid);
    if (!decodedClaims) {
      return NextResponse.json({ message: '세션이 만료되었거나 유효하지 않습니다.' }, { status: 401 });
    }
    const { postId } = await req.json();

    const userId = decodedClaims.uid;

    if (!postId) {
      return NextResponse.json({ message: '게시글/유저 정보 없음' }, { status: 400 });
    } else if (!userId) {
      return NextResponse.json({ message: '유저 정보 없음' }, { status: 400 });
    }

    const likeRef = doc(firestore, 'posts', postId, 'likes', userId);

    await setDoc(likeRef, {
      userId,
      postId,
      created_at: serverTimestamp(),
    });

    return NextResponse.json({ message: '좋아요 추가 완료' });
  } catch (error) {
    console.error('좋아요 추가 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 좋아요 취소
export async function DELETE(req: Request) {
  try {
    const { postId, userId } = await req.json();

    if (!postId) {
      return NextResponse.json({ message: '게시글/유저 정보 없음' }, { status: 400 });
    } else if (!userId) {
      return NextResponse.json({ message: '유저 정보 없음' }, { status: 400 });
    }

    const likeRef = doc(firestore, 'posts', postId, 'likes', userId);
    await deleteDoc(likeRef);

    return NextResponse.json({ message: '좋아요 취소 완료' });
  } catch (error) {
    console.error('좋아요 취소 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 좋아요 확인
export async function GET(req: Request) {
  try {
    // 쿼리 파라미터에서 postId와 userId를 가져옴
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    if (!postId) {
      return NextResponse.json({ message: '게시글 정보 없음' }, { status: 400 });
    }

    // 특정 유저의 좋아요 상태 확인
    if (userId) {
      const likeRef = doc(firestore, 'posts', postId, 'likes', userId);
      const likeDoc = await getDoc(likeRef);
      const isLiked = likeDoc.exists();

      return NextResponse.json({ isLiked });
    } else {
      // 좋아요 데이터 (likeCount와 최근 유저) 가져오기
      const likesRef = collection(firestore, 'posts', postId, 'likes');
      const q = query(likesRef, orderBy('created_at', 'desc'));
      const likeDocs = await getDocs(q);

      const likeCount = likeDocs.size;

      let recentUser: string | null = null;
      if (!likeDocs.empty) {
        const mostRecentLike = likeDocs.docs[0].data();
        recentUser = mostRecentLike.userId;
      }

      return NextResponse.json({ likeCount, recentUser });
    }
  } catch (error) {
    console.error('좋아요 확인/데이터 가져오기 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
