// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

// Mock react-navigation
jest.mock('@react-navigation/native', () => {
  return {
    createNavigatorFactory: jest.fn(),
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: { url: 'https://example.com', title: 'Example' },
    }),
    useIsFocused: jest.fn().mockReturnValue(true),
  };
});

// Mock react-native-webview
jest.mock('react-native-webview', () => {
  const WebView = jest.fn().mockImplementation(() => 'WebView');
  WebView.NavigationType = {
    LinkActivated: 'LinkActivated',
    FormSubmitted: 'FormSubmitted',
    BackForward: 'BackForward',
    Reload: 'Reload',
    FormResubmitted: 'FormResubmitted',
    Other: 'Other',
  };
  return { WebView };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const mockAsyncStorage = {
    getItem: jest.fn().mockImplementation(() => Promise.resolve(null)),
    setItem: jest.fn().mockImplementation(() => Promise.resolve(null)),
    removeItem: jest.fn().mockImplementation(() => Promise.resolve(null)),
    clear: jest.fn().mockImplementation(() => Promise.resolve(null)),
  };
  return mockAsyncStorage;
});

// Mock Share API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Share = {
    share: jest.fn().mockImplementation(() => Promise.resolve({ action: 'sharedAction' })),
  };
  return RN;
});

// Global console mock to silence specific warnings during tests
const originalConsoleError = global.console.error;
global.console.error = (...args) => {
  // Filter out specific React Native warnings for cleaner test output
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Please update the following components') ||
     args[0].includes('Warning: componentWill') ||
     args[0].includes('react-native-gesture-handler'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock timers
jest.useFakeTimers(); 