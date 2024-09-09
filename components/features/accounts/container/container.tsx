'use client';

import { Card } from '@/components/common';
import { Avatar } from '@/components/common';
import { Input } from '@/components/common';
import { Textarea } from '@/components/common';
import { Button } from '@/components/common';
import { useState, useEffect } from 'react';
import { Select } from '@/components/common';
import { petCategoryData } from '@/shared/petCategory';
import { Eye } from 'lucide-react';

//SelectTrigger, SelectContent, SelectItem, SelectValue

export function Container() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');

  const [profileImg, setProfileImg] = useState('');

  const [petImg, setPetImg] = useState('');
  const [petName, setPetName] = useState('');

  const [petSpecies, setPetSpecies] = useState<string | undefined>('');
  const [petSubSpecies, setPetSubSpecies] = useState<string | undefined>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isView, setIsView] = useState<'password' | 'text'>('password');

  useEffect(() => {
    async function fetchData() {
      try {
        const userDataString = sessionStorage.getItem('user');
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          const userId = parsedUserData.userId;
          // setNickname(userId);
          const response = await fetch(`/api/accounts?userId=${userId}`);
          const data = await response.json();
          // console.log(data);
          // console.log(data.pets[0]);

          if (response.ok) {
            setEmail(data.user.email || '');
            setNickname(data.user.nickname || '');
            setBio(data.user.bio || '');
            setPassword(data.user.password);
            setProfileImg(data.user.profile_image || '');

            // 반려동물
            setPetImg(data.pets[0].pet_image);
            setPetName(data.pets[0].petName || '');
            setPetSpecies(data.pets[0].petSpecies || '');
            setPetSubSpecies(data.pets[0].petSubSpecies || '');
          } else {
            setError(data.error || 'Error fetching data');
          }
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

  const handleSpeciesChange = (species: any) => {
    setPetSpecies(species);
    setPetSubSpecies(''); // 중분류 초기화
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Card.Card className="h-[50rem]">
        <Card.CardHeader>
          <Card.CardTitle className="border-b pb-6 text-xl">계정 설정</Card.CardTitle>
        </Card.CardHeader>
        <Card.CardContent className="grid w-full grid-cols-6 gap-4 p-6">
          <Card.Card className="col-span-3 rounded-md bg-white p-3 shadow-md">
            <Card.CardHeader className="mb-4 p-0">
              <Card.CardTitle className="border-b pb-3 text-lg">프로필 설정</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-7 items-center gap-6">
                  <div className="col-span-2 flex items-center justify-center">
                    <Avatar.Avatar className="h-16 w-16">
                      <Avatar.AvatarImage src={profileImg} alt="User Profile Image" />
                      <Avatar.AvatarFallback>user</Avatar.AvatarFallback>
                    </Avatar.Avatar>
                  </div>
                  <div className="col-span-5">
                    <div className="items-center">
                      <label className="w-14 text-sm font-semibold">닉네임</label>
                      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                    <div className="items-center">
                      <label className="text-sm font-semibold">자기소개</label>
                      <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">이메일</label>
                  <Input value={email} disabled className="" />
                </div>
                <div>
                  <label className="text-sm font-semibold">비밀번호</label>
                  <div className="flex">
                    <Input type={isView} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button
                      onMouseDown={() => setIsView('text')}
                      onMouseUp={() => setIsView('password')}
                      onMouseLeave={() => setIsView('password')}>
                      <Eye />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">비밀번호 확인</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                  <div className="col-span-2 flex items-center justify-center">
                    <Avatar.Avatar className="h-16 w-16">
                      <Avatar.AvatarImage src={petImg} alt="User Profile Image" />
                      <Avatar.AvatarFallback>U</Avatar.AvatarFallback>
                    </Avatar.Avatar>
                  </div>
                  <div className="col-span-5">
                    <div className="items-center">
                      <label className="w-14 text-sm font-semibold">이름</label>
                      <Input value={petName} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="w-14 text-sm font-semibold">대분류</label>
                  <Select.Select
                    value={petSpecies}
                    onValueChange={(value) => handleSpeciesChange(value as keyof typeof petCategoryData)}>
                    <Select.SelectTrigger>
                      <Select.SelectValue placeholder="대분류" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      <Select.SelectItem value="dog">강아지</Select.SelectItem>
                      <Select.SelectItem value="cat">고양이</Select.SelectItem>
                      <Select.SelectItem value="other">기타</Select.SelectItem>
                    </Select.SelectContent>
                  </Select.Select>
                </div>
                <div>
                  <label className="w-14 text-sm font-semibold">소분류</label>
                  <Select.Select value={petSubSpecies} onValueChange={(value) => setPetSubSpecies(value)}>
                    <Select.SelectTrigger>
                      <Select.SelectValue placeholder="중분류" />
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                      {petSpecies &&
                        petCategoryData[petSpecies as keyof typeof petCategoryData]?.map((subspecies) => (
                          <Select.SelectItem key={subspecies.value} value={subspecies.value}>
                            {subspecies.label}
                          </Select.SelectItem>
                        ))}
                    </Select.SelectContent>
                  </Select.Select>
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
