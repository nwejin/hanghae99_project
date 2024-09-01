'use client';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { userStore } from '@/store/userStore';

export async function getUserNickname(uid: string): Promise<string | null> {
  try {
    const userDoc = doc(firestore, 'users', uid);
    const getUserDoc = await getDoc(userDoc);

    if (getUserDoc.exists()) {
      return getUserDoc.data().nickname || null;
    } else {
      console.error('사용자 문서가 존재하지 않습니다.');
      return null;
    }
  } catch (error) {
    console.error('Firestore에서 사용자 닉네임을 가져오는 중 오류 발생:', error);
    return null;
  }
}

export interface UserProfileProps {
  profileImage: string;
  nickname: string;
}

export async function getUserProfile(userId: string): Promise<UserProfileProps | null> {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        profileImage: userData.profile_image,
        nickname: userData.nickname,
      };
    }
    return null;
  } catch (error) {
    console.error('유저 불러오기 오류', error);
    return null;
  }
}

export function userAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  // const { setUser } = userStore();

  // 세션이 없으면 쿠키도 삭제
  const checkSessionAndCookie = () => {
    const session = sessionStorage.getItem('auth');
    const cookieAuth = getCookie('auth');

    if (!session && cookieAuth) {
      // 세션이 없고 쿠키가 존재하면 쿠키 삭제
      deleteCookie('auth');
    }
  };

  useEffect(() => {
    checkSessionAndCookie();

    // 인증 상태 갱신
    const checkUserStore = auth.onAuthStateChanged(async (user) => {
      // if (user) {
      //   setUser(user.uid);
      // } else {
      //   setUser('');
      // }
    });

    return () => checkUserStore();
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      // setUser(user.uid);

      // Firestore에서 닉네임 가져오기
      const nickname = await getUserNickname(user.uid);

      // 세션에 사용자 정보 저장
      sessionStorage.setItem(
        'auth',
        JSON.stringify({
          email: user.email,
          nickname: nickname,
        })
      );

      // 쿠키에 저장
      setCookie('auth', JSON.stringify({ email: user.email, nickname: nickname }), { path: '/' });

      setLoading(false);
      return userCredential;
    } catch (error: any) {
      setLoading(false);

      switch (error.code) {
        case 'auth/invalid-credential':
          setError('이메일/비밀번호를 확인해주세요');
          console.log(error.code);
          break;
        case 'auth/user-not-found':
          setError('가입 정보가 없습니다.');
          break;
        case 'auth/wrong-password':
          setError('비밀번호를 확인해주세요');
          break;
        case 'auth/too-many-requests':
          setError('잠시 후 다시 시도해주세요.');
          break;
        default:
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
      return null;
    }
  };

  // const logout = () => {
  //   auth.signOut();
  //   sessionStorage.removeItem('user');
  //   setCookie('session', '', { path: '/', maxAge: -1 });
  //   router.push('/');
  // };

  return { login, error, loading };
}
