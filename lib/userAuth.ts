'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/config/supabase/client';
import { useRouter } from 'next/navigation';

export async function getUserNickname(uid: string): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', uid)
      .single();

    if (error || !data) {
      console.error('사용자 문서가 존재하지 않습니다.');
      return null;
    }

    return data.nickname || null;
  } catch (error) {
    console.error('사용자 닉네임을 가져오는 중 오류 발생:', error);
    return null;
  }
}

export interface UserProfileProps {
  profileImage: string;
  nickname: string;
}

export async function getUserProfile(userId: string): Promise<UserProfileProps | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('profile_image, nickname')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      profileImage: data.profile_image,
      nickname: data.nickname,
    };
  } catch (error) {
    console.error('유저 불러오기 오류', error);
    return null;
  }
}

export function userAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 인증 상태 변경 감지
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        switch (authError.message) {
          case 'Invalid login credentials':
            setError('이메일/비밀번호를 확인해주세요');
            break;
          case 'Email not confirmed':
            setError('이메일 인증을 완료해주세요');
            break;
          default:
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
        }
        return null;
      }

      const user = data.user;
      if (user) {
        const nickname = await getUserNickname(user.id);

        sessionStorage.setItem(
          'auth',
          JSON.stringify({
            email: user.email,
            nickname: nickname,
          })
        );
      }

      setLoading(false);
      return data;
    } catch (error: any) {
      setLoading(false);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      return null;
    }
  };

  return { login, error, loading };
}
