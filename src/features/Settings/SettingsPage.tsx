import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ItemTypeComponent } from './Contents/ItemTypeComponent';

export default function SettingsPage() {
  // const contentAnimation =
  //   'data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-500';
  const contentAnimation =
    'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-8 data-[state=active]:duration-500 data-[state=active]:ease-out';
  return (
    <Tabs defaultValue="ItemType" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="ItemType">Type de produit</TabsTrigger>
        <TabsTrigger value="MovementType">Type de mouvement</TabsTrigger>
        <TabsTrigger value="Unit">Unité</TabsTrigger>
        <TabsTrigger value="Supplier">Fournisseur</TabsTrigger>
      </TabsList>
      <TabsContent value="ItemType" className={contentAnimation}>
        <ItemTypeComponent />
      </TabsContent>
      <TabsContent value="MovementType" className={contentAnimation}>
        Change your password here.
      </TabsContent>
      <TabsContent value="Unit" className={contentAnimation}>
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="Supplier" className={contentAnimation}>
        Change your password here.
      </TabsContent>
    </Tabs>
  );
}
