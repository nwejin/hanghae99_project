import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();

    console.log('로그아웃 완료');
    return NextResponse.json({ isLogged: false }, { status: 200 });
  } catch (error) {
    console.error('로그아웃 처리 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
