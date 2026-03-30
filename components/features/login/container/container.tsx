import { LogoHeader } from '@/components/common';
import LoginForm from '../sections/loginForm';
import Link from 'next/link';

export function Container() {
  return (
    <div className="w-full max-w-md p-8">
      <div className="flex justify-center">
        <LogoHeader />
      </div>
      <LoginForm />
      <div className="mt-6 text-center">
        <span className="text-sm text-paw-sub">계정이 없으신가요? </span>
        <Link
          href="/signup"
          className="text-sm font-semibold text-paw-main transition-colors hover:text-paw-main/80">
          회원가입
        </Link>
      </div>
      <div className="mt-2 text-center">
        <Link
          href="/find-account"
          className="text-xs text-paw-sub transition-colors hover:text-paw-main">
          아이디 찾기 · 비밀번호 재설정
        </Link>
      </div>
    </div>
  );
}
