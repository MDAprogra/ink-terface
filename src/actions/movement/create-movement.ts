'use server';

import type { Movement } from '@/generated/prisma/client';
import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

// 👇 Ajout de 'idItem' (ou itemId selon ton schéma) pour pouvoir créer le stock si besoin
type NewMovementParam = Pick<Movement, 'idMovementType' | 'idUser'> & {
  idStock?: string; // Devient optionnel car peut ne pas exister
  idItem: string; // Obligatoire pour créer le stock si inexistant
  quantity: number;
};

export async function createMovement(movement: NewMovementParam) {
  const _session = await requirePermission('movement', 'create');

  // 1. Validation basique
  if (!movement || !movement.quantity) {
    throw new Error('Données incorrectes : quantité manquante !');
  }
  const quantityNumber = Number(movement.quantity);
  if (quantityNumber <= 0) {
    throw new Error('La quantité doit être supérieure à 0.');
  }

  // 2. Récupération du type de mouvement (Entry / Exit ?)
  const moveType = await prisma.movementType.findUnique({
    where: { id: movement.idMovementType },
  });
  if (!moveType) throw new Error('Type de mouvement invalide.');

  const isEntry = moveType.isEntry;

  // 3. GESTION INTELLIGENTE DU STOCK
  // On essaie de trouver le stock, soit par son ID, soit via l'Article
  let stockId = movement.idStock;
  let currentStockQuantity = 0;

  // A. Recherche du stock existant
  let stockRecord = null;

  if (stockId) {
    stockRecord = await prisma.stock.findUnique({ where: { id: stockId } });
  }

  // Si pas trouvé via l'ID (ou pas d'ID fourni), on cherche via l'Item
  if (!stockRecord) {
    stockRecord = await prisma.stock.findFirst({
      where: { idItem: movement.idItem }, // ⚠️ Vérifie que ton champ s'appelle bien 'itemId' dans ton schema prisma
    });
  }

  // B. Logique : Création ou Erreur
  if (stockRecord) {
    // Le stock existe, on récupère ses infos
    stockId = stockRecord.id;
    currentStockQuantity = stockRecord.quantity.toNumber();
  } else {
    // Le stock N'EXISTE PAS
    if (isEntry) {
      // ✅ C'est une entrée : On CRÉE la ligne de stock à 0
      const newStock = await prisma.stock.create({
        data: {
          idItem: movement.idItem, // Liaison avec l'article
          quantity: 0, // On part de 0, la transaction ajoutera la qté après
          // Ajoute ici d'autres champs obligatoires si besoin (ex: locationId, minStock...)
        },
      });
      stockId = newStock.id;
      currentStockQuantity = 0;
    } else {
      // ❌ C'est une sortie : Impossible de sortir un truc qui n'existe pas
      throw new Error('Impossible de faire une sortie : aucun stock existant pour cet article.');
    }
  }

  // 4. Vérification du stock (Pour les SORTIES)
  if (!isEntry) {
    if (currentStockQuantity < quantityNumber) {
      throw new Error(
        `Stock insuffisant pour cette sortie (Dispo: ${currentStockQuantity}, Demandé: ${quantityNumber})`,
      );
    }
  }

  if (!stockId) {
    throw new Error("Impossible de déterminer l'ID du stock.");
  }

  try {
    // 5. Transaction atomique
    // stockId est maintenant garanti d'exister (créé ou trouvé)
    const [newMovement, updatedStock] = await prisma.$transaction([
      // A. Création de l'historique
      prisma.movement.create({
        data: {
          idMovementType: movement.idMovementType,
          idStock: stockId,
          idUser: movement.idUser,
          quantity: quantityNumber,
        },
      }),

      // B. Mise à jour du stock réel
      prisma.stock.update({
        where: { id: stockId },
        data: {
          quantity: {
            [isEntry ? 'increment' : 'decrement']: quantityNumber,
          },
        },
      }),
    ]);

    return { success: true, movement: newMovement, stock: updatedStock };
  } catch (error) {
    console.error('Erreur Transaction createMovement :', error);
    return { success: false, error: "Une erreur est survenue lors de l'enregistrement." };
  }
}
