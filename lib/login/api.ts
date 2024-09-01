import { LoginType } from './types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { userStore } from '@/store/userStore';
import { deleteCookie } from 'cookies-next';

export async function userLogIn(loginData: LoginType): Promise<string | null> {
  const { email, user_password } = loginData;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, user_password);
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
      // 사용자 정보 가져오기
      const userProfileRes = await fetch('/api/login', {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함하여 요청 (인증 상태)
      });

      const userProfile = await userProfileRes.json();
      // console.log(userProfile);

      if (userProfileRes.ok) {
        userStore.getState().setUserId(userProfile.userId);
        userStore.getState().setEmail(userProfile.email);
        userStore.getState().setNickName(userProfile.nickName);
        userStore.getState().setProfileImg(userProfile.profileImg);

        if (userProfile.petInfo) {
          userStore.getState().setPetInfo(userProfile.petInfo);
        }
      }

      // sessionStorage.setItem('user', JSON.stringify(userProfile));
      return null;
    } else {
      return data.message || '로그인 실패';
    }
  } catch (error: any) {
    console.error('로그인 실패', error.code);
    return error.message;
  }
}

export async function userLogOut() {
  try {
    // Firebase 인증 로그아웃
    await auth.signOut();

    // 클라이언트 세션 스토리지에서 유저 정보 제거
    // sessionStorage.removeItem('user');

    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    // console.log(response);

    // 세션 쿠키 삭제 (만료 시간 설정)

    if (response.ok) {
      // 클라이언트에서 쿠키 삭제
      deleteCookie('session', { path: '/' });
    }
    // Zustand 상태 초기화
    userStore.getState().clearUser();
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
