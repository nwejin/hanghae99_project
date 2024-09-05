import { firestore } from '@/config/firebase';
import { query, where, getDocs, collection, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nickname = url.searchParams.get('nickname'); // URL에서 nickname 파라미터 가져오기

    if (!nickname) {
      return NextResponse.json({ error: '닉네임 필요' }, { status: 400 });
    }

    // 'users' 컬렉션에서 nickname 필드를 기준으로 쿼리
    const usersRef = collection(firestore, 'users');
    const userQuery = query(usersRef, where('nickname', '==', nickname));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json({ error: '유저 정보가 없습니다.' }, { status: 404 });
    }

    // 첫 번째 일치하는 유저 문서 가져오기
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // 반려동물 정보 가져오기
    const petsRef = collection(firestore, 'users', userDoc.id, 'pets');
    const petsSnapshot = await getDocs(petsRef);
    const petsData = petsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 유저의 게시물 정보 가져오기
    const postsRef = collection(firestore, 'posts');
    const postsQuery = query(postsRef, where('userId', '==', userDoc.id), orderBy('created_at', 'desc')); // posts 컬렉션에서 해당 id의 게시물 가져오기 //내림차순

    // console.log(postsQuery);
    const postsSnapshot = await getDocs(postsQuery);
    const postsData = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        user: userData,
        pets: petsData,
        posts: postsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
