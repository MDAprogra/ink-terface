import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ItemTypeComponent } from './Contents/ItemTypeComponent';
import { MovementTypeComponent } from './Contents/MovementTypeComponent';
import { SupplierComponent } from './Contents/SupplierComponent';
import { UnitComponent } from './Contents/UnitComponent';

export default function SettingsPage() {
  // Animation du CONTENU (Ta version avec slide-in depuis la gauche)
  const contentAnimation =
    'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-8 data-[state=active]:duration-500 data-[state=active]:ease-out';

  const triggerAnimation =
    'transition-all duration-300 ease-in-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:text-foreground/80 active:scale-95';

  return (
    <Tabs defaultValue="ItemType" className="w-full">
      <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-lg">
        <TabsTrigger value="ItemType" className={triggerAnimation}>
          Type de produit
        </TabsTrigger>
        <TabsTrigger value="MovementType" className={triggerAnimation}>
          Type de mouvement
        </TabsTrigger>
        <TabsTrigger value="Unit" className={triggerAnimation}>
          Unité
        </TabsTrigger>
        <TabsTrigger value="Supplier" className={triggerAnimation}>
          Fournisseur
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="ItemType" className={contentAnimation}>
          <ItemTypeComponent />
        </TabsContent>
        <TabsContent value="MovementType" className={contentAnimation}>
          <MovementTypeComponent />
        </TabsContent>
        <TabsContent value="Unit" className={contentAnimation}>
          <UnitComponent />
        </TabsContent>
        <TabsContent value="Supplier" className={contentAnimation}>
          <SupplierComponent />
        </TabsContent>
      </div>
    </Tabs>
  );
}
