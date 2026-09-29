import { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import RootNavigation from '@/navigation/RootNavigation';
import { initDatabase } from '@/services/database';
import { toastConfig } from '@/services/toast';
import { store } from '@/store/store';
import {
  loadPersistedCurrencyCode,
  setCurrencyCode,
} from '@/store/currencySlice';
import {
  loadPersistedPreferences,
  setTrackOutOfPocket,
} from '@/store/preferencesSlice';
import { loadPersistedThemeMode, setThemeMode } from '@/store/themeSlice';
import { useAppTheme } from '@/theme';

function ThemedApp({ onReady }: { onReady: () => void }) {
  const { isDark } = useAppTheme();

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigation />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}

function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const [mode, code, prefs] = await Promise.all([
          loadPersistedThemeMode(),
          loadPersistedCurrencyCode(),
          loadPersistedPreferences(),
          initDatabase(),
        ]);

        if (mode) {
          store.dispatch(setThemeMode(mode));
        }
        if (code) {
          store.dispatch(setCurrencyCode(code));
        }
        if (prefs) {
          store.dispatch(setTrackOutOfPocket(prefs.trackOutOfPocket));
        }
      } catch (err) {
        console.error('[App] Initialization error:', err);
      } finally {
        setDbReady(true);
      }
    };

    initApp();
  }, []);

  const handleAppReady = useCallback(async () => {
    try {
      await BootSplash.hide({ fade: true });
    } catch (err) {
      console.warn('[BootSplash] hide error:', err);
    }
  }, []);

  if (!dbReady) {
    return <View style={styles.container} />;
  }

  return (
    <Provider store={store}>
      <ThemedApp onReady={handleAppReady} />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12161E',
  },
});

export default App;
