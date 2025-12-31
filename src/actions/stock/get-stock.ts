'use server';

import { prisma } from '@/lib/prisma';

export async function getStock() {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        item: {
          include: {
            type: true,
            unit: true,
            supplier: true,
          },
        },
      },
    });

    const safeStocks = stocks.map((stock) => ({
      ...stock,
      quantity: stock.quantity ? stock.quantity.toNumber() : null,

      item: {
        ...stock.item,
        securityStock: stock.item.securityStock ? stock.item.securityStock.toNumber() : null,
        purchasePrice: stock.item.purchasePrice ? stock.item.purchasePrice.toNumber() : null,
      },
    }));
    return safeStocks;
  } catch (error) {
    console.log(error);
    return [];
  }
}
