import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';

// Navigation
import { navigationRef } from './src/navigation/RootNavigation';
import { NotificationService } from './src/services/NotificationService';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MainNavigator from './src/navigation/MainNavigator';
import ChatScreen from './src/screens/ChatScreen';
import PremiumScreen from './src/screens/PremiumScreen';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    // Request permissions and get token
    NotificationService.requestUserPermission();
    // Initialize notification handlers
    NotificationService.initialize();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar hidden={true} />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Premium" component={PremiumScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
