'use server';

import { prisma } from '@/lib/prisma';

export async function getTypeItem() {
  const typeItem = await prisma.itemType.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { name: 'asc' },
  });
  return typeItem;
}
