'use server';

import { headers } from 'next/headers';

import { ORG_ROLES, type OrgRole } from '@/auth/roles';
import { Prisma } from '@/generated/prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function deleteItem(m_id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: 'Non connecté' };
  }

  const userRole = session.user.role as OrgRole;
  const roleConfig = ORG_ROLES[userRole];

  if (!roleConfig) {
    return { error: '⛔ Rôle inconnu ou invalide.' };
  }

  const check = (roleConfig as any).authorize({
    catalog: ['soft-delete'],
  });

  if (!check.success) {
    throw new Error(`Vous n'avez pas le droit de supprimer un article !`);
  }

  if (!m_id) {
    throw new Error("Récupération de l'identifiant impossible : Veuillez réessayer !");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const stockAggregation = await tx.stock.aggregate({
        where: {
          idItem: m_id,
        },
        _sum: {
          quantity: true,
        },
      });

      const totalStock = stockAggregation._sum.quantity?.toNumber() ?? 0;

      if (totalStock > 0) {
        throw new Error(`Impossible de supprimer cet article : Il reste ${totalStock} unité(s) en stock.`);
      }

      const deletedItem = await tx.item.update({
        where: {
          id: m_id,
        },
        data: {
          isDeleted: true,
        },
      });

      return deletedItem;
    });

    return { success: true, data: result };
  } catch (error) {
    //console.error('Erreur suppression article:', error);

    if (error instanceof Error && error.message.includes('Impossible de supprimer')) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        throw new Error("Cet article n'existe pas.");
      }
    }

    throw new Error('Une erreur est survenue lors de la suppression.');
  }
}
