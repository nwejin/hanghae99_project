'use client';

import { Card } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function AccountPageTemplates() {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          const userId = parsedUserData.userId;
          setNickname(userId);
          const response = await fetch(`/api/accounts?userId=${userId}`);
          const data = await response.json();
          console.log(data);

          // if (response.ok) {
          //   setNickname(data.nickname || '');
          //   setBio(data.bio || '');
          //   setPetName(data.petInfo?.petName || '');
          //   setPetSpecies(data.petInfo?.petSpecies || '');
          // } else {
          //   setError(data.error || 'Error fetching data');
          // }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Card.Card className="h-[50rem]">
        <Card.CardHeader>
          <Card.CardTitle className="border-b pb-6 text-xl">계정 설정</Card.CardTitle>
        </Card.CardHeader>
        <Card.CardContent className="grid w-full grid-cols-6 gap-4 bg-slate-200 p-6">
          <Card.Card className="col-span-3 rounded-md bg-white p-3 shadow-md">
            <Card.CardHeader className="mb-4 p-0">
              <Card.CardTitle className="border-b pb-3 text-lg">프로필 설정</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-7 items-center gap-6 bg-slate-100">
                  <div className="col-span-2 bg-slate-400">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src="https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/profile%2Fdefault_user.png?alt=media&token=24a62e1e-26b2-4adc-aa4c-29fefe3bc0bc"
                        alt="User Profile Image"
                      />
                      <AvatarFallback>user</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="col-span-5 bg-black">
                    <div className="items-center">
                      <label className="text-sm font-semibold">이메일</label>
                      <Input value={nickname} disabled className="" />
                    </div>
                    <div className="items-center">
                      <label className="w-14 text-sm font-semibold">닉네임</label>
                      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">비밀번호</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold">비밀번호 확인</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold">자기소개</label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>
            </Card.CardContent>
            <Card.CardFooter className="flex justify-end bg-white p-6">
              <Button>저장하기</Button>
            </Card.CardFooter>
          </Card.Card>

          <Card.Card className="col-span-3 rounded-md bg-white p-6 shadow-md">
            <Card.CardHeader className="mb-4 p-0">
              <Card.CardTitle className="border-b pb-3 text-lg">반려동물 설정</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-7 items-center gap-6">
                  <div className="col-span-1">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src="https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/profile%2Fdefault_user.png?alt=media&token=24a62e1e-26b2-4adc-aa4c-29fefe3bc0bc"
                        alt="User Profile Image"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="col-span-5">
                    <div className="flex items-center">
                      <label className="w-14 text-sm font-semibold">이름</label>
                      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">비밀번호</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold">비밀번호 확인</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold">자기소개</label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>
            </Card.CardContent>
            <Card.CardFooter className="flex justify-end bg-white p-6">
              <Button>저장하기</Button>
            </Card.CardFooter>
          </Card.Card>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
