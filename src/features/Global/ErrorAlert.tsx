import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ErrorAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Oups... Une erreur est survenue</AlertTitle>
      <AlertDescription>
        <p>Si le problème persiste :</p>
        <ul className="list-inside list-disc text-sm">
          <li>Verifier votre connexion internet</li>
          <li>Contacter l'administrateur du site</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
