'use client';
import { Card } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@ui';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';
// import { userStore } from '@/store/userStore';
import { getPetLabel } from '@/shared/petCategory';
import { Dog } from 'lucide-react';

import Link from 'next/link';

export default function MainPageSide() {
  const [userData, setUserData] = useState<{
    nickName: string;
    profileImg: string;
    petInfo: { petName: string; pet_image: string };
  } | null>(null);

  const [pet, setPet] = useState<string | null>(null);

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
      const petData = getPetLabel(parsedUserData.petInfo.petSpecies, parsedUserData.petInfo.petSubSpecies);

      setPet(petData);
    }
  }, []);

  // if (!userData) {
  //   return null;
  // }

  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/profile%2Fdefault_user.png?alt=media&token=24a62e1e-26b2-4adc-aa4c-29fefe3bc0bc';

  return (
    <div className="hidden md:block">
      {/* <Input className="mb-5 ml-5 w-[20rem]" /> */}
      <Card.Card className="ml-5 w-[20rem] bg-slate-50">
        <Card.CardHeader>
          {/* 로그인 유저보기 */}

          {!userData ? (
            <>
              <Card.Card className="flex p-3">
                <Link href="/" className="flex h-full w-full">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage alt="img" src={defaultImg} />
                    <AvatarFallback>사용자</AvatarFallback>
                  </Avatar>
                  <Card.CardContent className="flex w-full items-center p-0 pl-6">
                    <div className="font-bold text-gray-500">로그인이 필요합니다.</div>
                  </Card.CardContent>
                </Link>
              </Card.Card>
            </>
          ) : (
            <Card.Card className="flex p-3">
              <Link href={`/user/${userData?.nickName}`} className="flex h-full w-full">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage alt="img" src={userData?.profileImg} />
                  <AvatarFallback>사용자</AvatarFallback>
                </Avatar>
                <Card.CardContent className="w-full p-0 pl-6">
                  <div className="font-bold">{userData?.nickName}</div>
                  <div className="flex text-sm font-bold">
                    <p className="text-gray-500">{userData?.petInfo.petName}</p>
                    <p className="pl-1 pr-1 text-gray-500">-</p>
                    <p className="text-gray-500">{pet}</p>
                  </div>
                </Card.CardContent>
              </Link>
            </Card.Card>
          )}
        </Card.CardHeader>
        <Card.CardContent>
          {/* <div className="flex items-center justify-between">
            <p className="text-xm font-bold text-gray-500">다른 친구 보기</p>
            <Button variant="link" className="text-xm p-0">
              더보기
            </Button>
          </div> */}
          {/* 다른 유저 5명 보여주기 */}
          {/* <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage alt="img" />
              <AvatarFallback>ㅋㅋ</AvatarFallback>
            </Avatar>
            <Card.CardContent>ㅋㅋ</Card.CardContent>
          </Card.Card> */}
        </Card.CardContent>
      </Card.Card>
    </div>
  );
}
