import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/config/supabase/middleware';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { supabaseResponse, user } = await updateSession(request);

  // 로그인한 사용자만 계정 설정 페이지에 접근 가능
  if (!user && pathname.startsWith('/accounts/')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인하지 않은 사용자가 /direct 페이지에 접근 불가
  if (!user && pathname === '/direct') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인한 사용자가 /login, /signup으로 이동 불가
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}
