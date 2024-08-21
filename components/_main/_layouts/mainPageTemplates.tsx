'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserPost from '../_elements/userPost';
import { getAllPost } from '@/lib/getAllPost';
import { useEffect, useState } from 'react';
import { PostData } from '@/lib/getAllPost';

export default function MainPageTemplates() {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPost();
        setPosts(postsData);
        console.log(postsData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((postData) => (
        <UserPost key={postData.post.id} post={postData.post} user={postData.user} />
      ))}
    </div>
  );
}
