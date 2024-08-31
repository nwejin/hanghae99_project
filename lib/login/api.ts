import { LoginType } from './types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export async function login(loginData: LoginType): Promise<string | null> {
  const { email, password } = loginData;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ID 토큰 가져오기
    const idToken = await user.getIdToken();

    // 서버에 ID 토큰을 보내 세션 쿠키를 생성
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    // console.log(idToken);
    // console.log('로그인 응답:', data);

    if (response.ok) {
      //   console.log(message);

      sessionStorage.setItem('auth', JSON.stringify({ email }));
      return null;
    } else {
      return data.message || '로그인 실패';
    }
  } catch (error: any) {
    console.error('로그인 실패', error.code);
    return error.message;
  }
}
