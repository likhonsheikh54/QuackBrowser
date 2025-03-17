import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import BrowserScreen from '../screens/BrowserScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WebViewScreen from '../screens/WebViewScreen';
import TabsScreen from '../screens/TabsScreen';

// Import context
import { useAppContext } from '../context/AppContext';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Browser stack with WebView screen
const BrowserStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Browser"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Browser" component={BrowserScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Tabs" component={TabsScreen} />
    </Stack.Navigator>
  );
};

// Main tab navigator
const MainNavigator = () => {
  const { settings } = useAppContext();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'BrowserTab') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F57C00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: settings.darkMode ? '#121212' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: settings.darkMode ? '#333333' : '#EEEEEE',
        },
        headerStyle: {
          backgroundColor: settings.darkMode ? '#121212' : '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: settings.darkMode ? '#333333' : '#EEEEEE',
        },
        headerTintColor: settings.darkMode ? '#FFFFFF' : '#000000',
      })}
    >
      <Tab.Screen 
        name="BrowserTab" 
        component={BrowserStack} 
        options={{ 
          title: 'Browser',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{ 
          title: 'Bookmarks',
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ 
          title: 'History',
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
          headerShown: true
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 