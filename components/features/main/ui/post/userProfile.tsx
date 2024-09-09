import Link from 'next/link';
import { Avatar } from '@/components/common';

interface userProps {
  nickname: string;
  profile_image: string;
}

export default function UserProfile({ nickname, profile_image }: userProps) {
  return (
    <>
      <Link href={`/user/${nickname}`} className="flex items-center gap-2 text-sm font-semibold" prefetch={false}>
        <Avatar.Avatar className="h-8 w-8 border">
          <Avatar.AvatarImage src={profile_image} alt={nickname} />
          <Avatar.AvatarFallback>{nickname}</Avatar.AvatarFallback>
        </Avatar.Avatar>
        {nickname}
      </Link>
    </>
  );
}
