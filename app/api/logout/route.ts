import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { auth } from '@/config/firebase_admin';

export async function POST(req: Request) {
  try {
    const response = NextResponse.json({ isLogged: false }, { status: 200 });

    response.cookies.set('session', '', {
      path: '/',
      maxAge: -1, // 쿠키 삭제
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // console.log(response.cookies);
    console.log('쿠키 삭제 완료');
    return response;
  } catch (error) {
    console.error('로그아웃 처리 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
