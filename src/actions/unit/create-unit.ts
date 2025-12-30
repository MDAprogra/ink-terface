'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function createUnit(name: string, code: string) {
  if (!name || name.trim().length < 2) {
    throw new Error('Le nom doit contenir au moins 2 caractères.');
  }
  if (!code) {
    throw new Error('Une unité doit obligatoirement avoir un code.');
  }

  try {
    const newUnit = await prisma.unit.create({
      data: {
        name: name,
        code: code,
      },
    });

    return { success: true, data: newUnit };
  } catch (error) {
    console.error('Erreur creation unité:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Cette unité existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la création.');
  }
}
