'use client';

import { usePermission } from '@/hooks/use-permission';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode; // Ce qu'on affiche si pas autorisé (ex: rien, ou un cadenas)
}

export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { can } = usePermission();

  if (can(resource, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
