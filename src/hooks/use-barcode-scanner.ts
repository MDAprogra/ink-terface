import { useEffect, useRef } from 'react';

interface UseBarcodeScannerProps {
  onScan: (code: string) => void;
}

export const useBarcodeScanner = ({ onScan }: UseBarcodeScannerProps) => {
  // On utilise une ref pour ne pas déclencher de rendu à chaque touche
  const buffer = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      //console.log(`Touche reçue : "${e.key}"`);
      // 1. Détection de la fin du scan (Touche Entrée)
      if (e.key === 'Enter') {
        const currentBuffer = buffer.current;

        // 🔒 SÉCURITÉ : On ne valide que si ça commence par ton préfixe '~'
        if (currentBuffer.startsWith('~') || currentBuffer.startsWith('é')) {
          // On empêche le comportement par défaut (ex: valider un formulaire si on est dans un input)
          e.preventDefault();
          e.stopPropagation();

          // On retire le '~' pour récupérer le vrai code (UUID ou EAN)
          const cleanCode = currentBuffer.slice(1).trim();

          if (cleanCode.length > 0) {
            console.log('🔫 Scan validé :', cleanCode);
            onScan(cleanCode);
          }
        }

        // Quoi qu'il arrive, on vide le buffer après "Entrée"
        buffer.current = '';
        return;
      }

      // 2. Enregistrement des touches
      // On ignore les touches spéciales (Shift, Ctrl, Alt...) qui ont des noms longs
      if (e.key.length === 1) {
        buffer.current += e.key;

        // Timeout de sécurité : si pas de nouvelle touche après 100ms, on reset.
        // (Un humain tape lentement, le scanner tape en < 20ms)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          buffer.current = '';
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan]);
};
