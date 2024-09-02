import { firestore } from '@/config/firebase';
import { query } from 'firebase/database';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { string } from 'zod';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const userRef = doc(firestore, 'users', String(userId));
    const userDoc = await getDoc(userRef);

    // // 유저 문서가 존재하지 않으면 404 오류 반환
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 유저 문서 데이터
    const userData = userDoc.data();

    // 반려동물 정보
    const petsRef = collection(firestore, 'users', String(userId), 'pets');
    const petsSnapshot = await getDocs(petsRef);

    const petsData = petsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        user: userData,
        pets: petsData,
      },
      { status: 200 }
    );
  } catch (error) {
    // 서버 오류 발생 시 500 오류 반환
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
