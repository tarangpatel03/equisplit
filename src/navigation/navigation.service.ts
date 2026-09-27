import { createNavigationContainerRef } from '@react-navigation/native';

import { RootRouteParams } from '@/types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const navigationRef = createNavigationContainerRef<RootRouteParams>();

export type NavType = NativeStackNavigationProp<RootRouteParams>;

export function navigate(name: keyof RootRouteParams, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function getCurrentRouteName() {
  return navigationRef.getCurrentRoute()?.name;
}

export function canGoBack(): boolean {
  return navigationRef.isReady() && navigationRef.canGoBack();
}

export function navigateBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
