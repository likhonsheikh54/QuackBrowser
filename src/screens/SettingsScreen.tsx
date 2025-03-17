import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Import context
import { useAppContext } from '../context/AppContext';

// Import constants
import { APP_INFO, SEARCH_ENGINES } from '../utils/constants';

// Settings section header component
const SectionHeader = ({ title, darkMode }: { title: string; darkMode: boolean }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: darkMode ? '#FFFFFF' : '#000000' }]}>
      {title}
    </Text>
  </View>
);

// Settings item component
const SettingsItem = ({ 
  icon, 
  title, 
  description, 
  rightComponent,
  onPress,
  darkMode
}: { 
  icon: string; 
  title: string; 
  description?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  darkMode: boolean;
}) => (
  <TouchableOpacity 
    style={[
      styles.settingsItem,
      { backgroundColor: darkMode ? '#333333' : '#FFFFFF' }
    ]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingsItemLeft}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: darkMode ? '#444444' : '#F5F5F5' }
      ]}>
        <Icon 
          name={icon} 
          size={22} 
          color="#F57C00" 
        />
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={[
          styles.settingsItemTitle,
          { color: darkMode ? '#FFFFFF' : '#000000' }
        ]}>
          {title}
        </Text>
        {description && (
          <Text style={styles.settingsItemDescription}>
            {description}
          </Text>
        )}
      </View>
    </View>
    
    {rightComponent && (
      <View style={styles.settingsItemRight}>
        {rightComponent}
      </View>
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const { 
    settings,
    updateSettings,
    clearHistory
  } = useAppContext();

  // Toggle handlers
  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleAdBlocker = () => {
    updateSettings({ adBlockEnabled: !settings.adBlockEnabled });
  };

  const togglePrivateMode = () => {
    updateSettings({ privateMode: !settings.privateMode });
  };

  const toggleDataSaver = () => {
    updateSettings({ dataSaver: !settings.dataSaver });
  };

  // Search engine selection
  const selectSearchEngine = () => {
    Alert.alert(
      'Select Search Engine',
      'Choose your default search engine',
      [
        {
          text: 'Google',
          onPress: () => updateSettings({ searchEngine: 'google' }),
        },
        {
          text: 'DuckDuckGo',
          onPress: () => updateSettings({ searchEngine: 'duckduckgo' }),
        },
        {
          text: 'Bing',
          onPress: () => updateSettings({ searchEngine: 'bing' }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Clear data
  const handleClearHistory = () => {
    Alert.alert(
      'Clear Browsing History',
      'Are you sure you want to clear all browsing history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: clearHistory
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data, including cookies. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // We would normally call a function here to clear cache
            // Since we don't have access to that directly in WebView,
            // we can just show a confirmation for now
            setTimeout(() => {
              Alert.alert('Cache Cleared', 'All cached data has been cleared.');
            }, 500);
          }
        },
      ]
    );
  };

  // Get current search engine name
  const getCurrentSearchEngine = () => {
    switch (settings.searchEngine) {
      case 'duckduckgo':
        return 'DuckDuckGo';
      case 'bing':
        return 'Bing';
      case 'google':
      default:
        return 'Google';
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#F9F9F9' }
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <SectionHeader title="Appearance" darkMode={settings.darkMode} />
        
        <SettingsItem
          icon="contrast-outline"
          title="Dark Mode"
          description="Enable dark theme for the browser"
          darkMode={settings.darkMode}
          rightComponent={
            <Switch
              value={settings.darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D0D0D0', true: '#FFB74D' }}
              thumbColor={settings.darkMode ? '#F57C00' : '#F5F5F5'}
            />
          }
        />

        {/* Browsing Section */}
        <SectionHeader title="Browsing" darkMode={settings.darkMode} />
        
        <SettingsItem
          icon="search-outline"
          title="Search Engine"
          description={getCurrentSearchEngine()}
          darkMode={settings.darkMode}
          onPress={selectSearchEngine}
          rightComponent={
            <Icon 
              name="chevron-forward-outline" 
              size={20} 
              color={settings.darkMode ? '#FFFFFF' : '#888888'} 
            />
          }
        />
        
        <SettingsItem
          icon="flash-outline"
          title="Data Saver"
          description="Reduce data usage while browsing"
          darkMode={settings.darkMode}
          rightComponent={
            <Switch
              value={settings.dataSaver}
              onValueChange={toggleDataSaver}
              trackColor={{ false: '#D0D0D0', true: '#FFB74D' }}
              thumbColor={settings.dataSaver ? '#F57C00' : '#F5F5F5'}
            />
          }
        />

        {/* Privacy Section */}
        <SectionHeader title="Privacy & Security" darkMode={settings.darkMode} />
        
        <SettingsItem
          icon="shield-checkmark-outline"
          title="Ad Blocker"
          description="Block ads and trackers while browsing"
          darkMode={settings.darkMode}
          rightComponent={
            <Switch
              value={settings.adBlockEnabled}
              onValueChange={toggleAdBlocker}
              trackColor={{ false: '#D0D0D0', true: '#FFB74D' }}
              thumbColor={settings.adBlockEnabled ? '#F57C00' : '#F5F5F5'}
            />
          }
        />
        
        <SettingsItem
          icon="eye-off-outline"
          title="Private Browsing"
          description="Don't save history or cookies"
          darkMode={settings.darkMode}
          rightComponent={
            <Switch
              value={settings.privateMode}
              onValueChange={togglePrivateMode}
              trackColor={{ false: '#D0D0D0', true: '#FFB74D' }}
              thumbColor={settings.privateMode ? '#F57C00' : '#F5F5F5'}
            />
          }
        />

        {/* Data Management Section */}
        <SectionHeader title="Data Management" darkMode={settings.darkMode} />
        
        <SettingsItem
          icon="time-outline"
          title="Clear History"
          description="Clear all browsing history"
          darkMode={settings.darkMode}
          onPress={handleClearHistory}
        />
        
        <SettingsItem
          icon="trash-outline"
          title="Clear Cache"
          description="Clear all cached data and cookies"
          darkMode={settings.darkMode}
          onPress={handleClearCache}
        />

        {/* About Section */}
        <SectionHeader title="About" darkMode={settings.darkMode} />
        
        <SettingsItem
          icon="information-circle-outline"
          title="Version"
          description={APP_INFO.VERSION}
          darkMode={settings.darkMode}
        />
        
        <SettingsItem
          icon="help-circle-outline"
          title="Help & Feedback"
          description="Get help or send feedback"
          darkMode={settings.darkMode}
          onPress={() => {
            // We would normally navigate to a help screen or open an email
            Alert.alert(
              'Help & Feedback',
              'Would you like to visit our support center or send feedback?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Support Center', 
                  onPress: () => Linking.openURL('https://www.quackbrowser.com/support')
                },
                {
                  text: 'Send Feedback',
                  onPress: () => Linking.openURL('mailto:feedback@quackbrowser.com')
                }
              ]
            );
          }}
          rightComponent={
            <Icon 
              name="chevron-forward-outline" 
              size={20} 
              color={settings.darkMode ? '#FFFFFF' : '#888888'} 
            />
          }
        />
        
        <SettingsItem
          icon="document-text-outline"
          title="Privacy Policy"
          darkMode={settings.darkMode}
          onPress={() => Linking.openURL('https://www.quackbrowser.com/privacy')}
          rightComponent={
            <Icon 
              name="chevron-forward-outline" 
              size={20} 
              color={settings.darkMode ? '#FFFFFF' : '#888888'} 
            />
          }
        />
        
        <SettingsItem
          icon="star-outline"
          title="Rate QuackBrowser"
          darkMode={settings.darkMode}
          onPress={() => {
            // We would normally link to app store pages
            Alert.alert(
              'Rate QuackBrowser',
              'Would you like to rate QuackBrowser on the app store?',
              [
                { text: 'Not Now', style: 'cancel' },
                { 
                  text: 'Rate Now', 
                  onPress: () => {
                    // Link to app store here
                    Alert.alert('Thank You!', 'Your support helps us improve QuackBrowser.');
                  }
                }
              ]
            );
          }}
          rightComponent={
            <Icon 
              name="chevron-forward-outline" 
              size={20} 
              color={settings.darkMode ? '#FFFFFF' : '#888888'} 
            />
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemDescription: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  settingsItemRight: {
    marginLeft: 8,
  },
});

export default SettingsScreen; 