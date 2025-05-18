# App Store Build and Submission Guide for Scheduled

This guide will walk you through the process of building and submitting your Scheduled app to the Apple App Store.

## Prerequisites

1. **Apple Developer Account**: Register at [developer.apple.com](https://developer.apple.com) ($99/year)
2. **Xcode**: Install on a Mac computer (required for iOS app development)
3. **Certificates & Identifiers**: Set up in Apple Developer Portal

## Step 1: Prepare Your Web App

You've already completed most of this step! Your web app has:
- Progressive Web App features
- Mobile-optimized interface
- Privacy policy and terms of service

## Step 2: Build With Capacitor

```bash
# Install capacitor (already done)
npm install @capacitor/core @capacitor/cli @capacitor/ios

# Build the web app for production
npm run build

# Initialize capacitor (already done)
npx cap init "Scheduled" "com.scheduled.app" --web-dir=dist

# Add iOS platform
npx cap add ios

# Copy web assets to iOS platform
npx cap copy ios

# Sync native plugins
npx cap sync ios
```

## Step 3: Open in Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios
```

## Step 4: Configure iOS App in Xcode

1. **Set Bundle Identifier**: Ensure it matches "com.scheduled.app"
2. **Set App Display Name**: "Scheduled"
3. **Configure Signing & Capabilities**:
   - Select your Apple Developer account
   - Choose a Team
   - Manage signing certificates
4. **Add App Icons**: Use the AppIcon.svg provided in ios-assets
5. **Configure Info.plist**:
   - Add necessary permissions (Camera, Photo Library, etc.)
   - Configure URL schemes if needed

## Step 5: Build & Test

1. **Select a Simulator or Device**
2. **Click the Run button in Xcode**
3. **Test all functionality thoroughly**:
   - Account creation/login
   - Appointment scheduling
   - Payment processing
   - Push notifications (if implemented)
   - Offline capabilities

## Step 6: TestFlight Testing

1. **Archive the App**: Product > Archive in Xcode
2. **Upload to App Store Connect**
3. **Add Internal Testers**: Invite team members
4. **Add External Testers**: Invite up to 10,000 users
5. **Gather Feedback & Fix Issues**

## Step 7: App Store Submission

1. **Prepare Metadata** (use app-store-info.md as a guide):
   - App description
   - Keywords
   - Screenshots
   - App Icon
   - Support URL
   - Privacy Policy URL
2. **Configure In-App Purchases**:
   - Set up subscription products
   - Create subscription groups
   - Provide promotional images
3. **Complete App Review Information**:
   - Contact details
   - Demo account credentials
   - Notes for reviewers
4. **Submit for Review**:
   - Answer export compliance questions
   - Verify content rights
   - Submit the app

## Step 8: Respond to App Review Feedback

1. **Monitor Status**: Check App Store Connect regularly
2. **Respond Quickly**: Address any questions or concerns
3. **Fix Rejections**: Update the app if rejected and resubmit

## Step 9: Release

1. **Set Availability Date**: Choose when the app goes live
2. **Phased Release**: Consider gradual rollout
3. **Monitor Analytics**: Track installs and usage

## App Maintenance

1. **Regular Updates**: Plan a schedule for new features
2. **Bug Fixes**: Address issues promptly
3. **iOS Version Compatibility**: Test with new iOS releases
4. **Certificate Renewal**: Keep developer certificates current

## Helpful Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Capacitor Documentation](https://capacitorjs.com/docs)