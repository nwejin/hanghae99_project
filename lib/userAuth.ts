'use client';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

import { setCookie } from 'cookies-next';
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

export function userAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = userStore();

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      setUser(user.uid);

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
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('이메일 또는 비밀번호를 확인해주세요');
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

  const logout = () => {
    auth.signOut();
    sessionStorage.removeItem('auth');
    setCookie('auth', '', { path: '/', maxAge: -1 });
    router.push('/');
  };

  return { login, logout, error, loading };
}
