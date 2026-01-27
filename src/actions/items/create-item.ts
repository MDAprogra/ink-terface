'use server';

import { revalidatePath } from 'next/cache'; // ⚠️ Important pour rafraîchir la liste

import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

interface newItemProps {
  name: string;
  reference: string;
  description?: string;
  color?: string;
  securityStock?: number;
  shelfLife?: number;
  purchasePrice?: number;
  typeItem: string; // ID du type
  unit: string; // ID de l'unité
  supplier: string; // ID du fournisseur
}

export async function createItem(n_item: newItemProps) {
  const _session = await requirePermission('catalog', 'create');
  try {
    // 1. On crée l'item directement (pas besoin de transaction)
    const newItem = await prisma.item.create({
      data: {
        name: n_item.name,
        reference: n_item.reference,
        description: n_item.description, // Si undefined, Prisma mettra null ou ignorera selon le schéma
        color: n_item.color,
        securityStock: n_item.securityStock,
        shelfLife: n_item.shelfLife,
        purchasePrice: n_item.purchasePrice,
        // Relations (Foreign Keys)
        idTypeItem: n_item.typeItem,
        idUnit: n_item.unit,
        idSupplier: n_item.supplier,
      },
    });

    // 2. On rafraîchit le cache de la page catalogue pour voir le nouvel item immédiatement
    // Remplace '/app/catalogue' par le vrai chemin de ta page liste
    revalidatePath('/app/catalogue');

    // 3. On retourne l'objet avec le bon nom de clé
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Erreur createItem :', error);
    return { success: false, error: "Une erreur est survenue lors de l'enregistrement." };
  }
}
