import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';

import { colors } from '@/theme';
import { RootRouteParams } from '@/types/navigation.types';

import { BottomTabNavigation } from './BottomTabNavigation';
import { navigationRef } from './navigation.service';
import { RootRoutes } from './routes';

const Stack = createNativeStackNavigator<RootRouteParams>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

const RootNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={RootRoutes.MainTabs}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name={RootRoutes.MainTabs} component={BottomTabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(RootNavigation);
