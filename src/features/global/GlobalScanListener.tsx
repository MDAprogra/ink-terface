'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { checkStockExists } from '@/actions/stock/check-stock-exists';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';

import { MVT_AddSheet } from '../Movement/Components/AddMovement';

export const GlobalScanListener = () => {
  const [scannedId, setScannedId] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // Fonction appelée quand le scan est détecté par le Hook
  const handleScan = async (code: string) => {
    // On lance la vérification serveur avec un feedback visuel
    toast.promise(checkStockExists(code), {
      loading: 'Vérification du code...',
      success: (exists) => {
        if (exists) {
          // ✅ Ça existe : On ouvre la modale
          setScannedId(code);
          setIsOpen(true);
          return `Article identifié !`;
        } else {
          // ❌ Ça n'existe pas : On reste fermé et on prévient
          return `Aucun article trouvé pour le code : ${code}`;
          // Note: Si tu veux que le toast soit rouge en cas d'échec logique (pas erreur technique),
          // tu peux lever une erreur ici : throw new Error(...)
        }
      },
      error: 'Erreur lors de la lecture du code',
    });
  };

  // On active l'écoute (Ton hook reste inchangé, il fait juste son job de capture)
  useBarcodeScanner({ onScan: handleScan });

  return <MVT_AddSheet pIdItem={scannedId} isOpen={isOpen} onOpenChange={setIsOpen} />;
};
