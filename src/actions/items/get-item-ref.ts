'use server';

import { prisma } from '@/lib/prisma';

export async function getItemRef(reference: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { reference },
      include: {
        unit: true,
        supplier: true,
        stocks: true, // ⚠️ Attention ici
        type: true,
      },
    });

    if (!item) return null;

    // On transforme l'objet UNIQUE (pas de map sur item)
    const safeItem = {
      ...item,
      securityStock: item.securityStock?.toNumber() ?? null,
      purchasePrice: item.purchasePrice?.toNumber() ?? null,

      // 👇 IL FAUT AUSSI NETTOYER LES STOCKS INCLUS !
      stocks: item.stocks.map((stock) => ({
        ...stock,
        quantity: stock.quantity?.toNumber() ?? 0,
      })),
    };

    return safeItem;
  } catch (error) {
    console.log('Erreur (getItemRef) :', error);
    return null; // On retourne null (pas un tableau vide) car on attend un seul objet
  }
}
