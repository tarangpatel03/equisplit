import { ComponentType } from 'react';

export type OnboardingSlide = {
  id: string;
  badge: string;
  title: string;
  description: string;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  gradientColors: [string, string];
};
