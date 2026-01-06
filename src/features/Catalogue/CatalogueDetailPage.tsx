'use client';

import { useQuery } from '@tanstack/react-query';

import { getItemRef } from '@/actions/items/get-item-ref';

interface CatalogueDetailProps {
  reference: string;
}

export default function CatalogueDetailPage({ reference }: CatalogueDetailProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['items', reference],
    queryFn: () => getItemRef(reference),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!data) return <div>Article introuvable</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <i>Ref: {reference}</i>
    </div>
  );
}
