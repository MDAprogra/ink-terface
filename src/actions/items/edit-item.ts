'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

interface valueParams {
  e_id: string;
  e_name: string;
  e_description: string;
  e_color: string;
  e_securityStock: number;
  e_shelfLife: number;
  e_idSupplier: string;
  e_idUnit: string;
  e_idTypeItem: string;
  e_reference: string;
}

export async function editItem(value: valueParams) {
  if (!value.e_id) {
    throw new Error("L'id transmit est incorrect");
  }

  try {
    const editedMovement = await prisma.item.update({
      where: {
        id: value.e_id,
      },
      data: {
        name: value.e_name,
        description: value.e_description,
        color: value.e_color,
        securityStock: value.e_securityStock,
        shelfLife: value.e_shelfLife,
        idSupplier: value.e_idSupplier,
        idUnit: value.e_idUnit,
        idTypeItem: value.e_idTypeItem,
        reference: value.e_reference,
      },
    });
    return { success: true, data: editedMovement };
  } catch (error) {
    console.error('Erreur modification article:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        throw new Error("L'enregistrement recherché n'existe pas");
      }
    }
    throw new Error('Une erreur est survenue lors de la modification.');
  }
}
