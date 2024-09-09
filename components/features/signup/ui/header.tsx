import { Card } from '@/components/common';

export default function Header() {
  return (
    <>
      <Card.CardHeader>
        <Card.CardTitle className="text-xl">회원가입</Card.CardTitle>
        <Card.CardDescription> 회원 정보를 입력해주세요!</Card.CardDescription>
      </Card.CardHeader>
    </>
  );
}
