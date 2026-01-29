import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // 1. Points d'entrée
  entry: [
    'src/app/**/*.{ts,tsx}',
    'src/actions/**/*.ts',
    // J'ai retiré prisma/seed.ts car le "Hint" disait qu'il était redondant (déjà détecté)
  ],

  // 2. Projet
  project: ['src/**/*.{ts,tsx}'],

  // 3. Ignorer (C'est ici qu'on corrige le tir !)
  ignore: [
    'src/components/ui/**', // Shadcn
    'src/generated/**', // 👈 AJOUT CRUCIAL : On ignore totalement Prisma généré
  ],

  // 4. Dépendances à ignorer
  ignoreDependencies: [
    'tw-animate-css',
    'tailwindcss',
    '@faker-js/faker', // On l'ignore car utilisé seulement dans le seed (qui est hors src/app)
    'postcss', // On l'ignore pour éviter l'erreur "Unlisted"
    '@radix-ui/react-select',
    '@paralleldrive/cuid2',
    'baseline-browser-mapping',
  ],
};

export default config;
