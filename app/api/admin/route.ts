import { NextResponse } from 'next/server';
import { createClient } from '@/config/supabase/server';

export const dynamic = 'force-dynamic';

// 전체 사용자 목록 조회 (admin 전용)
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // admin 권한 확인
    const { data: currentUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 });
    }

    // 전체 사용자 목록 (본인 제외)
    const { data: users, error } = await supabase
      .from('users')
      .select('id, user_id, nickname, profile_image, role')
      .neq('id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(users);
  } catch (error) {
    console.error('사용자 목록 조회 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

// 사용자 권한 변경 (admin 전용)
export async function PATCH(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // admin 권한 확인
    const { data: currentUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentUser?.role !== 'admin') {
      return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!['approved', 'viewer'].includes(role)) {
      return NextResponse.json({ message: '유효하지 않은 권한입니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ message: '권한 변경 완료!' });
  } catch (error) {
    console.error('권한 변경 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}
