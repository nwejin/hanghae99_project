import { firestore } from '@/config/firebase';
import { query, where, getDocs, collection, orderBy, startAt, endAt } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('searchTerm'); // URL에서 searchTerm 파라미터 가져오기

    if (!searchTerm) {
      return NextResponse.json({ error: '검색어 필요' }, { status: 400 });
    }

    // 'users' 컬렉션에서 nickname 필드를 기준으로 부분 일치 쿼리
    const usersRef = collection(firestore, 'users');
    const userQuery = query(
      usersRef,
      where('nickname', '>=', searchTerm),
      where('nickname', '<=', searchTerm + '\uf8ff') // Unicode 값을 이용해 부분 일치 검색
    );

    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json({ error: '유저 정보가 없습니다.' }, { status: 404 });
    }

    // 검색 결과로 유저 정보 가져오기
    const usersData = userSnapshot.docs.map((doc) => doc.data());
    console.log(usersData);

    return NextResponse.json(usersData, { status: 200 });
  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
