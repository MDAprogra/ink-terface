'use client';

import Barcode from 'react-barcode';

interface ItemBarcodeProps {
  value: string;
}

export const ItemBarcode = ({ value }: ItemBarcodeProps) => {
  if (!value) return null;

  return (
    <div className="flex flex-col items-center border p-2 rounded-md bg-white w-fit">
      <Barcode
        value={value}
        format="CODE128" // Format standard (lettres + chiffres)
        width={1.5} // Largeur des barres (défaut 2, 1.5 est plus compact)
        height={50} // Hauteur du code barre
        displayValue={true} // Affiche le texte en dessous
        font="monospace"
        textAlign="center"
        textPosition="bottom"
        fontSize={14}
        background="#ffffff"
        lineColor="#000000"
        margin={0}
      />
    </div>
  );
};
