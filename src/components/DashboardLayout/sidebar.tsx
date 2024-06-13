'use client';

import {
  Home,
  MoreHorizontal,
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Inicio', href: '/dashboard/inicio', icon: Home },
  ],
  extras: (
    <div className='flex flex-col gap-2'>
      <SidebarButton icon={MoreHorizontal} className='w-full'>
        Ver más
      </SidebarButton>
    </div>
  ),
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}