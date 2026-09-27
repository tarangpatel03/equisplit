import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import RootNavigation from '@/navigation/RootNavigation';
import { store } from '@/store/store';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <RootNavigation />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
