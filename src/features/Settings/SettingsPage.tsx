import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ItemTypeComponent } from './Contents/ItemTypeComponent';

export default function SettingsPage() {
  return (
    <Tabs defaultValue="ItemType" className="w-100">
      <TabsList>
        <TabsTrigger value="ItemType">Type de produit</TabsTrigger>
        <TabsTrigger value="MovementType">Type de mouvement</TabsTrigger>
        <TabsTrigger value="Unit">Unité</TabsTrigger>
        <TabsTrigger value="Supplier">Fournisseur</TabsTrigger>
      </TabsList>
      <TabsContent value="ItemType">
        <ItemTypeComponent />
      </TabsContent>
      <TabsContent value="MovementType">Change your password here.</TabsContent>
      <TabsContent value="Unit">Make changes to your account here.</TabsContent>
      <TabsContent value="Supplier">Change your password here.</TabsContent>
    </Tabs>
  );
}
