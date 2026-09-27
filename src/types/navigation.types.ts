import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabRoutes, RootRoutes } from '@/navigation/routes';

export type BottomTabRouteParams = {
  [BottomTabRoutes.Home]: undefined;
};

export type RootRouteParams = {
  [RootRoutes.MainTabs]: NavigatorScreenParams<BottomTabRouteParams> | undefined;
  [RootRoutes.Home]: undefined;
};

export type BottomTabRouteName = keyof BottomTabRouteParams;
export type RootRouteName = keyof RootRouteParams;
