'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock, LogOut, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { userLogOut } from '@/lib/login';

export function Container() {
  const router = useRouter();
  const currentUser = useCurrentUser();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [profileImg, setProfileImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          const userId = parsedUserData.userId;
          const response = await fetch(`/api/accounts?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            setEmail(data.user.email || '');
            setOriginalEmail(data.user.email || '');
            setNickname(data.user.nickname || '');
            setBio(data.user.bio || '');
            setProfileImg(data.user.profile_image || '');
          }
        }
      } catch {
        setError('데이터를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          bio,
          newPassword: newPassword || undefined,
          newEmail: email !== originalEmail ? email : undefined,
        }),
      });

      if (response.ok) {
        // sessionStorage 업데이트
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const parsed = JSON.parse(userDataString);
          parsed.nickName = nickname;
          sessionStorage.setItem('user', JSON.stringify(parsed));
        }
        if (email !== originalEmail) {
          setEmailSent(true);
          setOriginalEmail(email);
          setTimeout(() => setEmailSent(false), 5000);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setError(data.error || '저장에 실패했습니다');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userLogOut();
      sessionStorage.removeItem('user');
      router.push('/login');
    } catch {
      setError('로그아웃에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-paw-main" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-lg font-bold text-paw-brown">계정 설정</h1>

      {/* 프로필 이미지 */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-paw-border bg-paw-cream-dark">
            {profileImg ? (
              <img src={profileImg} alt="프로필" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-paw-sub">
                {nickname?.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-paw-main text-white">
            <Camera size={14} />
          </div>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-paw-border bg-white p-4">
          <label className="mb-1 block text-xs font-semibold text-paw-sub">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-main"
          />
        </div>

        <div className="rounded-2xl border border-paw-border bg-white p-4">
          <label className="mb-1 block text-xs font-semibold text-paw-sub">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-main"
          />
        </div>

        <div className="rounded-2xl border border-paw-border bg-white p-4">
          <label className="mb-1 block text-xs font-semibold text-paw-sub">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-main"
          />
          {emailSent && (
            <p className="mt-1.5 text-xs text-paw-main">
              입력한 이메일로 확인 링크를 보냈습니다. 링크를 클릭하면 변경이 완료됩니다.
            </p>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paw-brown">
          <Lock size={16} />
          비밀번호 변경
        </div>
        <div className="space-y-3 rounded-2xl border border-paw-border bg-white p-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-paw-sub">새 비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상"
                className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 pr-10 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-paw-sub">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-paw-sub">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-paw-like">비밀번호가 일치하지 않습니다</p>
            )}
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="mt-4 text-center text-sm text-paw-like">{error}</p>}

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-app mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-paw-main py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60">
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : saved ? (
          <>
            <Check size={18} />
            저장 완료
          </>
        ) : (
          '저장하기'
        )}
      </button>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="btn-app mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-sm font-medium text-paw-cream transition-colors">
        <LogOut size={16} />
        로그아웃
      </button>
    </div>
  );
}
