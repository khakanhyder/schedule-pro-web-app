# Mac Preparation Guide for App Store Submission

This guide will help you prepare everything you need on your Mac to convert your Scheduled web app into an iOS app for the App Store.

## Step 1: Set Up Your Development Environment

1. **Install Xcode** from the Mac App Store
   - This is Apple's official development environment required for iOS development
   - After installation, open it once to accept the license agreement

2. **Install Node.js** if you don't already have it
   - Download from [nodejs.org](https://nodejs.org/)
   - We recommend the LTS version

3. **Set up Git** for downloading your project
   - Either use the command line or install a Git client like GitHub Desktop

## Step 2: Download Project Files

1. **Create a new folder** on your Mac for this project
   - Example: `~/Documents/ScheduledApp`

2. **Clone or download** the project files from Replit
   - You can download a ZIP file with all project files
   - Be sure to include all the ios-assets files we've created

## Step 3: Project Setup

1. **Install dependencies**
   ```bash
   cd ~/Documents/ScheduledApp
   npm install
   ```

2. **Install Capacitor and required plugins**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/ios
   npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/app
   ```

3. **For subscription functionality (optional at this stage)**
   ```bash
   npm install @capacitor-community/purchases
   ```

## Step 4: Configure Your App

1. **Create Capacitor configuration** (if not already done)
   ```bash
   npx cap init "Scheduled" "com.scheduled.app" --web-dir=dist
   ```

2. **Update the configuration** in capacitor.config.ts with the file we provided

3. **Build your web application**
   ```bash
   npm run build
   ```

4. **Add iOS platform**
   ```bash
   npx cap add ios
   ```

5. **Copy web assets to iOS platform**
   ```bash
   npx cap copy ios
   ```

6. **Update native plugins**
   ```bash
   npx cap update ios
   ```

## Step 5: Integrate Native Code

1. **Open the iOS project** in Xcode
   ```bash
   npx cap open ios
   ```

2. **Add your app icons**
   - In Xcode, navigate to your project settings
   - Select the "App Icons & Launch Images" section
   - Use the AppIcon.svg file we provided as a base
   - Create different size variants using a tool like [AppIconMaker](https://appiconmaker.co/)

3. **Configure Info.plist**
   - Add required permissions
   - Set up URL schemes for deep linking
   - Configure other iOS-specific settings

4. **Test build on simulator**
   - Select a simulator from the device menu in Xcode
   - Click the "Play" button to build and run

## Step 6: Prepare for App Store

1. **Create an Apple Developer account** if you don't have one
   - Go to [developer.apple.com](https://developer.apple.com)
   - Sign up for the Apple Developer Program ($99/year)

2. **Create an App Store Connect record**
   - Log in to [App Store Connect](https://appstoreconnect.apple.com)
   - Click "My Apps" > "+" > "New App"
   - Fill in basic information using our app-store-info.md guide

3. **Configure in-app purchases**
   - In App Store Connect, select your app
   - Navigate to "In-App Purchases" > "+"
   - Create your subscription products
   - Set up pricing and subscription tiers

4. **Create required screenshots**
   - Using the Xcode simulator or a real device
   - For each required device size (see app-store-info.md)

5. **Prepare other metadata**
   - App description
   - Keywords
   - Support URL
   - Privacy Policy URL (use the one we created)

## Step 7: Build for Submission

1. **Configure signing & capabilities** in Xcode
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Sign in with your Apple ID
   - Select your team

2. **Archive the app**
   - In Xcode, select "Generic iOS Device" from the device menu
   - Choose Product > Archive

3. **Upload to App Store Connect**
   - In the Archives window, click "Distribute App"
   - Follow the steps in the distribution assistant
   - Choose "App Store Connect" as the destination

## Step 8: Final Submission

1. **Complete App Review Information**
   - Log in to App Store Connect
   - Provide demo account credentials
   - Add notes for the review team

2. **Submit for review**
   - Click "Submit for Review" button
   - Answer all required questions
   - Wait for Apple's review (typically 1-3 days)

## Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)

## Need Help?

Apple Developer Support is available for technical issues related to your App Store submission:
- [Apple Developer Support](https://developer.apple.com/support/)