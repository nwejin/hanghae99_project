import { Card } from '@/components/common';
import Link from 'next/link';
import Image from 'next/image';
import text_logo from '@/public/text_logo.png';

export function LogoHeader() {
  return (
    <>
      <Card.CardHeader className="items-center">
        <Link href="/">
          <Image src={text_logo} alt="멍냥터 로고" width={180} />
        </Link>
      </Card.CardHeader>
    </>
  );
}
