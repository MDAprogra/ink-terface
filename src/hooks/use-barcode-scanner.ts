'use client';

import { useEffect, useRef } from 'react';

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
  minChars?: number;
}

export const useBarcodeScanner = ({ onScan, minChars = 3 }: UseBarcodeScannerProps) => {
  const buffer = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Si touche ENTREE : on valide le scan
      if (e.key === 'Enter') {
        const currentBuffer = buffer.current;

        console.log(currentBuffer);

        // Si le buffer n'est pas vide (évite les déclenchements fantômes)
        if (currentBuffer.length >= minChars) {
          // Logique spécifique : on retire le préfixe si présent (~ ou é)
          // Adapte ceci selon la config de ta douchette
          let cleanCode = currentBuffer;

          console.log(cleanCode);
          if (cleanCode.startsWith('~') || cleanCode.startsWith('é')) {
            cleanCode = cleanCode.slice(1);
          }
          console.log(cleanCode);

          cleanCode = cleanCode.trim();

          if (cleanCode.length > 0) {
            console.log('✅ Scan détecté :', cleanCode);
            e.preventDefault(); // Empêche le submit d'un formulaire si présent
            e.stopPropagation();
            onScan(cleanCode);
          }
        }

        // Reset du buffer après Entrée
        buffer.current = '';
        return;
      }

      // 2. On enregistre les touches (caractères imprimables seulement)
      if (e.key.length === 1) {
        buffer.current += e.key;

        // 3. Timeout de sécurité (Reset si l'utilisateur met trop de temps)
        // Une douchette tape très vite (< 50ms entre chaque touche)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          buffer.current = '';
        }, 100); // 100ms max entre deux touches
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan, minChars]);
};
