import React, { useEffect } from 'react';
import { useNativeFeatures } from './useNativeFeatures';
import SplashScreen from './SplashScreen';

// This is an example wrapper component that shows how to implement
// native features in your existing app structure

export default function AppWithNativeFeatures() {
  const { 
    isNative, 
    isPlatformIOS, 
    setupDeepLinks, 
    onAppStateChange,
    requestPushPermissions
  } = useNativeFeatures();

  // Set up deep links
  useEffect(() => {
    if (isNative) {
      setupDeepLinks((url) => {
        console.log('Deep link opened:', url);
        
        // Example: Handle specific deep links
        if (url.includes('/booking')) {
          // Navigate to booking page
        } else if (url.includes('/dashboard')) {
          // Navigate to dashboard
        }
      });
    }
  }, [isNative, setupDeepLinks]);

  // Set up app state change listeners
  useEffect(() => {
    if (isNative) {
      onAppStateChange(
        // On resume
        () => {
          console.log('App resumed');
          // Refresh appointments or other time-sensitive data
        },
        // On pause
        () => {
          console.log('App paused');
          // Save any unsaved data or state
        }
      );
    }
  }, [isNative, onAppStateChange]);

  // Request push notification permissions when app first loads
  useEffect(() => {
    if (isNative) {
      const requestPermission = async () => {
        const granted = await requestPushPermissions();
        console.log('Push permissions granted:', granted);
      };
      
      requestPermission();
    }
  }, [isNative, requestPushPermissions]);

  // Apply iOS-specific styling or behavior
  useEffect(() => {
    if (isPlatformIOS) {
      // iOS-specific setup
      document.body.classList.add('ios-device');
      
      // Apply iOS status bar styling
      const setStatusBarStyle = async () => {
        try {
          const { StatusBar } = await import('@capacitor/status-bar');
          StatusBar.setStyle({ style: 'dark' });
        } catch (err) {
          console.error('Failed to set status bar style:', err);
        }
      };
      
      setStatusBarStyle();
    }
  }, [isPlatformIOS]);

  // Render your app inside the splash screen component
  return (
    <SplashScreen minDisplayTime={2500}>
      {/* Your existing App component would go here */}
      <div className="app-container">
        <h1>Scheduled App</h1>
        <p>Your existing app content will render here</p>
        
        {/* Native platform indicator (for testing) */}
        {isNative && (
          <div className="platform-indicator">
            Running on: {isPlatformIOS ? 'iOS' : 'Web'}
          </div>
        )}
      </div>
    </SplashScreen>
  );
}