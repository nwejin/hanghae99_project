import { createClient } from '@/config/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 이메일로 아이디 찾기
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: '이메일을 입력해주세요' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '해당 이메일로 가입된 계정이 없습니다' }, { status: 404 });
    }

    return NextResponse.json({ user_id: data.user_id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
