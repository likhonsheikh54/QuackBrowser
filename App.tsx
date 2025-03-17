import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

// Ignore specific warnings that we can't fix
LogBox.ignoreLogs(['Reanimated 2']);

// Import our navigation stack
import MainNavigator from './src/navigation/MainNavigator';

// Import global app context provider
import { AppProvider } from './src/context/AppContext';

const App: React.FC = () => {
  useEffect(() => {
    // Hide splash screen when app is loaded
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <MainNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App; 