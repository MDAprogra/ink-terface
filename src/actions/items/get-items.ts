'use server'; // 👈 Très important

import { toast } from 'sonner';

import { prisma } from '@/lib/prisma';

export async function getItems() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { name: 'asc' },
      include: {
        unit: true,
        supplier: true,
      },
    });

    const safeItems = items.map((item) => ({
      ...item,
      securityStock: item.securityStock ? item.securityStock.toNumber() : null,
      purchasePrice: item.purchasePrice ? item.purchasePrice.toNumber() : null,
    }));
    return safeItems;
  } catch (error) {
    toast.error(`Erreur (getItems) : ${(error as Error).message}`);
  }
}
