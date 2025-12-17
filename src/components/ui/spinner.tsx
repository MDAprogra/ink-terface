import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  // biome-ignore lint/a11y/useSemanticElements: Spinner icon uses status role for accessibility
  return <Loader2Icon role="status" aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />;
}

export { Spinner };
