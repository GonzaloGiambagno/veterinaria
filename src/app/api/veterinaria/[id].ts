import { NextApiRequest, NextApiResponse } from 'next';
import { getSession  } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getSession({ req });

  if (!session || !session?.user.veterinariaId) {
    return res.status(400).json({ error: 'User not authenticated or missing veterinarian ID' });
  }

  try {
    const veterinaria = await prisma.veterinaria.findUnique({
      where: { id: session?.user.veterinariaId },
    });

    if (!veterinaria) {
      return res.status(404).json({ error: 'Veterinaria not found' });
    }

    return res.status(200).json(veterinaria);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
