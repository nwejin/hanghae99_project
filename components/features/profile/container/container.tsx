'use client';

import { Card } from '@/components/common';
import { Avatar } from '@/components/common';
import { Input } from '@/components/common';
import { Textarea } from '@/components/common';
import { Button } from '@/components/common';
import { useState, useEffect } from 'react';
import { Select } from '@/components/common';
import { petCategoryData } from '@/shared/petCategory';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { PostType, UserType, PetType, getProfile } from '@/lib/profile';

export function Container() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { nickname: nicknameParam } = useParams();

  const [userData, setUserData] = useState({
    profile_image: '',
    bio: '',
    nickname: '',
  });

  const [petData, setPetData] = useState<PetType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);

  // console.log(posts);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile(String(nicknameParam));

        console.log(data);
        if (data) {
          setUserData(data.user);
          setPetData(data.pets || []);
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    if (nicknameParam) fetchData();
  }, [nicknameParam]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Card.Card className="border-0">
        <Card.CardHeader className="mb-4 flex items-center">
          <div className="flex w-3/5 items-center gap-6">
            <div className="flex items-center justify-center">
              <Avatar.Avatar className="h-40 w-40 border">
                <Avatar.AvatarImage src={userData.profile_image} alt="User Profile Image" />
                <Avatar.AvatarFallback>user</Avatar.AvatarFallback>
              </Avatar.Avatar>
            </div>

            <div className="flex flex-grow flex-col gap-2">
              {/* Nickname and Basic Info */}
              <div className="flex flex-col">
                <p className="text-lg font-bold">{userData.nickname}</p>
              </div>

              <div className="mt-2 flex items-center gap-4">
                <Avatar.Avatar className="h-16 w-16">
                  <Avatar.AvatarImage src="" alt="Pet Image" />
                  <Avatar.AvatarFallback>pet</Avatar.AvatarFallback>
                </Avatar.Avatar>
                {/* <div className="flex flex-col">
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

        <Card.CardContent className="grid w-full grid-cols-4 gap-1 border-t-2 p-6">
          {posts.map((post, index) => (
            <div className="aspect-square rounded-sm">
              <img
                key={index}
                src={String(post.imgUrls[0])}
                alt={`게시글 이미지 ${index + 1}`}
                className="left-0 top-0 h-full w-full rounded-sm object-cover"
              />
            </div>
          ))}
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
