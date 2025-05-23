import { CameraIcon, LayoutGrid } from 'lucide-react';
import {
  LightningBoltIcon,
  ShadowIcon,
  CrumpledPaperIcon,
  NotionLogoIcon,
  TransformIcon,
  BarChartIcon,
  DesktopIcon,
  CubeIcon,
} from '@radix-ui/react-icons';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  icon?: any;
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
          icon: CrumpledPaperIcon,
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
        {
          href: '/3dpages',
          label: '3d Pages',
          icon: CubeIcon,
          submenus: [
            {
              href: '/3dpages/metalness',
              label: 'Metalness',
              icon: CubeIcon,
            },
            {
              href: '/3dpages/cut',
              label: 'Cut',
              icon: CubeIcon,
            },
            {
              href: '/3dpages/simulation',
              label: 'Simulation',
              icon: CubeIcon,
            },
          ],
        },

        {
          href: '/',
          label: 'WebProject',
          icon: LayoutGrid,
          submenus: [
            {
              href: '/mondrianmac',
              label: "Mondrian's Mac",
              icon: DesktopIcon,
            },
            {
              href: '/ffandesign',
              label: 'FFan Design',
              icon: TransformIcon,
            },
            {
              href: '/antioch',
              label: 'Antioch',
              icon: NotionLogoIcon,
            },
            {
              href: '/datavis',
              label: 'Dashboard DataVis Demo',
              icon: BarChartIcon,
            },
          ],
        },
        {
          href: '/photography',
          label: 'Photography',
          icon: CameraIcon,
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
