import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabRoutes, RootRoutes } from '@/navigation/routes';

// ---------------------------------------------------------------------------
// Bottom tab params
// ---------------------------------------------------------------------------

export type BottomTabRouteParams = {
  [BottomTabRoutes.Dashboard]: undefined;
  [BottomTabRoutes.Analytics]: undefined;
  [BottomTabRoutes.Members]: undefined;
};

// ---------------------------------------------------------------------------
// Root stack params
// ---------------------------------------------------------------------------

export type RootRouteParams = {
  [RootRoutes.MainTabs]:
    | NavigatorScreenParams<BottomTabRouteParams>
    | undefined;
  [RootRoutes.Home]: undefined;
  [RootRoutes.AddEditExpense]: { expenseId?: string } | undefined;
  [RootRoutes.SplitDetails]: { expenseId: string };
};

// ---------------------------------------------------------------------------
// Type helpers for navigation props
// ---------------------------------------------------------------------------

export type BottomTabRouteName = keyof BottomTabRouteParams;
export type RootRouteName = keyof RootRouteParams;
