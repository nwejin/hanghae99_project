'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Card } from '@/components/common';
import Link from 'next/link';
import { Input } from '@/components/common';
import { Avatar } from '@/components/common';

import ImgCarousel from '../ui/post/imgCarousel';
import DropMenu from '../ui/post/dropMenu';
import UserProfile from '../ui/post/userProfile';
import Buttons from '../ui/post/buttons';
import DetailBtn from '../ui/post/detailBtn';
import ContentsBox from '../ui/post/contentsBox';

import DetailPage from './detailPage';
// import { userStore } from '@/store/userStore';
import { fetchLikeData } from '@/lib/postLike';
import { getUserNickname } from '@/lib/userAuth';
import { TotalPostType } from '@/lib/post';
import { timeCheck } from '@/shared/timeUtils';

export default function UserPost({ post, user }: TotalPostType) {
  //   console.log(post.imgUrls);
  const [isOwner, setIsOwner] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [likeInfo, setLikeInfo] = useState<{ recentLikeUser: string | null; likeCount: number }>({
    recentLikeUser: null,
    likeCount: 0,
  });

  // const user_id = userStore((state) => state.userId);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const currentUser = auth.currentUser;

  //   if (currentUser && currentUser.email === user.email) {
  //     setIsOwner(true);
  //   }
  // }, [user.email]);

  useEffect(() => {
    const loadLikeData = async () => {
      const { recentUser, likeCount } = await fetchLikeData(post.id);
      const recentLikeUserNickname = recentUser ? await getUserNickname(recentUser) : null;
      setLikeInfo({ recentLikeUser: recentLikeUserNickname, likeCount });
    };

    loadLikeData();
  }, [post.id]);

  const modalControl = () => {
    setIsOpen((prev) => !prev);
  };

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserId(parsedUserData.userId);
    }
  }, []);

  return (
    <>
      <Card.Card className="mb-5 max-w-lg overflow-hidden rounded-xl">
        <Card.Card className="rounded-none border-0 shadow-none">
          <Card.CardHeader className="flex flex-row items-center p-4">
            <UserProfile nickname={user.nickname} profile_image={user.profile_image} />
            <DropMenu isOwner={isOwner} id={post.id} />
          </Card.CardHeader>
          <Card.CardContent className="relative p-0">
            <ImgCarousel imgUrls={post.imgUrls} />
          </Card.CardContent>
          <Card.CardFooter className="grid gap-2 p-2 pb-4">
            <Buttons postId={post.id} userId={userId} modal={modalControl} />
            <div className="w-full px-2 text-sm">
              {likeInfo.recentLikeUser ? (
                <>
                  <span className="font-black">{likeInfo.recentLikeUser}</span>님 외{' '}
                  <span className="font-black">{likeInfo.likeCount - 1}</span>명이 좋아합니다.
                </>
              ) : (
                '좋아요가 없습니다.'
              )}
            </div>

            <div className="grid w-full gap-1.5 px-2">
              <ContentsBox nickname={user.nickname} contents={post.contents} />
              <div>
                <DetailBtn modal={modalControl} time={post.created_at} />
              </div>
            </div>
          </Card.CardFooter>
        </Card.Card>
      </Card.Card>
      {isOpen ? <DetailPage modal={modalControl} post={post} user={user} /> : ''}
    </>
  );
}
