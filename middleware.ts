import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllUser } from '@/lib/getAllUser';
import { parse } from 'cookie';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // 요청 url 복제, 수정
  const pathname = url.pathname; // 현재 요청 경로

  const cookies = request.headers.get('cookie') || '';
  const parsedCookies = parse(cookies);
  const cookieAuth = parsedCookies['auth'];

  // 사용자 인증 상태 확인
  let user: { email: string; nickname: string } | null = null;

  if (cookieAuth) {
    try {
      user = JSON.parse(cookieAuth);
    } catch (error) {
      console.log('미들웨어 세션 에러', error);
    }
  }

  // 현재 유저
  const currentUser = user?.nickname;

  // 로그인한 사용자만 계정 설정 페이지에 접근 가능
  if (pathname.startsWith('/accounts/')) {
    const userId = pathname.split('/accounts/')[1];

    // 로그인 하지 않은 사용자
    if (!currentUser) {
      return NextResponse.redirect(new URL('/401', request.url));
    }

    // 현재 로그인한 사용자의 닉네임으로만 접근 가능
    if (userId !== currentUser) {
      return NextResponse.redirect(new URL('/401', request.url));
    }
  }

  if (pathname.startsWith('/user/')) {
    const userId = pathname.split('/user/')[1];

    // 로그인 하지 않은 사용자
    if (!currentUser) {
      return NextResponse.redirect(new URL('/401', request.url));
    }

    // 현재 로그인한 사용자의 닉네임으로만 접근 가능
    if (userId !== currentUser) {
      return NextResponse.redirect(new URL('/401', request.url));
    }
  }

  //   // 2. DB에 저장되지 않은 닉네임으로 /user/[userId]로 접근 시 에러 페이지로 이동
  //   if (pathname.startsWith('/user/')) {
  //     const userId = pathname.split('/user/')[1];
  //     const allNicknames = await getAllUser();

  //     if (!allNicknames.includes(userId)) {
  //       return NextResponse.redirect(new URL('/404', request.url));
  //     }
  //   }

  // 3. 로그인한 사용자가 /login, /signup으로 이동 불가
  if (currentUser && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. 로그인하지 않은 사용자가 /direct 페이지에 접근 불가
  if (!currentUser && pathname === '/direct') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
