'use client';

import { LogoHeader } from '@/components/common';
import Link from 'next/link';
import { useState } from 'react';

type Tab = 'findId' | 'resetPassword';
type ResetStep = 'verify' | 'update' | 'done';

export default function FindAccountPage() {
  const [tab, setTab] = useState<Tab>('findId');

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center">
          <LogoHeader />
        </div>

        {/* 탭 */}
        <div className="mt-6 flex rounded-xl border border-paw-border overflow-hidden">
          <button
            onClick={() => setTab('findId')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'findId'
                ? 'bg-paw-main text-white'
                : 'bg-paw-cream-dark text-paw-sub hover:bg-paw-border'
            }`}>
            아이디 찾기
          </button>
          <button
            onClick={() => setTab('resetPassword')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === 'resetPassword'
                ? 'bg-paw-main text-white'
                : 'bg-paw-cream-dark text-paw-sub hover:bg-paw-border'
            }`}>
            비밀번호 재설정
          </button>
        </div>

        <div className="mt-6">
          {tab === 'findId' ? <FindIdForm /> : <ResetPasswordForm />}
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-paw-sub transition-colors hover:text-paw-main">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function FindIdForm() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/find-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setResult(data.user_id);
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <label htmlFor="find-email" className="text-xs font-semibold text-paw-sub">
            이메일
          </label>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <input
          type="email"
          id="find-email"
          placeholder="가입 시 등록한 이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main"
        />
      </div>

      {result && (
        <div className="rounded-xl border border-paw-border bg-paw-cream-dark px-4 py-3 text-center">
          <p className="text-xs text-paw-sub">회원님의 아이디는</p>
          <p className="mt-1 text-base font-bold text-paw-brown">{result}</p>
          <p className="text-xs text-paw-sub">입니다.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-paw-main py-2.5 text-sm font-semibold text-white transition-colors hover:bg-paw-main/80 disabled:opacity-50">
        {loading ? '확인 중...' : '아이디 찾기'}
      </button>
    </form>
  );
}

function ResetPasswordForm() {
  const [step, setStep] = useState<ResetStep>('verify');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'verify', user_id: userId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setStep('update');
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== passwordVerify) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'update', newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setStep('done');
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-paw-border bg-paw-cream-dark px-3 py-2.5 text-sm text-paw-brown placeholder:text-paw-inactive focus:outline-none focus:ring-1 focus:ring-paw-main';
  const labelClass = 'text-xs font-semibold text-paw-sub';

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-paw-brown">비밀번호가 성공적으로 변경되었습니다.</p>
        <Link
          href="/login"
          className="w-full rounded-xl bg-paw-main py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-paw-main/80">
          로그인하러 가기
        </Link>
      </div>
    );
  }

  if (step === 'update') {
    return (
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <label className={labelClass}>새 비밀번호</label>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
          <input
            type="password"
            placeholder="새 비밀번호 (8자 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <div className="mb-1">
            <label className={labelClass}>새 비밀번호 확인</label>
          </div>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-paw-main py-2.5 text-sm font-semibold text-white transition-colors hover:bg-paw-main/80 disabled:opacity-50">
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <label className={labelClass}>아이디</label>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <div className="mb-1">
          <label className={labelClass}>이메일</label>
        </div>
        <input
          type="email"
          placeholder="가입 시 등록한 이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-paw-main py-2.5 text-sm font-semibold text-white transition-colors hover:bg-paw-main/80 disabled:opacity-50">
        {loading ? '확인 중...' : '확인'}
      </button>
    </form>
  );
}
