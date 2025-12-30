'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function editSupplier(m_name: string, m_id: string) {
  if (!m_name && !m_id) {
    throw new Error("Récupération de l'enregistrement impossible : Veuillez réessayer !");
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const editedSupplier = await prisma.supplier.update({
      where: {
        id: m_id,
      },
      data: {
        name: m_name,
      },
    });

    return { success: true, data: editedSupplier };
  } catch (error) {
    console.error('Erreur modification fournisseur:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ce fournisseur existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la modification.');
  }
}
