import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface userProps {
  nickname: string;
  profile_image: string;
}

export default function UserProfile({ nickname, profile_image }: userProps) {
  return (
    <>
      <Link href={`/user/${nickname}`} className="flex items-center gap-2 text-sm font-semibold" prefetch={false}>
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={profile_image} alt={nickname} />
          <AvatarFallback>{nickname}</AvatarFallback>
        </Avatar>
        {nickname}
      </Link>
    </>
  );
}
