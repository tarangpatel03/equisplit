import { FC, memo } from 'react';

import { CategoryIconKey, getCategoryLucideIcon } from '@/config';
import { colors } from '@/theme/colors';

export type CategoryIconProps = {
  iconKey?: CategoryIconKey | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const CategoryIcon: FC<CategoryIconProps> = memo(
  ({ iconKey, size = 20, color = colors.neutral, strokeWidth = 2 }) => {
    const IconComponent = getCategoryLucideIcon(iconKey);
    if (!IconComponent) return null;
    return (
      <IconComponent size={size} color={color} strokeWidth={strokeWidth} />
    );
  },
);

export const AppCategoryIcon = CategoryIcon;
