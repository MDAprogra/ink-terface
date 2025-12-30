'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function editUnit(m_name: string, m_id: string, m_code: string) {
  console.log(m_name, m_id, m_code);
  if (!m_name && !m_id && !m_code) {
    throw new Error("Récupération de l'enregistrement impossible : Veuillez réessayer !");
  }

  try {
    const editedUnit = await prisma.unit.update({
      where: {
        id: m_id,
      },
      data: {
        name: m_name,
        code: m_code,
      },
    });

    return { success: true, data: editedUnit };
  } catch (error) {
    console.error('Erreur modification unité:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Cette unité existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la modification.');
  }
}
