#!/bin/bash

# Build script for iOS app preparation

echo "===== Building Scheduled for iOS ====="

# Step 1: Build the web application
echo "Building web application..."
npm run build

# Step 2: Create iOS platform
echo "Adding iOS platform..."
npx cap add ios

# Step 3: Copy web assets to native project
echo "Copying web assets to iOS project..."
npx cap copy ios

# Step 4: Update native plugins
echo "Updating native plugins..."
npx cap update ios

# Step 5: Create iOS app icons
echo "Creating iOS app icons..."
# This would normally use a tool like cordova-res but we're using our svg directly

# Step 6: Sync to Xcode
echo "Syncing to Xcode project..."
npx cap sync ios

echo "===== iOS build preparation complete ====="
echo "Open Xcode to finish configuration and build the app for the App Store:"
echo "npx cap open ios"