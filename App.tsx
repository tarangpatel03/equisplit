import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import { ThemeTransitionOverlay } from '@/components/common';
import RootNavigation from '@/navigation/RootNavigation';
import { initDatabase } from '@/services/database';
import { toastConfig } from '@/services/toast';
import { store } from '@/store/store';
import { loadPersistedThemeMode, setThemeMode } from '@/store/themeSlice';
import { colors, useAppTheme } from '@/theme';

function ThemedApp() {
  const { isDark } = useAppTheme();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigation />
      <ThemeTransitionOverlay />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}

function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    loadPersistedThemeMode().then(mode => {
      if (mode) {
        store.dispatch(setThemeMode(mode));
      }
    });

    initDatabase()
      .then(() => setDbReady(true))
      .catch(err => {
        console.error('[DB] initDatabase failed:', err);
      });
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default App;
