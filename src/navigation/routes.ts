/**
 * Navigation — Route Names
 * Single source of truth for all route identifiers.
 */

// Bottom tab routes
export const BottomTabRoutes = {
  Home: 'Home',
} as const;

// Root stack routes
export const RootRoutes = {
  MainTabs: 'MainTabs',
  Home: 'Home',
} as const;

// All routes flattened for type generation
export const AllRoutes = {
  ...BottomTabRoutes,
  ...RootRoutes,
} as const;
