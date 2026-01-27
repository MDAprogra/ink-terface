'use server'; // 👈 Très important

import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function getItems() {
  const _session = await requirePermission('catalog', 'read');
  try {
    const items = await prisma.item.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: { name: 'asc' },
      include: {
        unit: true,
        supplier: true,
        stocks: true,
      },
    });

    const safeItems = items.map((item) => ({
      ...item,
      securityStock: item.securityStock ? item.securityStock.toNumber() : null,
      purchasePrice: item.purchasePrice ? item.purchasePrice.toNumber() : null,

      stocks: item.stocks.map((stock) => ({
        ...stock,
        quantity: stock.quantity?.toNumber() ?? 0,
      })),
    }));
    return safeItems;
  } catch (error) {
    console.log('Erreur (getItems) :', error);
    return [];
  }
}
