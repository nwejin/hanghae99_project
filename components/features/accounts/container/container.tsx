'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock, PawPrint, LogOut, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { Select } from '@/components/common';
import { petCategoryData } from '@/shared/petCategory';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { userLogOut } from '@/lib/login';

export function Container() {
  const router = useRouter();
  const currentUser = useCurrentUser();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [profileImg, setProfileImg] = useState('');
  const [petImg, setPetImg] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petSubSpecies, setPetSubSpecies] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
            setNickname(data.user.nickname || '');
            setBio(data.user.bio || '');
            setProfileImg(data.user.profile_image || '');

            if (data.pets?.[0]) {
              setPetImg(data.pets[0].pet_image || '');
              setPetName(data.pets[0].petName || data.pets[0].pet_name || '');
              setPetSpecies(data.pets[0].petSpecies || data.pets[0].pet_species || '');
              setPetSubSpecies(data.pets[0].petSubSpecies || data.pets[0].pet_sub_species || '');
            }
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
          petName,
          petSpecies,
          petSubSpecies,
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
        <Loader2 className="h-8 w-8 animate-spin text-paw-orange" />
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
          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-paw-orange text-white">
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
            className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-orange"
          />
        </div>

        <div className="rounded-2xl border border-paw-border bg-white p-4">
          <label className="mb-1 block text-xs font-semibold text-paw-sub">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-orange"
          />
        </div>

        <div className="rounded-2xl border border-paw-border bg-white p-4">
          <label className="mb-1 block text-xs font-semibold text-paw-sub">이메일</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full rounded-xl border border-paw-border bg-gray-50 px-3 py-2.5 text-sm text-paw-inactive"
          />
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
                className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 pr-10 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-orange"
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
              className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-orange"
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-paw-like">비밀번호가 일치하지 않습니다</p>
            )}
          </div>
        </div>
      </div>

      {/* 반려동물 정보 */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paw-brown">
          <PawPrint size={16} />
          반려동물 정보
        </div>
        <div className="space-y-3 rounded-2xl border border-paw-border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-paw-cream-dark">
              {petImg ? (
                <img src={petImg} alt="반려동물" className="h-full w-full object-cover" />
              ) : (
                <PawPrint size={20} className="text-paw-orange" />
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-paw-sub">이름</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full rounded-xl border border-paw-border bg-paw-cream px-3 py-2.5 text-sm text-paw-brown focus:outline-none focus:ring-1 focus:ring-paw-orange"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-paw-sub">대분류</label>
            <Select.Select value={petSpecies} onValueChange={(value) => { setPetSpecies(value); setPetSubSpecies(''); }}>
              <Select.SelectTrigger className="rounded-xl border-paw-border bg-paw-cream text-sm">
                <Select.SelectValue placeholder="선택" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                <Select.SelectItem value="dog">강아지</Select.SelectItem>
                <Select.SelectItem value="cat">고양이</Select.SelectItem>
                <Select.SelectItem value="other">기타</Select.SelectItem>
              </Select.SelectContent>
            </Select.Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-paw-sub">소분류</label>
            <Select.Select value={petSubSpecies} onValueChange={(value) => setPetSubSpecies(value)}>
              <Select.SelectTrigger className="rounded-xl border-paw-border bg-paw-cream text-sm">
                <Select.SelectValue placeholder="선택" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                {petSpecies &&
                  petCategoryData[petSpecies as keyof typeof petCategoryData]?.map((sub) => (
                    <Select.SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </Select.SelectItem>
                  ))}
              </Select.SelectContent>
            </Select.Select>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-4 text-center text-sm text-paw-like">{error}</p>
      )}

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-paw-orange py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60">
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
        className="mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-red-400 transition-colors hover:text-red-500">
        <LogOut size={16} />
        로그아웃
      </button>
    </div>
  );
}
