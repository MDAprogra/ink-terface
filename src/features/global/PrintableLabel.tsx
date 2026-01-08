'use client';

import { Eye, EyeOff, Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';

import { Button } from '@/components/ui/button';

interface PrintableLabelProps {
  reference: string;
  name: string;
}

export const PrintableLabel = ({ reference, name }: PrintableLabelProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Label-${reference}`,
  });

  // --- 1. LE DESIGN DE L'ÉTIQUETTE (Extrait pour être réutilisé) ---
  const LabelContent = () => (
    <div
      className="label-container"
      style={{
        width: '50mm',
        height: '20mm',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '1mm',
      }}
    >
      {/* Nom de l'article */}
      <span
        style={{
          fontSize: '10px',
          fontWeight: 'bold',
          marginBottom: '0px',
          whiteSpace: 'nowrap',
          maxWidth: '48mm',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.1',
        }}
      >
        {name}
      </span>

      {/* Code Barre */}
      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
        <Barcode
          value={reference}
          format="CODE128"
          width={1}
          height={30}
          displayValue={true}
          font="monospace"
          textAlign="center"
          textPosition="bottom"
          fontSize={10}
          background="#ffffff"
          lineColor="#000000"
          margin={0}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        {/* Bouton pour déclencher l'impression */}
        <Button onClick={() => handlePrint?.()} variant="outline" size="sm" className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>

        {/* Bouton Toggle Aperçu */}
        <Button onClick={() => setShowPreview(!showPreview)} variant="ghost" size="sm" className="gap-2 text-gray-500">
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Masquer' : 'Aperçu'}
        </Button>
      </div>

      {/* --- 2. APERÇU ÉCRAN (Visible si activé) --- */}
      {showPreview && (
        <div className="border border-gray-300 bg-gray-100 p-4 rounded-md mt-2">
          <p className="text-xs text-gray-500 mb-2">Aperçu (Cadre noir = Limites étiquette)</p>
          {/* On ajoute une bordure noire ici pour visualiser la découpe de l'étiquette */}
          <div style={{ border: '1px solid black', width: 'fit-content' }}>
            <LabelContent />
          </div>
        </div>
      )}

      {/* --- 3. ZONE D'IMPRESSION RÉELLE (Toujours cachée à l'écran) --- */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <style type="text/css" media="print">
            {`
                            @page {
                                size: 50mm 20mm;
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            /* Force l'impression en noir et blanc pur si besoin */
                            .label-container {
                                -webkit-print-color-adjust: exact;
                            }
                        `}
          </style>
          <LabelContent />
        </div>
      </div>
    </div>
  );
};
