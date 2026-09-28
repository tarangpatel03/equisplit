import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, useAppTheme } from '@/theme';

import { ScreenHeader } from './ScreenHeader';

type ScreenProps = {
  children: React.ReactNode;
  preset?: 'fixed' | 'scroll';
  safeAreaEdges?: Edge[];
  screenTitle: string;
  headerRight?: React.ReactNode;
  keyboardAvoiding?: boolean;
  showBackButton?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  dismissKeyboardOnTouch?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
};

export const AppScreen = ({
  children,
  preset = 'fixed',
  safeAreaEdges = ['top', 'bottom'],
  keyboardAvoiding = true,
  keyboardShouldPersistTaps = 'handled',
  dismissKeyboardOnTouch = true,
  contentContainerStyle,
  style,
  showBackButton,
  screenTitle,
  headerRight,
  scrollViewProps,
}: ScreenProps) => {
  const { colors: themeColors } = useAppTheme();

  const content =
    preset === 'scroll' ? (
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.flexGrow1, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    ) : (
      <View
        style={[
          styles.scrollView,
          { backgroundColor: themeColors.background },
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    );

  const wrappedContent =
    dismissKeyboardOnTouch && preset === 'fixed' ? (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.scrollView, { backgroundColor: themeColors.background }]}>
          {content}
        </View>
      </TouchableWithoutFeedback>
    ) : (
      content
    );

  const finalContent =
    keyboardAvoiding && preset === 'fixed' ? (
      <KeyboardAvoidingView
        style={[styles.scrollView, { backgroundColor: themeColors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {wrappedContent}
      </KeyboardAvoidingView>
    ) : (
      wrappedContent
    );

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[
        styles.scrollView,
        { backgroundColor: themeColors.background },
        style,
      ]}
    >
      <ScreenHeader
        screenTitle={screenTitle}
        rightAction={headerRight}
        showBackButton={showBackButton}
      />
      {finalContent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flexGrow1: {
    flexGrow: 1,
  },
});
