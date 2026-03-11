import Link from 'next/link';
import Image from 'next/image';
import text_logo from '@/public/text_logo.png';

export function LogoHeader() {
  return (
    <Link href="/">
      <Image src={text_logo} alt="멍냥터 로고" width={160} />
    </Link>
  );
}
