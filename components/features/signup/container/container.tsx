import SignUpForm from '../sections/signUpForm';
import Image from 'next/image';
import { dog_img, cat_img } from '@/public';
import Link from 'next/link';

export function Container() {
  return (
    <div className="w-full max-w-md p-8">
      <div className="mb-6 flex items-end justify-center gap-1">
        <Image src={dog_img} alt="dog" width={80} />
        <Image src={cat_img} alt="cat" width={80} />
      </div>
      <h1 className="mb-6 text-center text-lg font-bold text-paw-brown">회원가입</h1>
      <SignUpForm />
      <div className="mt-6 text-center">
        <span className="text-sm text-paw-sub">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-sm font-semibold text-paw-orange transition-colors hover:text-paw-orange/80">
          로그인
        </Link>
      </div>
    </div>
  );
}
