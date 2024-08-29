import { NextResponse } from 'next/server';
import { firestore } from '@/config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import { PostType, UserType, TotalPostType, PostFormData, PostIdType } from '@/lib/post';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers'; // To access cookies

// 게시글 데이터 불러오기
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '5', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const fbCollection = collection(firestore, 'posts');
    // 공개, 최신순 데이터 조회
    const q = query(fbCollection, where('status', '==', false), orderBy('created_at', 'desc'));

    const getPost = await getDocs(q);

    const totalPostData: TotalPostType[] = [];

    // 유저 uid로 유저 정보 가져오기
    for (const postDoc of getPost.docs) {
      const postData = postDoc.data() as PostType;
      const userRef = doc(firestore, 'users', postData.userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserType;
        totalPostData.push({ post: { ...postData, id: postDoc.id }, user: userData });
      }
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedPosts = totalPostData.slice(startIndex, endIndex);

    return NextResponse.json(paginatedPosts);
  } catch (error) {
    console.error('게시글 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 게시글 데이터 추가
export async function POST(req: Request) {
  try {
    const sessionCookie = cookies().get('session')?.value;
    // console.log(sessionCookie);
    if (!sessionCookie) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 세션 쿠키를 이용해 사용자를 인증
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    // console.log(decodedClaims);
    // console.log(decodedClaims.uid);
    if (!decodedClaims) {
      return NextResponse.json({ message: '세션이 만료되었거나 유효하지 않습니다.' }, { status: 401 });
    }
    const data: PostFormData = await req.json();

    const postData = {
      ...data,
      userId: decodedClaims.uid, // 인증된 사용자의 UID 추가 - 세션 토큰
      created_at: serverTimestamp(),
    };

    const postRef = await addDoc(collection(firestore, 'posts'), postData);

    return NextResponse.json({ message: '게시글 작성 완료!, id:' + postRef.id });
  } catch (error) {
    console.error('게시글 추가 에러', error);
    return NextResponse.error();
  }
}

// 게시글 삭제
export async function DELETE(req: Request) {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    // 세션 쿠키를 이용해 사용자를 인증
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    if (!decodedClaims) {
      return NextResponse.json({ message: '세션이 만료되었거나 유효하지 않습니다.' }, { status: 401 });
    }

    const { postId } = await req.json();

    const postRef = await deleteDoc(doc(firestore, 'posts', postId));

    return NextResponse.json({ message: '게시글 삭제 완료!' }, { status: 200 });
  } catch (error) {
    console.error('게시글 삭제 에러', error);
    return NextResponse.error();
  }
}
