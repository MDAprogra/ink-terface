'use client';

import { Eye, EyeOff, Minus, Plus, Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';

import { Button } from '@/components/ui/button';

const SingleLabel = ({ reference, name }: { reference: string; name: string }) => (
  <div
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
      pageBreakAfter: 'always',
    }}
  >
    <div
      style={{
        fontSize: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.1',
        marginBottom: '2px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {name}
    </div>

    <Barcode
      value={reference}
      format="CODE128"
      width={1.2}
      height={25}
      displayValue={true}
      font="monospace"
      textAlign="center"
      textPosition="bottom"
      fontSize={9}
      background="transparent"
      margin={0}
    />
  </div>
);

interface PrintableLabelProps {
  reference: string;
  name: string;
}

export const PrintableLabel = ({ reference, name }: PrintableLabelProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copies, setCopies] = useState(1);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Label-${reference}`,
  });

  return (
    <div className="flex flex-col items-start gap-3 p-4 border rounded-md bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setCopies(Math.max(1, copies - 1))}
            disabled={copies <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="w-8 text-center text-sm font-medium">{copies}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setCopies(copies + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button onClick={() => handlePrint?.()} size="sm" className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer {copies > 1 && `(${copies})`}
        </Button>

        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {showPreview && (
        <div className="border border-dashed border-gray-300 bg-gray-50 p-4 rounded-md mt-2 flex justify-center">
          <div className="shadow-lg bordéer border-black bg-white">
            <SingleLabel reference={reference} name={name} />
          </div>
        </div>
      )}
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
                }
            `}
          </style>

          {Array.from({ length: copies }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Les copies d'impression sont statiques
            <SingleLabel key={i} reference={reference} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};
