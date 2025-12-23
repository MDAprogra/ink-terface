'use client';

import FuzzyText from '@/components/FuzzyText';

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <FuzzyText color="#000" baseIntensity={0.38} hoverIntensity={2} enableHover={true}>
        404
      </FuzzyText>
    </div>
  );
}
