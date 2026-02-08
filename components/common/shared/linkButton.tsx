//import { Button } from '@/components/common';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ButtonProps {
  href: string;
  text: string;
}

export function LinkButton({ href, text }: ButtonProps) {
  return (
    <>
      <Link
        href={href}
        className="flex h-full w-full items-center justify-center rounded-md bg-gray-300 py-2 text-[#333]">
        {text}
        <ChevronRight size={18} color="#333" />
      </Link>
    </>
  );
}
