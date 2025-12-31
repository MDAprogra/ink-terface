'use server';

import { prisma } from '@/lib/prisma';

export async function getMovement() {
  try {
    const movements = await prisma.movement.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        movementType: true,
        user: true,
        stock: {
          include: {
            item: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });
    const safeMovements = movements.map((movement) => ({
      ...movement,
      quantity: movement.quantity ? movement.quantity.toNumber() : null,
      stock: {
        ...movement.stock,
        quantity: movement.stock.quantity ? movement.stock.quantity.toNumber() : null,
        item: {
          ...movement.stock.item,
          securityStock: movement.stock.item.securityStock ? movement.stock.item.securityStock.toNumber() : null,
          purchasePrice: movement.stock.item.purchasePrice ? movement.stock.item.purchasePrice.toNumber() : null,
        },
      },
    }));
    return safeMovements;
  } catch (err) {
    console.log(err);
    return [];
  }
}
