import { LoginType } from './types';
import { createClient } from '@/config/supabase/client';

export async function userLogIn(loginData: LoginType): Promise<string | null> {
  const { user_id, user_password } = loginData;
  try {
    const loginRes = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id, password: user_password }),
    });

    const loginJson = await loginRes.json();

    if (!loginRes.ok) {
      return loginJson.message || '로그인에 실패했습니다.';
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
