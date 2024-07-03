'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Cliente, Mascota } from '@/types/types';
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';

interface ClienteContextType {
  clientes: Cliente[];
  fetchClientes: () => void;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: number, updatedCliente: Cliente) => void;
  deleteCliente: (id: number) => void;
  mascotas: Mascota[];
  fetchMascotas: () => void;
  addMascota: (mascota: Mascota) => void;
  updateMascota: (id: number, updatedMascota: Mascota) => void;
  deleteMascota: (id: number) => void;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export const ClienteProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  useEffect(() => {
    fetchClientes();
    fetchMascotas();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('/api/clientes');
      setClientes(response.data.clientes);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const fetchMascotas = async () => {
    try {
      const response = await axios.get('/api/mascotas');
      setMascotas(response.data.mascotas);
    } catch (error) {
      console.error('Error fetching mascotas:', error);
    }
  };

  const addCliente = async (cliente: Cliente) => {
    try {
      const response = await axios.post<Cliente>('/api/clientes', cliente);
      setClientes([...clientes, response.data]);
      if (response.status === 200) {
        toast({
          description: "Cliente creado correctamente",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al crear el cliente",
        })
      }
    } catch (error) {
      console.error('Error adding cliente:', error);
    }
  };

  const updateCliente = async (id: number, updatedCliente: Cliente) => {
    try {
      const response = await axios.put(`/api/clientes/${id}`, updatedCliente);
      setClientes(clientes.map(cliente => (cliente.id === id ? response.data : cliente)));
      if (response.status === 200) {
        toast({
          variant: 'success',
          description: "Cliente actualizado correctamente",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al actualizar el cliente",
        })
      }
    } catch (error) {
      console.error('Error updating cliente:', error);
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      await axios.delete(`/api/clientes/${id}`);
      setClientes(clientes.filter(cliente => cliente.id !== id));
        toast({
          description: "Cliente eliminado correctamente",
        })
    } catch (error) {
      console.error('Error deleting cliente:', error);
    }
  };

  const addMascota = async (mascota: Mascota) => {
    try {
      const response = await axios.post<Mascota>('/api/mascotas', mascota);
      setMascotas([...mascotas, response.data]);
    } catch (error) {
      console.error('Error adding mascota:', error);
    }
  };

  const updateMascota = async (id: number, updatedMascota: Mascota) => {
    try {
      const response = await axios.put(`/api/mascotas/${id}`, updatedMascota);
      setMascotas(mascotas.map(mascota => (mascota.id === id ? response.data : mascota)));
      fetchMascotas();
      if (response.status === 200) {
        toast({
          variant: 'success',
          description: "Mascota actualizado correctamente",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al actualizar la mascota",
        })
      }
    } catch (error) {
      console.error('Error updating mascota:', error);
    }
  };

  const deleteMascota = async (id: number) => {
    try {
      await axios.delete(`/api/mascotas/${id}`);
      setMascotas(mascotas.filter(mascota => mascota.id !== id));
    } catch (error) {
      console.error('Error deleting mascota:', error);
    }
  };

  return (
    <ClienteContext.Provider value={{
      clientes,
      fetchClientes,
      addCliente,
      updateCliente,
      deleteCliente,
      mascotas,
      fetchMascotas,
      addMascota,
      updateMascota,
      deleteMascota
    }}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useCliente debe usarse dentro de un ClienteProvider');
  }
  return context;
};
