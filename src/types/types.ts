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
  veterinariaId: number
}

export interface Veterinaria {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  proprietario: string;
  proprietario2: string | null;
  logoImage: string | null;  
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string; 
  email: string;
  dni: string;
  password: string;
  telefono: string;
  telefono2: string;
  observaciones: string;
  veterinariaId: number;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string; 
  peso: number;
  fecha_nacimiento: string;
  clienteId: number;
  veterinariaId?: number;
  cliente?: Cliente;
}
