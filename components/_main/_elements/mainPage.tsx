'use client';
import UserPost from '../_elements/userPost';
import { useEffect, useState } from 'react';
import { TotalPostType } from '@/lib/post';
import { getPost } from '@/lib/post';

export default function MainPage() {
  const [posts, setPosts] = useState<TotalPostType[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost();
        setPosts(postData);
      } catch (error) {
        console.error('데이터 조회 실패', error);
      }
    };
    fetchPost();
  }, []);

  return (
    <div>
      {posts.map((postData) => (
        <UserPost key={postData.post.id} post={postData.post} user={postData.user} />
      ))}
    </div>
  );
}
