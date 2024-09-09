import { DropdownMenu } from '@/components/common';
import { Button } from '@/components/common';
import { PawPrint, Bookmark, FileWarning, Heart, Send, MessageCircle, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { deletePost } from '@/lib/post';
import { string } from 'zod';

interface DropProps {
  isOwner: boolean;
  id: string;
}

export default function DropMenu({ isOwner, id }: DropProps) {
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
          <DropdownMenu.DropdownMenuItem>
            <Bookmark className="mr-2 h-4 w-4" />
            Save
          </DropdownMenu.DropdownMenuItem>

          <DropdownMenu.DropdownMenuSeparator />
          <DropdownMenu.DropdownMenuItem>
            <FileWarning className="mr-2 h-4 w-4" />
            Report
          </DropdownMenu.DropdownMenuItem>
          {isOwner && (
            <>
              <DropdownMenu.DropdownMenuSeparator />
              <DropdownMenu.DropdownMenuItem onClick={handleDeletePost}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenu.DropdownMenuItem>
            </>
          )}
        </DropdownMenu.DropdownMenuContent>
      </DropdownMenu.DropdownMenu>
    </>
  );
}
