import { createClient } from '@/config/supabase/server';
import { getSupabaseAdmin } from '@/config/supabase/admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: '인증되지 않은 사용자' }, { status: 401 });
    }

    const body = await req.json();
    const { nickname, bio, newPassword, newEmail } = body;

    // 사용자 정보 업데이트
    const updateData: Record<string, string> = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (bio !== undefined) updateData.bio = bio;

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', authUser.id);

      if (updateError) {
        return NextResponse.json({ error: '프로필 업데이트 실패' }, { status: 500 });
      }
    }

    // 이메일 변경
    if (newEmail && newEmail !== authUser.email) {
      const { data: userData } = await supabase
        .from('users')
        .select('email_changed_at')
        .eq('id', authUser.id)
        .single();

      if (userData?.email_changed_at) {
        const diffMs = Date.now() - new Date(userData.email_changed_at).getTime();
        const remainMin = Math.ceil((30 * 60 * 1000 - diffMs) / 60000);
        if (diffMs < 30 * 60 * 1000) {
          return NextResponse.json(
            { error: `이메일은 30분에 한 번만 변경할 수 있습니다. ${remainMin}분 후 다시 시도해주세요.` },
            { status: 429 }
          );
        }
      }

      const adminSupabase = getSupabaseAdmin();
      const { error: emailTableError } = await adminSupabase
        .from('users')
        .update({ email: newEmail, email_changed_at: new Date().toISOString() })
        .eq('id', authUser.id);
      if (emailTableError) {
        return NextResponse.json({ error: '이메일 테이블 업데이트 실패' }, { status: 500 });
      }
    }

    // 비밀번호 변경
    if (newPassword) {
      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      if (pwError) {
        return NextResponse.json({ error: '비밀번호 변경 실패: ' + pwError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('계정 업데이트 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const supabase = createClient();

    // 유저 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', String(userId))
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
