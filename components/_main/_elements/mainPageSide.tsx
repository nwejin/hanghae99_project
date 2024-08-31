'use client';
import { Card } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@ui';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';

export default function MainPageSide() {
  const [userData, setUserData] = useState<{ nickname: string; profileImage: string } | null>(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (user) {
  //       const userDocRef = doc(firestore, 'users', user.uid);
  //       const userDoc = await getDoc(userDocRef);

  //       if (userDoc.exists()) {
  //         const data = userDoc.data();
  //         setUserData({ nickname: data.nickname, profileImage: data.profile_image });
  //       }
  //     }
  //   };
  //   console.log(userData);
  //   fetchUserData();
  // }, []);

  return (
    <div className="hidden md:block">
      <Input className="mb-5 ml-5 w-[20rem]" />
      <Card.Card className="ml-5 w-[20rem] bg-slate-50">
        <Card.CardHeader>
          {/* 나 보기 */}
          <Card.Card className="flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
        </Card.CardHeader>
        <Card.CardContent>
          <div className="flex items-center justify-between">
            <p className="text-xm font-bold text-gray-500">다른 친구 보기</p>
            <Button variant="link" className="text-xm p-0">
              더보기
            </Button>
          </div>
          {/* 다른 유저 5명 보여주기 */}
          <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
          <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
          <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
          <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
          <Card.Card className="mb-3 flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
        </Card.CardContent>
      </Card.Card>
    </div>
  );
}
