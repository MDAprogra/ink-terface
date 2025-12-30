'use server';

import { prisma } from '@/lib/prisma';

export async function getUnit() {
  const unit = await prisma.unit.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { name: 'asc' },
  });
  return unit;
}
