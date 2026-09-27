/**
 * Navigation — Route Names
 * Single source of truth for all route identifiers.
 * Used for type-safe navigation and deep linking.
 */

// Bottom tab routes
export const BottomTabRoutes = {
  Dashboard: 'Dashboard',
  Analytics: 'Analytics',
  Members: 'Members',
} as const;

// Root stack routes
export const RootRoutes = {
  MainTabs: 'MainTabs',
  Home: 'Home',
  AddEditExpense: 'AddEditExpense',
  SplitDetails: 'SplitDetails',
} as const;

// All routes flattened for type generation
export const AllRoutes = {
  ...BottomTabRoutes,
  ...RootRoutes,
} as const;
