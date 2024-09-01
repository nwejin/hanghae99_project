import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 쿼리 파라미터에서 nickname을 추출
  const nickname = req.nextUrl.searchParams.get('nickname');

  // nickname이 문자열이 아니면 400 오류 반환
  if (typeof nickname !== 'string') {
    return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
  }

  try {
    // Firestore에서 유저 문서 가져오기
    const userRef = doc(firestore, 'users', nickname);
    const userDoc = await getDoc(userRef);

    // 유저 문서가 존재하지 않으면 404 오류 반환
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json(userDoc.data(), { status: 200 });

    console.log(response);
    // 유저 데이터 반환
    return response;
  } catch (error) {
    // 서버 오류 발생 시 500 오류 반환
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
