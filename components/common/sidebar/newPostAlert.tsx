import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/common';

import Link from 'next/link';

interface NewPostAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewPostAlert({ open, onOpenChange }: NewPostAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[20rem]">
        <AlertDialogHeader>
          {/* <AlertDialogTitle>회원만 이용 가능합니다</AlertDialogTitle> */}
          <AlertDialogDescription>로그인 또는 회원가입 후 이용해주세요!</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>확인</AlertDialogCancel>
          <Link href="/login" passHref>
            <AlertDialogAction>로그인</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
