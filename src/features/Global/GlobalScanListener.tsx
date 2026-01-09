'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { checkStockExists } from '@/actions/stock/check-stock-exists';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';

import { MVT_AddSheet } from '../Movement/Components/AddMovement';

export const GlobalScanListener = () => {
  const [scannedReference, setScannedReference] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // Fonction appelée quand le scan est détecté par le Hook
  const handleScan = async (code: string) => {
    console.log(code);
    // On lance la vérification serveur avec un feedback visuel
    toast.promise(checkStockExists(code), {
      loading: 'Vérification du code...',
      success: (exists) => {
        if (exists) {
          console.log(code);
          // ✅ Ça existe : On ouvre la modale
          setScannedReference(code);
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

  console.log(scannedReference);
  return <MVT_AddSheet pIdItem={scannedReference} isOpen={isOpen} onOpenChange={setIsOpen} />;
};
