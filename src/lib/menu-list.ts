import {
  SquarePen,
  LayoutGrid,
  Monitor,
  Globe,
  Bookmark,
  LineChart,
} from 'lucide-react';
import { LightningBoltIcon, ShadowIcon } from '@radix-ui/react-icons';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
  submenus?: Submenu[];
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
          href: '/workingon',
          label: 'WorkingOn',
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: '/mondrianmac',
          label: "Mondrian's Mac",
          icon: Monitor,
          submenus: [],
        },
        {
          href: '/ffandesign',
          label: 'FFan Design',
          icon: Globe,
          submenus: [],
        },
        {
          href: '/antioch',
          label: 'Antioch',
          icon: Bookmark,
          submenus: [],
        },
        {
          href: '/effect',
          label: 'Effect（3D/Shader）',
          icon: ShadowIcon,
          submenus: [],
        },
        {
          href: '/motion',
          label: 'Motion',
          icon: LightningBoltIcon,
          submenus: [],
        },
      ],
    },
    // {
    //   groupLabel: 'Contents',
    //   menus: [
    //     {
    //       href: '',
    //       label: 'Posts',
    //       icon: SquarePen,
    //       submenus: [
    //         {
    //           href: '/posts',
    //           label: 'All Posts',
    //         },
    //         {
    //           href: '/posts/new',
    //           label: 'New Post',
    //         },
    //       ],
    //     },
    //     // {
    //     //   href: '/categories',
    //     //   label: 'Categories',
    //     //   icon: Bookmark,
    //     // },
    //     // {
    //     //   href: '/tags',
    //     //   label: 'Tags',
    //     //   icon: Tag,
    //     // },
    //   ],
    // },
    // {
    //   groupLabel: 'Settings',
    //   menus: [
    //     {
    //       href: '/users',
    //       label: 'Users',
    //       icon: Users,
    //     },
    //     {
    //       href: '/account',
    //       label: 'Account',
    //       icon: Settings,
    //     },
    //   ],
    // },
  ];
}
