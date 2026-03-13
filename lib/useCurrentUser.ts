'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/config/supabase/client';

interface CurrentUser {
  userId: string;
  nickname: string;
  profileImg: string | null;
  isLoggedIn: boolean;
}

const defaultUser: CurrentUser = {
  userId: '',
  nickname: '',
  profileImg: null,
  isLoggedIn: false,
};

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>(defaultUser);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        sessionStorage.removeItem('user');
        setUser(defaultUser);
        return;
      }

      const userDataString = sessionStorage.getItem('user');
      if (userDataString) {
        try {
          const parsed = JSON.parse(userDataString);
          setUser({
            userId: parsed.userId || '',
            nickname: parsed.nickName || '',
            profileImg: parsed.profileImg || null,
            isLoggedIn: true,
          });
        } catch {
          setUser(defaultUser);
        }
      }
    });
  }, []);

  return user;
}
