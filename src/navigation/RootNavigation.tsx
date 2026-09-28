import { useEffect, useMemo, useState, memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddEditExpenseScreen } from '@/screens/AddEditExpense';
import { AddEditPersonalExpenseScreen } from '@/screens/AddEditPersonalExpense';
import { OnboardingScreen } from '@/screens/Onboarding';
import { SplitDetailsScreen } from '@/screens/SplitDetails';
import { getPrimaryMemberId } from '@/services/database';
import { hasCompletedOnboarding } from '@/services/onboarding';
import { colors, useAppTheme } from '@/theme';
import { RootRouteParams } from '@/types/navigation.types';

import { BottomTabNavigation } from './BottomTabNavigation';
import { navigationRef } from './navigation.service';
import { RootRoutes } from './routes';

const Stack = createNativeStackNavigator<RootRouteParams>();

const RootNavigation = () => {
  const { isDark, colors: themeColors } = useAppTheme();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootRouteParams>(
    RootRoutes.MainTabs,
  );

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: themeColors.background,
        card: themeColors.surface,
        text: themeColors.textPrimary,
        border: themeColors.border,
        primary: themeColors.primary,
      },
    }),
    [isDark, themeColors],
  );

  useEffect(() => {
    let isMounted = true;

    async function checkInitialFlow() {
      try {
        const [completed, primaryMemberId] = await Promise.all([
          hasCompletedOnboarding(),
          getPrimaryMemberId(),
        ]);

        if (isMounted) {
          if (!completed || !primaryMemberId) {
            setInitialRoute(RootRoutes.Onboarding);
          } else {
            setInitialRoute(RootRoutes.MainTabs);
          }
        }
      } catch (err) {
        console.warn('[RootNavigation] Initial flow check error:', err);
        if (isMounted) {
          setInitialRoute(RootRoutes.Onboarding);
        }
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkInitialFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name={RootRoutes.Onboarding}
          component={OnboardingScreen}
        />
        <Stack.Screen
          name={RootRoutes.MainTabs}
          component={BottomTabNavigation}
        />
        <Stack.Screen
          name={RootRoutes.AddEditExpense}
          component={AddEditExpenseScreen}
        />
        <Stack.Screen
          name={RootRoutes.AddEditPersonalExpense}
          component={AddEditPersonalExpenseScreen}
        />
        <Stack.Screen
          name={RootRoutes.SplitDetails}
          component={SplitDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(RootNavigation);
