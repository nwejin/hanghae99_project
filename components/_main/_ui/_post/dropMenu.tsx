import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PawPrint, Bookmark, FileWarning, Heart, Send, MessageCircle, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

interface DropProps {
  isOwner: boolean;
  id: string;
}

export default function DropMenu({ isOwner, id }: DropProps) {
  const handleDeletePost = async () => {
    console.log(id);
    try {
      await deleteDoc(doc(firestore, 'posts', id));
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full">
            <PawPrint className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Bookmark className="mr-2 h-4 w-4" />
            Save
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileWarning className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeletePost}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
