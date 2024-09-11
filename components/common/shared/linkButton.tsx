import { Button } from '@/components/common';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ButtonProps {
  href: string;
  text: string;
}

export function LinkButton({ href, text }: ButtonProps) {
  return (
    <>
      <Button className="w-full" variant="ghost">
        <Link href={href} className="flex items-center">
          {text}
          <ChevronRight size={16} />
        </Link>
      </Button>
    </>
  );
}
