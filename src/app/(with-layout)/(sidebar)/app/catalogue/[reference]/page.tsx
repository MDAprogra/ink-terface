import { useQuery } from '@tanstack/react-query';

import CatalogueDetailPage from '@/features/Catalogue/CatalogueDetailPage';

interface PageProps {
  params: Promise<{ reference: string }>;
}

export default async function CatalogueDetail({ params }: PageProps) {
  // 1. On attend que les paramètres soient prêts (Spécifique Next.js 15)
  const { reference } = await params;

  // 2. On passe la donnée via une prop
  return <CatalogueDetailPage reference={reference} />;
}
