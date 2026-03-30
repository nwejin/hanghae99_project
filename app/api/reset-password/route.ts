import { createClient } from '@/config/supabase/server';
import { getSupabaseAdmin } from '@/config/supabase/admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// step=verify: 아이디+이메일 확인
// step=update: 새 비밀번호로 변경
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step } = body;

    if (step === 'verify') {
      const { user_id, email } = body;

      if (!user_id || !email) {
        return NextResponse.json({ error: '아이디와 이메일을 모두 입력해주세요' }, { status: 400 });
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('user_id', user_id)
        .eq('email', email)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: '아이디 또는 이메일이 일치하지 않습니다' }, { status: 404 });
      }

      // httpOnly 쿠키에 userId 임시 저장 (10분 유효)
      const cookieStore = cookies();
      cookieStore.set('reset_uid', data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 10,
        path: '/',
      });

      return NextResponse.json({ verified: true }, { status: 200 });
    }

    if (step === 'update') {
      const { newPassword } = body;

      if (!newPassword) {
        return NextResponse.json({ error: '새 비밀번호를 입력해주세요' }, { status: 400 });
      }

      const cookieStore = cookies();
      const userId = cookieStore.get('reset_uid')?.value;

      if (!userId) {
        return NextResponse.json({ error: '인증이 만료되었습니다. 다시 시도해주세요' }, { status: 401 });
      }

      const { error } = await getSupabaseAdmin().auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        return NextResponse.json({ error: '비밀번호 변경에 실패했습니다' }, { status: 500 });
      }

      // 사용 후 쿠키 삭제
      cookieStore.delete('reset_uid');

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
