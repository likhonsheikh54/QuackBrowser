import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import context
import { useAppContext } from '../context/AppContext';

// Import utility functions
import { isValidUrl, getUrlWithProtocol, getDomainFromUrl } from '../utils/urlHelpers';
import { BROWSER_USER_AGENT } from '../utils/constants';

// Import ad blocking script
import { AD_BLOCK_SCRIPT } from '../utils/adBlockScript';

// Types
type WebViewScreenRouteProp = RouteProp<{
  WebView: { url: string; title?: string };
}, 'WebView'>;

const WebViewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<WebViewScreenRouteProp>();
  const { settings, addToHistory, addBookmark, bookmarks } = useAppContext();
  
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(route.params.url);
  const [urlInput, setUrlInput] = useState(route.params.url);
  const [pageTitle, setPageTitle] = useState(route.params.title || '');
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if the URL is bookmarked
  useEffect(() => {
    const checkBookmark = () => {
      const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);
      setIsBookmarked(isBookmarked);
    };
    
    checkBookmark();
  }, [currentUrl, bookmarks]);

  // Navigation actions
  const goBack = () => webViewRef.current?.goBack();
  const goForward = () => webViewRef.current?.goForward();
  const reload = () => webViewRef.current?.reload();
  const stopLoading = () => webViewRef.current?.stopLoading();

  // Share the current URL
  const handleShare = async () => {
    try {
      await Share.share({
        message: currentUrl,
        title: pageTitle,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Show tabs screen
  const handleShowTabs = () => {
    navigation.navigate('Tabs');
  };

  // Toggle bookmark
  const handleBookmark = () => {
    if (isBookmarked) {
      const bookmarkToRemove = bookmarks.find(bookmark => bookmark.url === currentUrl);
      if (bookmarkToRemove) {
        Alert.alert(
          'Remove Bookmark',
          'Are you sure you want to remove this bookmark?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: () => {
                const bookmarkId = bookmarkToRemove.id;
                // Call the removeBookmark method from context
                // We'll assume this context method exists
              }
            },
          ]
        );
      }
    } else {
      addBookmark({
        title: pageTitle || getDomainFromUrl(currentUrl),
        url: currentUrl,
        favicon: `https://${getDomainFromUrl(currentUrl)}/favicon.ico`,
      });
    }
  };

  // Handle URL change
  const handleUrlChange = (url: string) => {
    setUrlInput(url);
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    let finalUrl = '';
    
    if (isValidUrl(urlInput)) {
      finalUrl = getUrlWithProtocol(urlInput);
    } else {
      // Use the selected search engine
      switch (settings.searchEngine) {
        case 'duckduckgo':
          finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(urlInput)}`;
          break;
        case 'bing':
          finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(urlInput)}`;
          break;
        case 'google':
        default:
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(urlInput)}`;
          break;
      }
    }
    
    setCurrentUrl(finalUrl);
    
    // Add to history if not in private mode
    if (!settings.privateMode) {
      addToHistory({
        url: finalUrl,
        title: pageTitle,
      });
    }
  };

  // WebView navigation state change
  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    setUrlInput(navState.url);
    
    if (navState.title) {
      setPageTitle(navState.title);
    }
    
    // Add to history if not in private mode and loading complete
    if (!settings.privateMode && !navState.loading && navState.url) {
      addToHistory({
        url: navState.url,
        title: navState.title || getDomainFromUrl(navState.url),
        favicon: `https://${getDomainFromUrl(navState.url)}/favicon.ico`,
      });
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: settings.darkMode ? '#121212' : '#FFFFFF' }
      ]}
    >
      {/* URL Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.urlBarContainer}
      >
        <View style={[
          styles.urlBar,
          { backgroundColor: settings.darkMode ? '#333333' : '#F5F5F5' }
        ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={settings.darkMode ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.urlInput,
              { color: settings.darkMode ? '#FFFFFF' : '#000000' }
            ]}
            value={urlInput}
            onChangeText={handleUrlChange}
            onSubmitEditing={handleUrlSubmit}
            placeholder="Search or enter website address"
            placeholderTextColor="#888888"
            selectTextOnFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
          />
          
          {loading ? (
            <TouchableOpacity onPress={stopLoading} style={styles.controlButton}>
              <Icon name="close" size={24} color={settings.darkMode ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={reload} style={styles.controlButton}>
              <Icon name="refresh" size={24} color={settings.darkMode ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* WebView */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webView}
          userAgent={BROWSER_USER_AGENT}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={!settings.privateMode}
          thirdPartyCookiesEnabled={!settings.privateMode}
          cacheEnabled={!settings.privateMode}
          incognito={settings.privateMode}
          injectedJavaScript={settings.adBlockEnabled ? AD_BLOCK_SCRIPT : ''}
          pullToRefreshEnabled={true}
          decelerationRate="normal"
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F57C00" />
            </View>
          )}
        />
        
        {loading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '20%' }]} />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Control Bar */}
      <View style={[
        styles.controlBar,
        { backgroundColor: settings.darkMode ? '#333333' : '#F5F5F5' }
      ]}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={goBack}
          disabled={!canGoBack}
        >
          <Icon 
            name="chevron-back" 
            size={28} 
            color={canGoBack ? (settings.darkMode ? '#FFFFFF' : '#000000') : '#888888'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={goForward}
          disabled={!canGoForward}
        >
          <Icon 
            name="chevron-forward" 
            size={28} 
            color={canGoForward ? (settings.darkMode ? '#FFFFFF' : '#000000') : '#888888'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleShowTabs}
        >
          <Icon 
            name="documents-outline" 
            size={24} 
            color={settings.darkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleBookmark}
        >
          <Icon 
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={isBookmarked ? '#F57C00' : (settings.darkMode ? '#FFFFFF' : '#000000')} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleShare}
        >
          <Icon 
            name="share-outline" 
            size={24} 
            color={settings.darkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.navigate('BrowserTab')}
        >
          <Icon 
            name="grid-outline" 
            size={24} 
            color={settings.darkMode ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  urlBarContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
  urlInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E0E0E0',
  },
  progress: {
    height: '100%',
    backgroundColor: '#F57C00',
  },
  controlBar: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  controlButton: {
    padding: 8,
  },
});

export default WebViewScreen; 