import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Import context
import { useAppContext } from '../context/AppContext';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

const TabsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { settings } = useAppContext();
  
  // Mock data for tabs - in a real app, this would be managed by a context or state management
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Google',
      url: 'https://www.google.com',
      favicon: 'https://www.google.com/favicon.ico',
    },
    {
      id: '2',
      title: 'Example',
      url: 'https://www.example.com',
    },
  ]);

  const handleAddTab = () => {
    // In a real app, this would create a new tab and navigate to it
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://www.google.com',
    };
    
    setTabs([...tabs, newTab]);
  };

  const handleRemoveTab = (id: string) => {
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  const handleSelectTab = (tab: Tab) => {
    // Navigate to the WebView with the selected tab's URL
    navigation.navigate('WebView', { url: tab.url, title: tab.title });
  };

  const renderTabItem = ({ item }: { item: Tab }) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
      ]}
      onPress={() => handleSelectTab(item)}
    >
      <View style={styles.tabContent}>
        {item.favicon ? (
          <Image source={{ uri: item.favicon }} style={styles.favicon} />
        ) : (
          <View style={[
            styles.defaultFavicon,
            { backgroundColor: settings.darkMode ? '#444444' : '#EEEEEE' }
          ]}>
            <Text style={[
              styles.faviconText,
              { color: settings.darkMode ? '#FFFFFF' : '#666666' }
            ]}>
              {item.title.charAt(0)}
            </Text>
          </View>
        )}
        <Text 
          style={[
            styles.tabTitle, 
            { color: settings.darkMode ? '#FFFFFF' : '#333333' }
          ]} 
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => handleRemoveTab(item.id)}
      >
        <Icon name="close-circle" size={24} color={settings.darkMode ? '#AAAAAA' : '#666666'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: settings.darkMode ? '#121212' : '#F5F5F5' }
      ]}
    >
      <View style={[
        styles.header,
        { 
          backgroundColor: settings.darkMode ? '#222222' : '#FFFFFF',
          borderBottomColor: settings.darkMode ? '#333333' : '#E0E0E0' 
        }
      ]}>
        <Text style={[
          styles.title,
          { color: settings.darkMode ? '#FFFFFF' : '#333333' }
        ]}>
          Tabs
        </Text>
        <Text style={[
          styles.tabCount,
          { color: settings.darkMode ? '#AAAAAA' : '#666666' }
        ]}>
          {tabs.length} open
        </Text>
      </View>

      <FlatList
        data={tabs}
        renderItem={renderTabItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTab}>
        <Icon name="add-circle" size={50} color="#F57C00" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabCount: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favicon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 4,
  },
  defaultFavicon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faviconText: {
    fontWeight: 'bold',
  },
  tabTitle: {
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default TabsScreen; 