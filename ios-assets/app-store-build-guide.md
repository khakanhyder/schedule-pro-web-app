# Step-by-Step iOS App Store Build Guide

This guide provides detailed instructions for building the Scheduled app for App Store submission once you're on your Mac.

## Prerequisites

- Mac computer with macOS Monterey (12.0) or later
- Xcode 14.0 or later installed
- Apple Developer Program membership ($99/year)
- Node.js and npm installed
- Scheduled project files downloaded from Replit

## Step 1: Project Setup

1. **Install Capacitor CLI globally**
   ```bash
   npm install -g @capacitor/cli
   ```

2. **Navigate to project directory**
   ```bash
   cd /path/to/scheduled-app
   ```

3. **Install project dependencies**
   ```bash
   npm install
   ```

4. **Modify capacitor.config.ts**

   Ensure your configuration looks similar to this:
   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.scheduled.app',
     appName: 'Scheduled',
     webDir: 'dist',
     server: {
       androidScheme: 'https'
     },
     plugins: {
       SplashScreen: {
         launchShowDuration: 3000,
         launchAutoHide: true,
         backgroundColor: "#3b5ac2",
         androidSplashResourceName: "splash",
         androidScaleType: "CENTER_CROP",
         showSpinner: true,
         androidSpinnerStyle: "large",
         iosSpinnerStyle: "small",
         spinnerColor: "#ffffff",
         splashFullScreen: true,
         splashImmersive: true
       }
     },
     ios: {
       contentInset: "always"
     }
   };

   export default config;
   ```

## Step 2: Build the Web App

1. **Build your web application**
   ```bash
   npm run build
   ```

2. **Check the build output**
   - Ensure the `dist` directory contains all necessary files
   - Verify that all static assets are included

## Step 3: Add iOS Platform

1. **Add iOS platform to your project**
   ```bash
   npx cap add ios
   ```

2. **Copy web assets to iOS platform**
   ```bash
   npx cap copy ios
   ```

3. **Update native plugins**
   ```bash
   npx cap update ios
   ```

## Step 4: Setup App Icon and Splash Screen

1. **Create an iOS app icon set**
   - Use the provided AppIcon.svg as a base
   - Generate all required sizes using [App Icon Generator](https://appicon.co/)
   - Place the generated icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

2. **Create splash screen assets**
   - Use the provided splash.svg as a base
   - Generate splash screen images for various device sizes
   - Place in `ios/App/App/Assets.xcassets/Splash.imageset/`

3. **Configure splash screen in `Info.plist`**
   - Open `ios/App/App/Info.plist`
   - Ensure there's a reference to `Splash` for the launch screen

## Step 5: Configure iOS Project in Xcode

1. **Open the iOS project in Xcode**
   ```bash
   npx cap open ios
   ```

2. **Update project settings**
   - Click on the project name in the left sidebar
   - Select the "App" target
   - Go to the "General" tab
   - Update "Display Name" to "Scheduled"
   - Set appropriate version and build numbers
   - Select your team for signing

3. **Configure capabilities (if needed)**
   - Go to the "Signing & Capabilities" tab
   - Click "+ Capability" to add features like:
     - Push Notifications
     - Background Modes (if needed)
     - App Groups (if needed)

4. **Configure Info.plist**
   - Add necessary permissions with usage descriptions:
     - NSCameraUsageDescription (if using camera)
     - NSPhotoLibraryUsageDescription (if accessing photos)
     - NSCalendarsUsageDescription (if accessing calendar)
     - NSContactsUsageDescription (if accessing contacts)
     - NSLocationWhenInUseUsageDescription (if using location)

## Step 6: In-App Purchases Setup

1. **Configure StoreKit in Xcode**
   - Go to "Signing & Capabilities"
   - Add the "In-App Purchase" capability

2. **Create products in App Store Connect**
   - Sign in to [App Store Connect](https://appstoreconnect.apple.com)
   - Create your subscription products with the IDs specified in the app-store-info.md document
   
3. **Test in-app purchases using StoreKit Testing**
   - In Xcode, go to Product > Scheme > Edit Scheme
   - Under Run > Options, enable "StoreKit Configuration"
   - Create a new StoreKit configuration file with your products

## Step 7: Test on Simulator and Device

1. **Run on simulator**
   - Select an iOS simulator from the device menu in Xcode
   - Click the "Play" button to build and run
   - Test core functionality
   - Verify that the app icon and splash screen work correctly

2. **Run on physical device (recommended)**
   - Connect your iOS device to your Mac
   - Select your device from the device menu
   - Click the "Play" button to build and run
   - Test all features thoroughly
   - Verify performance and user experience

## Step 8: Prepare for Submission

1. **Capture screenshots**
   - Use the Screenshot tool (Xcode > Window > Devices and Simulators)
   - Take screenshots for all required device sizes
   - Ensure each screenshot showcases different features

2. **Create an App Store archive**
   - Select "Any iOS Device (arm64)" from the device menu
   - Choose Product > Archive from the menu bar
   - Wait for the archive process to complete

3. **Validate the archive**
   - In the Archives window, select your archive
   - Click "Validate App"
   - Fix any issues that appear

## Step 9: Submit to App Store

1. **Distribute the app**
   - In the Archives window, select your archive
   - Click "Distribute App"
   - Select "App Store Connect" as the distribution method
   - Follow the prompts to upload

2. **Complete App Store Connect information**
   - Log in to App Store Connect
   - Complete any missing metadata (refer to app-store-info.md)
   - Upload screenshots and promotional text
   - Submit for review

## Step 10: Post-Submission

1. **Monitor submission status**
   - Check App Store Connect for status updates
   - Be prepared to respond to any reviewer questions

2. **Prepare for app release**
   - Decide between automatic or manual release
   - Prepare marketing materials
   - Update your website with App Store link

## Troubleshooting Common Issues

### Build Errors

1. **Code signing issues**
   - Ensure your Apple Developer account is active
   - Verify team selection in project settings
   - Try refreshing certificates (Xcode > Preferences > Accounts)

2. **Missing capabilities**
   - Add required capabilities in the "Signing & Capabilities" tab
   - Ensure entitlements match your App ID configuration

3. **Missing framework errors**
   - Try cleaning the build folder (Product > Clean Build Folder)
   - Verify Capacitor plugins are properly installed

### Submission Rejections

1. **Metadata issues**
   - Update screenshots to comply with guidelines
   - Ensure app description matches functionality
   - Verify privacy policy is comprehensive

2. **Functionality issues**
   - Fix any crashes or bugs
   - Ensure all features work as described
   - Verify in-app purchases function correctly

3. **Design issues**
   - Fix any UI elements that don't match iOS guidelines
   - Ensure text is readable and UI is responsive
   - Fix any accessibility issues

## Additional Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

Remember to refer to the mac-preparation-guide.md and app-store-info.md documents for more specific information about your app's configuration and metadata requirements.