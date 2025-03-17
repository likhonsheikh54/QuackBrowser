/**
 * Constants used throughout the QuackBrowser application
 */

/**
 * Browser user agent string
 * This is a modern Chrome user agent string to ensure compatibility with most websites
 */
export const BROWSER_USER_AGENT = 
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

/**
 * Default search engines
 */
export const SEARCH_ENGINES = {
  GOOGLE: {
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=',
    baseUrl: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico'
  },
  DUCK_DUCK_GO: {
    name: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com/?q=',
    baseUrl: 'https://duckduckgo.com',
    icon: 'https://duckduckgo.com/favicon.ico'
  },
  BING: {
    name: 'Bing',
    searchUrl: 'https://www.bing.com/search?q=',
    baseUrl: 'https://www.bing.com',
    icon: 'https://www.bing.com/favicon.ico'
  }
};

/**
 * App theme colors
 */
export const COLORS = {
  PRIMARY: '#F57C00',
  SECONDARY: '#FFA726',
  BACKGROUND_LIGHT: '#F9F9F9',
  BACKGROUND_DARK: '#121212',
  TEXT_LIGHT: '#000000',
  TEXT_DARK: '#FFFFFF',
  GRAY_LIGHT: '#EEEEEE',
  GRAY_DARK: '#333333',
  GRAY_MEDIUM: '#888888',
  ACCENT: '#2196F3',
  ERROR: '#F44336',
  SUCCESS: '#4CAF50'
};

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  BOOKMARKS: 'quack_browser_bookmarks',
  HISTORY: 'quack_browser_history',
  SETTINGS: 'quack_browser_settings',
  DOWNLOADS: 'quack_browser_downloads'
};

/**
 * Default browser settings
 */
export const DEFAULT_SETTINGS = {
  adBlockEnabled: true,
  darkMode: false,
  searchEngine: 'google',
  privateMode: false,
  dataSaver: false,
  defaultHome: 'https://www.google.com'
};

/**
 * App information
 */
export const APP_INFO = {
  NAME: 'QuackBrowser',
  VERSION: '1.0.0',
  DESCRIPTION: 'A secure, privacy-focused browser for iOS and Android',
  WEBSITE: 'https://www.quackbrowser.com',
  AUTHOR: 'QuackBrowser Team'
}; 