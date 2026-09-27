import {
  Baby,
  Banknote,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Cake,
  Camera,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Hotel,
  LucideIcon,
  MoreHorizontal,
  Music,
  PawPrint,
  Phone,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Ticket,
  Tv,
  Utensils,
  Wallet,
  Wifi,
  Wine,
  Wrench,
  Zap,
} from 'lucide-react-native';

import { assets } from '@/assets';
import { ExpenseCategory } from '@/types';

export const OTHERS_CATEGORY_ID = 'others';
export const DEFAULT_CATEGORY_ID = 'others';

/** Available Lucide line icon keys for categories. */
export const CATEGORY_ICON_KEYS = [
  // Essentials & Dining
  'food',
  'coffee',
  'pizza',
  'beer',
  'wine',
  'cake',
  'groceries',
  'shopping',
  'clothing',
  // Home, Living & Tech
  'housing',
  'utilities',
  'wifi',
  'phone',
  'tv',
  'maintenance',
  // Finance & Work
  'wallet',
  'creditCard',
  'cash',
  'bill',
  'savings',
  'work',
  // Transportation & Travel
  'transport',
  'fuel',
  'bus',
  'bike',
  'flight',
  'hotel',
  // Entertainment & Hobbies
  'entertainment',
  'gaming',
  'music',
  'ticket',
  'camera',
  // Health, Family & Education
  'fitness',
  'medical',
  'pharmacy',
  'beauty',
  'pets',
  'baby',
  'education',
  'books',
  // Misc
  'gift',
  'other',
] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number];

export const CATEGORY_ICONS: Record<CategoryIconKey, LucideIcon> = {
  food: Utensils,
  coffee: Coffee,
  pizza: Pizza,
  beer: Beer,
  wine: Wine,
  cake: Cake,
  groceries: ShoppingCart,
  shopping: ShoppingBag,
  clothing: Shirt,
  housing: Home,
  utilities: Zap,
  wifi: Wifi,
  phone: Phone,
  tv: Tv,
  maintenance: Wrench,
  wallet: Wallet,
  creditCard: CreditCard,
  cash: Banknote,
  bill: Receipt,
  savings: PiggyBank,
  work: Briefcase,
  transport: Car,
  fuel: Fuel,
  bus: Bus,
  bike: Bike,
  flight: Plane,
  hotel: Hotel,
  entertainment: Film,
  gaming: Gamepad2,
  music: Music,
  ticket: Ticket,
  camera: Camera,
  fitness: Dumbbell,
  medical: HeartPulse,
  pharmacy: Pill,
  beauty: Sparkles,
  pets: PawPrint,
  baby: Baby,
  education: GraduationCap,
  books: BookOpen,
  gift: Gift,
  other: MoreHorizontal,
};

/** Curated color palette available for categories. Multiple categories can share the same color. */
export const CATEGORY_PALETTE = [
  // Reds & Corals
  '#FF7675', // Warm Coral
  '#EE5253', // Crimson Red
  '#FF4757', // Watermelon Pink
  // Oranges & Ambers
  '#FF9F43', // Vibrant Tangerine
  '#E17055', // Terracotta
  '#FDCB6E', // Mustard Yellow
  '#F1C40F', // Sun Yellow
  // Greens & Teals
  '#2ED573', // Emerald Green
  '#1DD1A1', // Mint Green
  '#1CC29F', // Splitwise Teal
  '#00CEC9', // Cyan
  '#01CBC6', // Turquoise
  // Blues & Cyans
  '#48DBFB', // Electric Cyan
  '#0984E3', // Sky Blue
  '#2E86DE', // Ocean Blue
  '#54A0FF', // Bright Blue
  // Purples & Violets
  '#A29BFE', // Periwinkle
  '#6C5CE7', // Lilac Purple
  '#8E44AD', // Royal Violet
  '#5F27CD', // Iris Purple
  // Pinks & Magentas
  '#FD79A8', // Soft Pink
  '#E84393', // Vibrant Magenta
  '#FF9FF3', // Pastel Bubblegum
  // Neutrals & Earth
  '#8D6E63', // Coffee Bronze
  '#8395A7', // Slate Blue-Gray
  '#94A3B8', // Slate Gray
] as const;

/** Permanent and pre-seeded default categories. */
export const INITIAL_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'others',
    name: 'Other Expenses',
    iconKey: 'other',
    color: '#94A3B8',
    isDefault: true,
  },
  {
    id: 'food',
    name: 'Food & Dining',
    iconKey: 'food',
    color: '#FF7675',
    isDefault: true,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    iconKey: 'groceries',
    color: '#1CC29F',
    isDefault: true,
  },
  {
    id: 'transport',
    name: 'Transportation',
    iconKey: 'transport',
    color: '#0984E3',
    isDefault: true,
  },
  {
    id: 'housing',
    name: 'Housing',
    iconKey: 'housing',
    color: '#00CEC9',
    isDefault: true,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    iconKey: 'entertainment',
    color: '#6C5CE7',
    isDefault: true,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    iconKey: 'shopping',
    color: '#FD79A8',
    isDefault: true,
  },
  {
    id: 'utilities',
    name: 'Utilities',
    iconKey: 'utilities',
    color: '#FDCB6E',
    isDefault: true,
  },
];

export const EXPENSE_CATEGORIES = INITIAL_CATEGORIES;

/** Returns the Lucide icon component for an iconKey with fallback to 'other'. */
export function getCategoryLucideIcon(iconKey?: string): LucideIcon {
  if (iconKey && iconKey in CATEGORY_ICONS) {
    return CATEGORY_ICONS[iconKey as CategoryIconKey];
  }
  return MoreHorizontal;
}

/** Legacy helper returning either the Lucide icon component or fallback asset. */
export function getCategoryIconSource(iconKey?: string): any {
  if (iconKey && iconKey in CATEGORY_ICONS) {
    return CATEGORY_ICONS[iconKey as CategoryIconKey];
  }
  return assets.icons.ic_cat_other;
}

/**
 * Returns the matching category by ID from the active list (or default initial list),
 * falling back to the permanent 'others' category if not found or if 'general' was saved.
 */
export function getCategoryById(
  id?: string,
  categories: ExpenseCategory[] = INITIAL_CATEGORIES,
): ExpenseCategory {
  const fallback = categories.find(c => c.id === OTHERS_CATEGORY_ID) ?? INITIAL_CATEGORIES[0];
  if (!id || id === 'general') return fallback;
  return categories.find(c => c.id === id) ?? fallback;
}

/**
 * Converts a hex color into an rgba string with low opacity for soft rounded rectangular backgrounds.
 */
export function getCategoryBgColor(color?: string, opacity = 0.15): string {
  if (!color) return `rgba(148, 163, 184, ${opacity})`;
  const clean = color.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

