import { LoginType } from './types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
// import { userStore } from '@/store/userStore';
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
        sessionStorage.setItem('user', JSON.stringify(userProfile));
      }

      return null;
    } else {
      return data.message || '로그인 실패';
    }
  } catch (error: any) {
    console.error('로그인 실패', error.code);
    return error.message;
  }
}

// error type
// if (isError) {    return <div>Error: {(error as Error).message}</div>  }

// 에러 처리를 위한 헬퍼 함수  const handleError = (error: unknown) => {    const errorMessage =      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."    console.error("에러 발생:", errorMessage)    toast({      title: "오류가 발생했습니다.",      description: errorMessage,    })    setLoading(false) // 에러 발생 시 loading 상태를 false로 설정  }

// } catch (error: unknown) {      const errorMessage =        error instanceof Error          ? error.message          : "알 수 없는 오류가 발생했습니다."      toast({        title: "팔로워 불러오기 실패",        description: errorMessage,      })      setError(errorMessage)    }  }

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
    // userStore.getState().clearUser();
    sessionStorage.removeItem('user');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
