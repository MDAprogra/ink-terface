'use server';

import { prisma } from '@/lib/prisma';

export async function getMovementType() {
  const movementType = await prisma.movementType.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { name: 'asc' },
  });
  return movementType;
}
