import { Card } from '@ui';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import text_logo from '@/public/text_logo.png';

export default function Header() {
  return (
    <>
      <Card.CardHeader className="items-center">
        {/* <Card.CardTitle>로그인</Card.CardTitle> */}
        <Link href="/">
          <Image src={text_logo} alt="멍냥터 로고" width={180} />
        </Link>
      </Card.CardHeader>
    </>
  );
}
