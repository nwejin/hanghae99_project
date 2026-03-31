import { createClient } from '@/config/supabase/server';
import { getSupabaseAdmin } from '@/config/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { user_id, password } = await req.json();

    // user_id로 실제 이메일 조회
    const adminSupabase = getSupabaseAdmin();
    const { data: userData, error: userError } = await adminSupabase
      .from('users')
      .select('email')
      .eq('user_id', user_id)
      .single();

    if (userError || !userData?.email) {
      return NextResponse.json({ isLogged: false, message: '존재하지 않는 아이디입니다.' }, { status: 401 });
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    });

    if (error) {
      return NextResponse.json({ isLogged: false, message: error.message }, { status: 401 });
    }

    return NextResponse.json({ isLogged: true }, { status: 200 });
  } catch (error) {
    console.error('로그인 처리 에러', error);
    return NextResponse.json({ message: '서버 에러' }, { status: 500 });
  }
}

export async function GET(_req: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    // 유저 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ isLogged: false, message: 'User not found' }, { status: 404 });
    }

    // 펫 정보 조회
    const { data: pets } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id);

    const responseUser = {
      isLogged: true,
      userId: user.id,
      email: userData.email || null,
      nickName: userData.nickname || null,
      profileImg: userData.profile_image || null,
      role: userData.role || 'viewer',
      petInfo: pets && pets.length > 0 ? pets[0] : null,
    };

    return NextResponse.json(responseUser, { status: 200 });
  } catch (error) {
    console.error('세션 검증 에러:', error);
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
