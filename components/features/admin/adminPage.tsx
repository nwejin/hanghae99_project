'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { Switch } from '@/components/common/ui/switch';
import { useToast } from '@/components/common/ui/use-toast';

interface UserItem {
  id: string;
  user_id: string;
  nickname: string;
  profile_image: string;
  role: 'admin' | 'approved' | 'viewer';
}

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, role } = useCurrentUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // admin이 아니면 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) return;
    if (role !== 'admin') {
      router.replace('/');
    }
  }, [isLoggedIn, role, router]);

  // 사용자 목록 조회
  useEffect(() => {
    if (!isLoggedIn || role !== 'admin') return;

    fetch('/api/admin', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('조회 실패');
        return res.json();
      })
      .then(setUsers)
      .catch(() => {
        toast({ title: '사용자 목록을 불러오지 못했습니다.' });
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, role, toast]);

  const handleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'approved' ? 'viewer' : 'approved';
    setUpdating(userId);

    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) throw new Error('변경 실패');

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as UserItem['role'] } : u)));

      toast({
        title: `권한이 변경되었습니다.`,
        description: newRole === 'approved' ? '게시 가능' : '조회만 가능',
      });
    } catch {
      toast({ title: '권한 변경에 실패했습니다.' });
    } finally {
      setUpdating(null);
    }
  };

  if (!isLoggedIn || role !== 'admin') return null;

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-paw-main border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">등록된 사용자가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between rounded-xl border border-paw-border bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-paw-tag bg-paw-main">
                  {user.profile_image ? (
                    <img src={user.profile_image} alt={user.nickname} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-paw-sub">
                      {user.nickname?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-paw-brown">{user.nickname}</p>
                  <p className="text-xs text-gray-400">@{user.user_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{user.role === 'approved' ? '게시 가능' : '조회만'}</span>
                <Switch
                  checked={user.role === 'approved'}
                  onCheckedChange={() => handleToggle(user.id, user.role)}
                  disabled={updating === user.id}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
