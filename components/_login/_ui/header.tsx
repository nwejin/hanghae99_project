import { Card } from '@ui';
import Link from 'next/link';
import Image from 'next/image';
import text_logo from '@/public/text_logo.png';

export default function Header() {
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
