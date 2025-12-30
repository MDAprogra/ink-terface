'use server';

import { prisma } from '@/lib/prisma';

export async function getMovementItem() {
  const movementType = await prisma.movementType.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { name: 'asc' },
  });
  return movementType;
}
