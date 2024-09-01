import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';

// 사용자 정보를 UID를 기반으로 조회하는 함수
// async function getUserFromUid(uid: string) {
//   try {
//     const userRef = doc(firestore, 'users', uid);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       return userDoc.data(); // 사용자 정보 반환
//     }
//   } catch (error) {
//     console.error('Error fetching user from UID:', error);
//   }
//   return null;
// }

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // 요청 url 복제, 수정
  const pathname = url.pathname; // 현재 요청 경로

  // const cookies = request.headers.get('cookie') || '';
  // const parsedCookies = parse(cookies);
  // const cookieAuth = parsedCookies['auth'];

  let userData = null;
  const sessionCookie = cookies().get('session')?.value || '';

  // if (sessionCookie) {
  //   // 세션 쿠키에서 UID를 기반으로 사용자 정보 조회
  //   userData = await getUserFromUid(sessionCookie);
  // }
  // // 현재 유저
  // const currentUser = user?.nickname;

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

  // 3. 로그인한 사용자가 /login, /signup으로 이동 불가
  if (sessionCookie && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. 로그인하지 않은 사용자가 /direct 페이지에 접근 불가
  if (!sessionCookie && pathname === '/direct') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
