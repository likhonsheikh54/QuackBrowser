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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Import context
import { useAppContext } from '../context/AppContext';

// Import utility functions
import { getDomainFromUrl } from '../utils/urlHelpers';

const BookmarksScreen = () => {
  const navigation = useNavigation<any>();
  const { bookmarks, removeBookmark, settings } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<any>(null);

  // Filter bookmarks based on search query
  const filteredBookmarks = searchQuery
    ? bookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookmarks;

  const handleBookmarkPress = (url: string, title: string) => {
    navigation.navigate('WebView', { url, title });
  };

  const handleRemoveBookmark = (id: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeBookmark(id)
        },
      ]
    );
  };

  const handleEditBookmark = (bookmark: any) => {
    setSelectedBookmark(bookmark);
    setEditModalVisible(true);
  };

  const renderBookmarkItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.bookmarkItem,
          { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
        ]}
        onPress={() => handleBookmarkPress(item.url, item.title)}
        activeOpacity={0.7}
      >
        <View style={styles.bookmarkContent}>
          {/* Favicon or default icon */}
          <View style={styles.faviconContainer}>
            {item.favicon ? (
              <Image source={{ uri: item.favicon }} style={styles.favicon} />
            ) : (
              <View style={styles.defaultFavicon}>
                <Text style={styles.defaultFaviconText}>
                  {item.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          {/* Bookmark details */}
          <View style={styles.bookmarkDetails}>
            <Text 
              style={[
                styles.bookmarkTitle,
                { color: settings.darkMode ? '#FFFFFF' : '#000000' }
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text 
              style={styles.bookmarkUrl}
              numberOfLines={1}
            >
              {getDomainFromUrl(item.url)}
            </Text>
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.bookmarkActions}>
          <TouchableOpacity 
            onPress={() => handleEditBookmark(item)}
            style={styles.actionButton}
          >
            <Icon name="pencil-outline" size={20} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleRemoveBookmark(item.id)}
            style={styles.actionButton}
          >
            <Icon name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#F9F9F9' }
      ]}
    >
      {/* Search bar */}
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
          placeholder="Search bookmarks..."
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

      {/* Bookmarks list */}
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bookmark-outline" size={64} color="#CCCCCC" />
          <Text 
            style={[
              styles.emptyText,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}
          >
            No bookmarks yet
          </Text>
          <Text style={styles.emptySubtext}>
            Bookmarks you add will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptySearchResults}>
              <Text style={{ color: settings.darkMode ? '#FFFFFF' : '#000000' }}>
                No bookmarks match your search
              </Text>
            </View>
          )}
        />
      )}

      {/* Edit Bookmark Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[
              styles.modalContent,
              { backgroundColor: settings.darkMode ? '#333333' : '#FFFFFF' }
            ]}
          >
            <Text style={[
              styles.modalTitle,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}>
              Edit Bookmark
            </Text>
            
            <TextInput
              style={[
                styles.modalInput,
                { 
                  color: settings.darkMode ? '#FFFFFF' : '#000000',
                  backgroundColor: settings.darkMode ? '#444444' : '#F5F5F5' 
                }
              ]}
              placeholder="Title"
              placeholderTextColor="#888888"
              value={selectedBookmark?.title || ''}
              onChangeText={(text) => setSelectedBookmark({...selectedBookmark, title: text})}
            />
            
            <TextInput
              style={[
                styles.modalInput,
                { 
                  color: settings.darkMode ? '#FFFFFF' : '#000000',
                  backgroundColor: settings.darkMode ? '#444444' : '#F5F5F5' 
                }
              ]}
              placeholder="URL"
              placeholderTextColor="#888888"
              value={selectedBookmark?.url || ''}
              onChangeText={(text) => setSelectedBookmark({...selectedBookmark, url: text})}
              autoCapitalize="none"
              keyboardType="url"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // We should have a function to update bookmarks
                  // For now, we'll just close the modal
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faviconContainer: {
    marginRight: 12,
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  defaultFavicon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultFaviconText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bookmarkDetails: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookmarkUrl: {
    fontSize: 14,
    color: '#888888',
  },
  bookmarkActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  saveButton: {
    backgroundColor: '#F57C00',
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default BookmarksScreen; 