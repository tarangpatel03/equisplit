import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { assets } from '@/assets';
import { HomeScreen } from '@/screens/Home';
import { MembersScreen } from '@/screens/Members';
import { colors } from '@/theme';
import { BottomTabRouteParams } from '@/types/navigation.types';

import { BottomTabRoutes } from './routes';

const Tab = createBottomTabNavigator<BottomTabRouteParams>();

const DashboardIcon = ({ focused }: { focused: boolean }) => (
  <Image
    source={focused ? assets.icons.ic_home_filled : assets.icons.ic_home}
    style={[
      styles.tabIcon,
      { tintColor: focused ? colors.primary : colors.textSecondary },
    ]}
    resizeMode="contain"
  />
);

const MembersIcon = ({ focused }: { focused: boolean }) => (
  <Image
    source={focused ? assets.icons.ic_members_filled : assets.icons.ic_members}
    style={[
      styles.tabIcon,
      { tintColor: focused ? colors.primary : colors.textSecondary },
    ]}
    resizeMode="contain"
  />
);

export const BottomTabNavigation = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name={BottomTabRoutes.Dashboard}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name={BottomTabRoutes.Members}
        component={MembersScreen}
        options={{
          tabBarLabel: 'Members',
          tabBarIcon: MembersIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tabBarItem: {
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
});
