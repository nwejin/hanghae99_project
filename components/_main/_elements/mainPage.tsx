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

export default function MainPage() {
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
  //   const posts: PostData[] = [
  //     {
  //       post: {
  //         id: '1',
  //         userId: 'user1',
  //         contents:
  //           'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore vel ipsa, ab, nostrum quia minima corporis explicabo rem sapiente excepturi placeat architecto molestias recusandae fugiat iusto est neque autem sunt.',
  //         imgUrls: [
  //           'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724215301226_e608213f-0bd3-44e0-b8e8-8943c3459b21?alt=media&token=404e3f34-4707-47e4-9831-2ca726bd103e',
  //           'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724217200998_66ac44fd-7d6d-4d3e-a6dd-996dc836c69c?alt=media&token=0d88a29e-01d5-4d6f-96ea-a37e81743af5',
  //         ],
  //         created_at: '2024-08-21T12:00:00Z',
  //         likes: ['user2', 'user3'],
  //         comments: ['Nice post!', 'I agree!'],
  //         status: true,
  //       },
  //       user: {
  //         id: 'user1',
  //         email: 'user1@example.com',
  //         nickname: 'user1nickname',
  //         profile_image: 'https://example.com/profile1.png',
  //         petName: 'Buddy',
  //         pet_image: 'https://example.com/pet1.png',
  //       },
  //     },
  //     {
  //       post: {
  //         id: '2',
  //         userId: 'user2',
  //         contents: 'Another test post content.',
  //         imgUrls: [
  //           'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724215301226_e608213f-0bd3-44e0-b8e8-8943c3459b21?alt=media&token=404e3f34-4707-47e4-9831-2ca726bd103e',
  //           'https://firebasestorage.googleapis.com/v0/b/hanghae99-project-0807.appspot.com/o/images%2F1724217200998_66ac44fd-7d6d-4d3e-a6dd-996dc836c69c?alt=media&token=0d88a29e-01d5-4d6f-96ea-a37e81743af5',
  //         ],
  //         created_at: '2024-08-22T14:00:00Z',
  //         likes: ['user1'],
  //         comments: ['Great content!'],
  //         status: true,
  //       },
  //       user: {
  //         id: 'user2',
  //         email: 'user2@example.com',
  //         nickname: 'user2nickname',
  //         profile_image: 'https://example.com/profile2.png',
  //         petName: 'Max',
  //         pet_image: 'https://example.com/pet2.png',
  //       },
  //     },
  //   ];

  return (
    <div>
      {posts.map((postData) => (
        <UserPost key={postData.post.id} post={postData.post} user={postData.user} />
      ))}
    </div>
  );
}
