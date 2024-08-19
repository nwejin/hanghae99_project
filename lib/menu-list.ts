import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  PawPrint,
  MessageSquareHeart,
} from 'lucide-react';

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

export function getMenuList(pathname: string, user?: { nickname?: string | null }): Group[] {
  return [
    // {
    //   groupLabel: '',
    //   menus: [
    //     {
    //       href: '/',
    //       label: '새 게시글',
    //       active: pathname.includes('/'),
    //       icon: LayoutGrid,
    //     },
    //   ],
    // },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/pets',
          label: '반려동물 정보',
          active: pathname.includes('/pets'),
          icon: PawPrint,
        },
        // {
        //   href: '/pets',
        //   label: '반려동물 공간',
        //   active: pathname.includes('/pets'),
        //   icon: Bookmark,
        // },
        {
          href: '/direct',
          label: '메시지',
          active: pathname.includes('/direct'),
          icon: MessageSquareHeart,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: `/user/${user?.nickname}`,
          label: '프로필',
          active: pathname.includes('/user'),
          icon: Users,
        },
        {
          href: `/accounts/${user?.nickname}`,
          label: '계정 설정',
          active: pathname.includes('/setting'),
          icon: Settings,
        },
      ],
    },
  ];
}
