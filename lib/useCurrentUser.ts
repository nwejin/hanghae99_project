'use client';

import { useEffect, useState } from 'react';

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
  }, []);

  return user;
}
