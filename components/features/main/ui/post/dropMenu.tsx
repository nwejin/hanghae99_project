'use client';

import { DropdownMenu } from '@/components/common';
import { Button } from '@/components/common';
import { PawPrint, Bookmark, Pencil, FileWarning, Heart, Send, MessageCircle, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { deletePost } from '@/lib/post';
import { string } from 'zod';
import { useState } from 'react';
import EditModal from './editModal';

interface DropProps {
  isOwner: boolean;
  id: string;
  contents: string;
}

export default function DropMenu({ isOwner, id, contents }: DropProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditPost = () => {
    setIsEditOpen(true);
  };

  const handleDeletePost = async () => {
    // console.log(id);
    try {
      await deletePost(id);
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
    }
  };

  return (
    <>
      <DropdownMenu.DropdownMenu>
        <DropdownMenu.DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full">
            <PawPrint className="h-4 w-4" />
          </Button>
        </DropdownMenu.DropdownMenuTrigger>
        <DropdownMenu.DropdownMenuContent align="end">
          <DropdownMenu.DropdownMenuItem onClick={handleEditPost}>
            <Pencil className="mr-2 h-4 w-4" />
            수정하기
          </DropdownMenu.DropdownMenuItem>

          <DropdownMenu.DropdownMenuSeparator />
          <DropdownMenu.DropdownMenuItem onClick={handleDeletePost}>
            <Trash2 className="mr-2 h-4 w-4" />
            삭제하기
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.DropdownMenuContent>
      </DropdownMenu.DropdownMenu>
      {isEditOpen && <EditModal postId={id} initialContents={contents} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}
