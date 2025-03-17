import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Import context
import { useAppContext } from '../context/AppContext';

// Import utility functions
import { getDomainFromUrl, formatUrlForDisplay } from '../utils/urlHelpers';

// Helper to format date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
};

// Helper to format time
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Group history items by date
const groupHistoryByDate = (historyItems: any[]) => {
  const groups: { [date: string]: any[] } = {};
  
  historyItems.forEach(item => {
    const dateString = formatDate(item.visitedAt);
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(item);
  });
  
  // Convert to array format for SectionList
  return Object.keys(groups).map(date => ({
    title: date,
    data: groups[date]
  }));
};

const HistoryScreen = () => {
  const navigation = useNavigation<any>();
  const { history, clearHistory, settings } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter history based on search query
  const filteredHistory = searchQuery
    ? history.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : history;

  // Group the filtered history
  const groupedHistory = groupHistoryByDate(filteredHistory);

  const handleHistoryItemPress = (url: string, title: string) => {
    navigation.navigate('WebView', { url, title });
  };

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

  const renderHistoryItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.historyItem,
          { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
        ]}
        onPress={() => handleHistoryItemPress(item.url, item.title)}
        activeOpacity={0.7}
      >
        <View style={styles.historyContent}>
          {/* Favicon or default icon */}
          <View style={styles.faviconContainer}>
            {item.favicon ? (
              <Image source={{ uri: item.favicon }} style={styles.favicon} />
            ) : (
              <View style={styles.defaultFavicon}>
                <Text style={styles.defaultFaviconText}>
                  {(item.title || getDomainFromUrl(item.url)).charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          {/* History details */}
          <View style={styles.historyDetails}>
            <Text 
              style={[
                styles.historyTitle,
                { color: settings.darkMode ? '#FFFFFF' : '#000000' }
              ]}
              numberOfLines={1}
            >
              {item.title || getDomainFromUrl(item.url)}
            </Text>
            <Text 
              style={styles.historyUrl}
              numberOfLines={1}
            >
              {formatUrlForDisplay(item.url)}
            </Text>
          </View>
        </View>
        
        {/* Time */}
        <Text style={styles.historyTime}>
          {formatTime(item.visitedAt)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <View style={[
      styles.sectionHeader,
      { backgroundColor: settings.darkMode ? '#222222' : '#F0F0F0' }
    ]}>
      <Text style={[
        styles.sectionTitle,
        { color: settings.darkMode ? '#FFFFFF' : '#000000' }
      ]}>
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#F9F9F9' }
      ]}
    >
      {/* Search & Clear History */}
      <View style={styles.header}>
        <View style={[
          styles.searchContainer,
          { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
        ]}>
          <Icon name="search" size={20} color="#888888" style={styles.searchIcon} />
          <TextInput
            style={[
              styles.searchInput,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}
            placeholder="Search history..."
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#888888" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearHistory}
          disabled={history.length === 0}
        >
          <Icon 
            name="trash-outline" 
            size={22} 
            color={history.length === 0 ? '#CCCCCC' : '#F44336'} 
          />
        </TouchableOpacity>
      </View>

      {/* History list */}
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="time-outline" size={64} color="#CCCCCC" />
          <Text 
            style={[
              styles.emptyText,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}
          >
            No browsing history
          </Text>
          <Text style={styles.emptySubtext}>
            Websites you visit will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedHistory}
          renderItem={({ item }) => (
            <View>
              {renderSectionHeader({ section: { title: item.title } })}
              <FlatList
                data={item.data}
                renderItem={renderHistoryItem}
                keyExtractor={historyItem => historyItem.id}
              />
            </View>
          )}
          keyExtractor={(item, index) => item.title + index}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptySearchResults}>
              <Text style={{ color: settings.darkMode ? '#FFFFFF' : '#000000' }}>
                No history matches your search
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 12,
    marginLeft: 8,
  },
  listContent: {
    flexGrow: 1,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  faviconContainer: {
    marginRight: 12,
  },
  favicon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  defaultFavicon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultFaviconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyUrl: {
    fontSize: 14,
    color: '#888888',
  },
  historyTime: {
    fontSize: 12,
    color: '#888888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySearchResults: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

export default HistoryScreen; 