import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid, LucideIcon } from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: '새 게시글',
          active: pathname.includes('/'),
          icon: LayoutGrid,
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/pets',
          label: '반려동물 정보',
          active: pathname.includes('/pets'),
          icon: SquarePen,
        },
        {
          href: '/pets',
          label: '반려동물 공간',
          active: pathname.includes('/pets'),
          icon: Bookmark,
        },
        {
          href: '/direct',
          label: '메시지',
          active: pathname.includes('/direct'),
          icon: Tag,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/user',
          label: '프로필',
          active: pathname.includes('/user'),
          icon: Users,
        },
        {
          href: '/setting',
          label: '계정 설정',
          active: pathname.includes('/setting'),
          icon: Settings,
        },
      ],
    },
  ];
}
