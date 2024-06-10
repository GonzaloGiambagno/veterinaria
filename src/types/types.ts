import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
  extras?: ReactNode;
}

export interface RegisterBody {
  email: string;
  username: string;
  name: string;
  password: string;
  rol: string;
  id_veterinaria: number
}