'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserProfileProps {
  user: any;
  error?: string;
}

export default function ProfilePage() {
  const params = useSearchParams();
  const nickname = params.get('nickname'); // 쿼리에서 nickname 추출

  const [user, setUser] = useState<UserProfileProps['user']>('');
  const [error, setError] = useState<UserProfileProps['error']>('');

  useEffect(() => {
    if (nickname) {
      fetch(`/api/user?nickname=${nickname}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            console.log(data);
            setUser(data);
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setError('Error fetching data');
        });
    }
  }, [nickname]);

  return <div>{/* 다른 사용자 정보를 여기에 표시 */}</div>;
}
