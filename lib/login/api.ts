import { LoginType } from './types';
import { createClient } from '@/config/supabase/client';

export async function userLogIn(loginData: LoginType): Promise<string | null> {
  const { email, user_password } = loginData;
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: user_password,
    });

    if (error) {
      return error.message;
    }

    // 사용자 정보 가져오기
    const userProfileRes = await fetch('/api/login', {
      method: 'GET',
      credentials: 'include',
    });

    const userProfile = await userProfileRes.json();

    if (userProfileRes.ok) {
      sessionStorage.setItem('user', JSON.stringify(userProfile));
    }

    return null;
  } catch (error: any) {
    console.error('로그인 실패', error);
    return error.message;
  }
}

export async function userLogOut() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();

    // 서버 쿠키도 정리
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    sessionStorage.removeItem('user');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
