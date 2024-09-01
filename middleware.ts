import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // 요청 url 복제, 수정
  const pathname = url.pathname; // 현재 요청 경로

  const cookies = request.headers.get('cookie') || '';
  // console.log(cookies);

  const parsedCookies = parse(cookies);
  // console.log(parsedCookies);

  const sessionCookieKey = Object.keys(parsedCookies).find((key) => key.startsWith('session'));
  const sessionCookie = sessionCookieKey ? parsedCookies[sessionCookieKey] : null;

  // console.log('Session Cookie:', sessionCookie);

  // 로그인한 사용자만 계정 설정 페이지에 접근 가능

  if (!sessionCookie && pathname.startsWith('/accounts/')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (pathname.startsWith('/accounts/')) {
  //   const userId = pathname.split('/accounts/')[1];

  //   // 로그인 하지 않은 사용자
  //   if (!userData) {
  //     return NextResponse.redirect(new URL('/401', request.url));
  //   }

  //   // 현재 로그인한 사용자의 닉네임으로만 접근 가능
  //   if (userData && userId !== userData.nickname) {
  //     return NextResponse.redirect(new URL('/401', request.url));
  //   }
  // }

  if (!sessionCookie && pathname === '/direct') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // // 3. 로그인한 사용자가 /login, /signup으로 이동 불가
  if (sessionCookie && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. 로그인하지 않은 사용자가 /direct 페이지에 접근 불가
  if (!sessionCookie && pathname === '/direct') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
