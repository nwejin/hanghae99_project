'use client';

import { Card } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { petCategoryData } from '@/shared/petCategory';
import { useRouter, useParams } from 'next/navigation';

export default function UserPageTemplates() {
  // const [email, setEmail] = useState('');
  // const [nickname, setNickname] = useState('');
  // const [bio, setBio] = useState('');
  // const [password, setPassword] = useState('');

  // const [profileImg, setProfileImg] = useState('');

  // const [petImg, setPetImg] = useState('');
  // const [petName, setPetName] = useState('');

  // const [petSpecies, setPetSpecies] = useState<string | undefined>('');
  // const [petSubSpecies, setPetSubSpecies] = useState<string | undefined>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { nickname: nicknameParam } = useParams();

  const [userData, setUserData] = useState({
    profile_image: '',
    bio: '',
    nickname: '',
  });

  const [petData, setPetData] = useState([]);
  const [posts, setPosts] = useState([]);

  console.log(posts);

  // console.log(nicknameParam);
  useEffect(() => {
    async function fetchData() {
      try {
        // setNickname(userId);
        const response = await fetch(`/api/profile?nickname=${nicknameParam}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setUserData(data.user);
          setPetData(data.pets);
          setPosts(data.posts);
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
      <Card.Card className="border-0">
        <Card.CardHeader className="mb-4 flex items-center">
          <div className="flex w-3/5 items-center gap-6">
            <div className="flex items-center justify-center">
              <Avatar className="h-40 w-40 border">
                <AvatarImage src={userData.profile_image} alt="User Profile Image" />
                <AvatarFallback>user</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-grow flex-col gap-2">
              {/* Nickname and Basic Info */}
              <div className="flex flex-col">
                <p className="text-lg font-bold">{userData.nickname}</p>
              </div>

              <div className="mt-2 flex items-center gap-4">
                {/* <Avatar className="h-16 w-16">
                  <AvatarImage src={petImg} alt="Pet Image" />
                  <AvatarFallback>pet</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>{petName}</p>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span>{petSpecies}</span>
                    <span>{petSubSpecies}</span>
                  </div>
                </div> */}
              </div>

              <div className="mt-4">
                <p>{userData.bio}</p>
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                <span>게시물 수: 0</span>
                <span>팔로워: 0</span>
                <span>팔로잉: 0</span>
              </div>
            </div>
          </div>
        </Card.CardHeader>

        <Card.CardContent className="grid w-full grid-cols-4 gap-1 p-6">
          {/* <div>
            <img src={posts[0].imgUrls[0]} alt="" />
          </div> */}
          <img src={userData.profile_image} alt="" />
          <img src={userData.profile_image} alt="" />
          <img src={userData.profile_image} alt="" />
          <img src={userData.profile_image} alt="" />
          <img src={userData.profile_image} alt="" />
          <img src={userData.profile_image} alt="" />
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
