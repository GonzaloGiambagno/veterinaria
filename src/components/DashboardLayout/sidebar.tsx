'use client';

import {
  Home,
  PawPrint ,
  ClipboardPlus,
  CalendarDays,
  ShoppingCart,
  ScanBarcode,
  UserRoundCog, 
  Notebook 
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Inicio', href: '/dashboard/inicio', icon: Home },
    { label: 'Clientes', href: '/dashboard/clientes', icon: PawPrint   },
    { label: 'Historia Clinica', href: '/dashboard/historia-clinica', icon: ClipboardPlus  },
    { label: 'Turnos', href: '/dashboard/turnos', icon: CalendarDays  },
    { label: 'Ventas', href: '/dashboard/ventas', icon: ShoppingCart  },
    { label: 'Caja', href: '/dashboard/caja', icon: Notebook  },
    { label: 'Inventario', href: '/dashboard/inventario', icon: ScanBarcode  },
    { label: 'Usuarios', href: '/dashboard/usuarios', icon: UserRoundCog   },
  ],
  // extras: (
  // ),
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