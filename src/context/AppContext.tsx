import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  visitedAt: number;
}

export interface Settings {
  adBlockEnabled: boolean;
  darkMode: boolean;
  searchEngine: 'google' | 'duckduckgo' | 'bing';
  privateMode: boolean;
  dataSaver: boolean;
  defaultHome: string;
}

export interface AppContextType {
  // Browser data
  bookmarks: Bookmark[];
  history: HistoryItem[];
  settings: Settings;
  
  // Actions
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  addToHistory: (historyItem: Omit<HistoryItem, 'id' | 'visitedAt'>) => void;
  clearHistory: () => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Default settings
const defaultSettings: Settings = {
  adBlockEnabled: true,
  darkMode: false,
  searchEngine: 'google',
  privateMode: false,
  dataSaver: false,
  defaultHome: 'https://www.google.com',
};

// Create context with default values
export const AppContext = createContext<AppContextType>({
  bookmarks: [],
  history: [],
  settings: defaultSettings,
  addBookmark: () => {},
  removeBookmark: () => {},
  addToHistory: () => {},
  clearHistory: () => {},
  updateSettings: () => {},
});

// Storage keys
const STORAGE_KEYS = {
  BOOKMARKS: 'quack_browser_bookmarks',
  HISTORY: 'quack_browser_history',
  SETTINGS: 'quack_browser_settings',
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load saved data on app start
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load bookmarks
        const savedBookmarks = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }

        // Load history
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }

        // Load settings
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    loadSavedData();
  }, []);

  // Save data to AsyncStorage when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (!settings.privateMode) {
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
  }, [history, settings.privateMode]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Bookmark actions
  const addBookmark = (newBookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setBookmarks(prev => [bookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  // History actions
  const addToHistory = (newItem: Omit<HistoryItem, 'id' | 'visitedAt'>) => {
    if (settings.privateMode) return;
    
    const historyItem: HistoryItem = {
      ...newItem,
      id: Date.now().toString(),
      visitedAt: Date.now(),
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Settings actions
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const contextValue: AppContextType = {
    bookmarks,
    history,
    settings,
    addBookmark,
    removeBookmark,
    addToHistory,
    clearHistory,
    updateSettings,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext); 