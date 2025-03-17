# QuackBrowser

<div align="center">
  <img src="./Quack.png" alt="QuackBrowser Logo" width="150" />
</div>

## About

QuackBrowser is a fast, secure, and privacy-focused mobile browser built on Chromium for iOS and Android. It features a clean interface, powerful ad-blocking capabilities, and enhanced privacy controls.

## Features

- 🚀 Fast browsing experience based on Chromium
- 🛡️ Built-in ad and tracker blocking
- 🔒 Enhanced privacy settings
- 📱 Cross-platform (iOS and Android)
- 🌙 Dark mode support
- 📶 Data saving mode
- 🔄 Seamless sync across devices
- 📑 Efficient tab management

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- React Native environment setup
- Xcode (for iOS development)
- Android Studio (for Android development)
- Yarn

### Quick Start

We've added a setup script to make getting started easier:

```bash
# Clone the repository
git clone https://github.com/likhonsheikh54/QuackBrowser.git
cd QuackBrowser

# Run the setup script
yarn setup
```

The setup script will:
1. Install all dependencies
2. Set up iOS with CocoaPods (if on macOS)
3. Make the Android gradlew script executable

### Manual Installation

If you prefer to set up manually:

```bash
# Clone the repository
git clone https://github.com/likhonsheikh54/QuackBrowser.git
cd QuackBrowser

# Install dependencies
yarn install

# Install iOS dependencies
cd ios && pod install && cd ..

# For Android, make gradlew executable
cd android && chmod +x ./gradlew && cd ..
```

### Running the app

```bash
# Start Metro
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Project Structure

```
QuackBrowser/
├── src/                  # Source files
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   ├── context/          # App context for state management
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation setup
│   ├── screens/          # App screens
│   ├── services/         # API and other services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── ios/                  # iOS native code
├── android/              # Android native code
├── scripts/              # Setup and utility scripts
├── .github/              # GitHub workflows
└── config/               # Configuration files
```

## Continuous Integration and Deployment

This project uses GitHub Actions for CI/CD:

- **CI Pipeline**: Runs on all pull requests to ensure code quality
  - Linting and type checking
  - Unit and UI tests
  - Debug builds for iOS and Android

- **Release Pipeline**: Triggered by version tags (e.g., v1.0.0)
  - Creates production builds for iOS and Android
  - Signs the Android APK
  - Creates a GitHub release with build artifacts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
