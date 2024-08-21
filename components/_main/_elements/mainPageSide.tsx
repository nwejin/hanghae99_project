'use client';
import { Card } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@ui';

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

export default function MainPageSide() {
  const [userData, setUserData] = useState<{ nickname: string; profileImage: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({ nickname: data.nickname, profileImage: data.profile_image });
        }
      }
    };
    console.log(userData);
    fetchUserData();
  }, []);

  return (
    <div>
      <Input className="mb-5 ml-5 w-[20rem]" />
      <Card.Card className="ml-5 h-[20rem] w-[20rem] bg-slate-50">
        <Card.CardHeader>
          <Card.Card className="flex p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.profileImage} alt="img" />
              <AvatarFallback>{userData?.nickname}</AvatarFallback>
            </Avatar>
            <Card.CardContent> {userData?.nickname}</Card.CardContent>
          </Card.Card>
        </Card.CardHeader>
        <Card.CardContent>
          <Card.Card>다른 유저 정보</Card.Card>
        </Card.CardContent>
      </Card.Card>
    </div>
  );
}
