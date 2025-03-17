import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Import context
import { useAppContext } from '../context/AppContext';

// Import utility functions
import { isValidUrl, getUrlWithProtocol, getDomainFromUrl } from '../utils/urlHelpers';

// QuickAccessItem component for displaying website shortcuts
const QuickAccessItem = ({ title, url, icon, onPress }: any) => {
  return (
    <TouchableOpacity 
      style={styles.quickAccessItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.siteIcon} />
        ) : (
          <View style={styles.defaultIconContainer}>
            <Text style={styles.defaultIcon}>{title[0]}</Text>
          </View>
        )}
      </View>
      <Text style={styles.quickAccessTitle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const BrowserScreen = () => {
  const navigation = useNavigation<any>();
  const { settings, history, addToHistory } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Quick access sites
  const quickAccessSites = [
    { id: '1', title: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico' },
    { id: '2', title: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
    { id: '3', title: 'Twitter', url: 'https://twitter.com', icon: 'https://twitter.com/favicon.ico' },
    { id: '4', title: 'Facebook', url: 'https://www.facebook.com', icon: 'https://www.facebook.com/favicon.ico' },
    { id: '5', title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'https://www.wikipedia.org/favicon.ico' },
    { id: '6', title: 'GitHub', url: 'https://github.com', icon: 'https://github.com/favicon.ico' },
    { id: '7', title: 'Reddit', url: 'https://www.reddit.com', icon: 'https://www.reddit.com/favicon.ico' },
    { id: '8', title: 'Amazon', url: 'https://www.amazon.com', icon: 'https://www.amazon.com/favicon.ico' },
  ];

  // Recent sites (from history)
  const recentSites = history.slice(0, 5).map(item => ({
    id: item.id,
    title: item.title || getDomainFromUrl(item.url),
    url: item.url,
    icon: item.favicon,
  }));

  // Handle search submission
  const handleSearch = () => {
    Keyboard.dismiss();
    
    if (!searchQuery.trim()) return;
    
    let finalUrl = '';
    
    if (isValidUrl(searchQuery)) {
      finalUrl = getUrlWithProtocol(searchQuery);
    } else {
      // Use the selected search engine
      switch (settings.searchEngine) {
        case 'duckduckgo':
          finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
          break;
        case 'bing':
          finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
          break;
        case 'google':
        default:
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
          break;
      }
    }
    
    // Record in history if not in private mode
    if (!settings.privateMode) {
      addToHistory({
        url: finalUrl,
        title: searchQuery,
      });
    }
    
    // Navigate to WebView
    navigation.navigate('WebView', { url: finalUrl });
  };

  // Handle site press
  const handleSitePress = (url: string, title: string) => {
    // Record in history if not in private mode
    if (!settings.privateMode) {
      addToHistory({
        url,
        title,
      });
    }
    
    // Navigate to WebView
    navigation.navigate('WebView', { url });
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#F9F9F9' }
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        <View style={styles.header}>
          {/* Logo and Brand */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/Quack.png')} 
              style={styles.logo} 
            />
            <Text 
              style={[
                styles.brandName, 
                { color: settings.darkMode ? '#FFFFFF' : '#000000' }
              ]}
            >
              QuackBrowser
            </Text>
          </View>
          
          {/* Search Bar */}
          <View style={[
            styles.searchBar,
            { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
          ]}>
            <Icon name="search" size={20} color="#888888" style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                { color: settings.darkMode ? '#FFFFFF' : '#000000' }
              ]}
              placeholder="Search or enter website name"
              placeholderTextColor="#888888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Icon name="close-circle" size={20} color="#888888" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text 
            style={[
              styles.sectionTitle,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}
          >
            Quick Access
          </Text>
          <FlatList
            data={quickAccessSites}
            renderItem={({ item }) => (
              <QuickAccessItem
                title={item.title}
                url={item.url}
                icon={item.icon}
                onPress={() => handleSitePress(item.url, item.title)}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickAccessList}
          />
        </View>

        {/* Recent Sites Section */}
        {recentSites.length > 0 && !settings.privateMode && (
          <View style={styles.section}>
            <Text 
              style={[
                styles.sectionTitle,
                { color: settings.darkMode ? '#FFFFFF' : '#000000' }
              ]}
            >
              Recently Visited
            </Text>
            <FlatList
              data={recentSites}
              renderItem={({ item }) => (
                <QuickAccessItem
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                  onPress={() => handleSitePress(item.url, item.title)}
                />
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickAccessList}
            />
          </View>
        )}

        {/* Private Mode Indicator */}
        {settings.privateMode && (
          <View style={styles.privateIndicator}>
            <Icon name="eye-off" size={24} color="#888888" />
            <Text style={styles.privateText}>Private Browsing Mode</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quickAccessList: {
    paddingVertical: 8,
  },
  quickAccessItem: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  siteIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  defaultIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quickAccessTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888888',
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginTop: 'auto',
  },
  privateText: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 10,
  },
});

export default BrowserScreen; 