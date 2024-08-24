import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Input } from '@ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Post, User } from '@/lib/getAllPost';

import ImgCarousel from '../_ui/_post/imgCarousel';
import DropMenu from '../_ui/_post/dropMenu';
import UserProfile from '../_ui/_post/userProfile';
import Buttons from '../_ui/_post/buttons';
import DetailBtn from '../_ui/_post/detailBtn';
import ContentsBox from '../_ui/_post/contentsBox';

import DetailPage from '../_elements/detailPage';
import { userStore } from '@/store/userStore';
import { fetchLikeData } from '@/lib/postLike';
import { getUserNickname } from '@/lib/userAuth';

interface UserPostProps {
  post: Post;
  user: User;
}

export default function UserPost({ post, user }: UserPostProps) {
  //   console.log(post.imgUrls);
  const [isOwner, setIsOwner] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [likeInfo, setLikeInfo] = useState<{ recentLikeUser: string | null; likeCount: number }>({
    recentLikeUser: null,
    likeCount: 0,
  });

  const user_id = userStore((state) => state.user);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.email === user.email) {
      setIsOwner(true);
    }
  }, [user.email]);

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

  return (
    <>
      <Card className="mb-5 max-w-lg overflow-hidden rounded-xl">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="flex flex-row items-center p-4">
            <UserProfile nickname={user.nickname} profile_image={user.profile_image} />
            <DropMenu isOwner={isOwner} id={post.id} />
          </CardHeader>
          <CardContent className="relative p-0">
            <ImgCarousel imgUrls={post.imgUrls} />
          </CardContent>
          <CardFooter className="grid gap-2 p-2 pb-4">
            <Buttons postId={post.id} userId={user_id} />
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
              <DetailBtn modal={modalControl} />
            </div>
          </CardFooter>
        </Card>
      </Card>
      {isOpen ? <DetailPage modal={modalControl} post={post} user={user} /> : ''}
    </>
  );
}
