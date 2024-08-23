import Link from 'next/link';
import { Ellipsis, LogOut, LogIn, SquarePen } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { getMenuList } from '@/lib/menu-list';
import { SignBtn } from './signBtn';
import NavBarNewPostBtn from './navBarNewPostBtn';

export default function Navbar() {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  return (
    <>
      <nav className="z-1000 fixed bottom-0 left-0 right-0 z-20 flex justify-around bg-white p-4 shadow-md md:flex lg:hidden">
        <NavBarNewPostBtn />
        {menuList.flatMap(({ menus }) =>
          menus.map(({ href, label, icon: Icon, active }, index) => (
            <Button
              key={label}
              variant={active ? 'secondary' : 'ghost'}
              className="flex flex-col items-center space-y-1"
              asChild>
              <Link href={href}>
                <Icon size={36} />
              </Link>
            </Button>
          ))
        )}
      </nav>
    </>
  );
}
