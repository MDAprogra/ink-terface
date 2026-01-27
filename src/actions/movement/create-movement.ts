'use server';

import type { Movement } from '@/generated/prisma/client';
import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

type NewMovementParam = Pick<Movement, 'idStock' | 'idMovementType' | 'idUser'> & {
  quantity: number;
};

export async function createMovement(movement: NewMovementParam) {
  const _session = await requirePermission('movement', 'create');

  // 1. Validation basique des données
  if (!movement || !movement.quantity) {
    throw new Error('Données incorrectes : quantité manquante !');
  }
  const quantityNumber = Number(movement.quantity);
  if (quantityNumber <= 0) {
    throw new Error('La quantité doit être supérieure à 0.');
  }

  // 2. Récupération des infos nécessaires (Stock + Type de mouvement)
  const stockWithItem = await prisma.stock.findUnique({
    where: { id: movement.idStock },
  });

  const moveType = await prisma.movementType.findUnique({
    where: { id: movement.idMovementType },
  });

  // 3. Vérifications d'existence
  if (!stockWithItem) throw new Error('Impossible de trouver le stock associé.');
  if (!moveType) throw new Error('Type de mouvement invalide.');

  // 4. Logique Entrée / Sortie basée sur ton champ 'isEntry'
  const isEntry = moveType.isEntry; // true = Entrée (On ajoute), false = Sortie (On retire)

  // 5. Vérification du stock (Uniquement nécessaire si c'est une SORTIE)
  if (!isEntry) {
    // On convertit le Decimal en Number pour la comparaison
    const currentStock = stockWithItem.quantity.toNumber();

    if (currentStock < quantityNumber) {
      throw new Error(
        `Stock insuffisant pour cette sortie (Dispo: ${currentStock}, Demandé: ${quantityNumber})`,
      );
    }
  }

  try {
    // 6. Transaction atomique
    const [newMovement, updatedStock] = await prisma.$transaction([
      // A. Création de l'historique (Mouvement)
      prisma.movement.create({
        data: {
          idMovementType: movement.idMovementType,
          idStock: movement.idStock,
          idUser: movement.idUser,
          quantity: quantityNumber, // On enregistre toujours une valeur positive dans l'historique
        },
      }),

      // B. Mise à jour du stock réel
      prisma.stock.update({
        where: { id: movement.idStock },
        data: {
          quantity: {
            // Si c'est une entrée -> increment, sinon -> decrement
            [isEntry ? 'increment' : 'decrement']: quantityNumber,
          },
        },
      }),
    ]);

    return { success: true, movement: newMovement, stock: updatedStock };
  } catch (error) {
    console.error('Erreur Transaction createMovement :', error);
    // On retourne un objet simple pour que le front puisse afficher un toast d'erreur
    return { success: false, error: "Une erreur est survenue lors de l'enregistrement." };
  }
}
