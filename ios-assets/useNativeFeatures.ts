import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function useNativeFeatures() {
  const [isNative, setIsNative] = useState(false);
  const [isPlatformIOS, setIsPlatformIOS] = useState(false);
  const [isPlatformAndroid, setIsPlatformAndroid] = useState(false);
  
  useEffect(() => {
    // Determine if running in a native environment
    const native = Capacitor.isNativePlatform();
    setIsNative(native);
    
    // Determine platform type
    if (native) {
      const platform = Capacitor.getPlatform();
      setIsPlatformIOS(platform === 'ios');
      setIsPlatformAndroid(platform === 'android');
    }
  }, []);
  
  // Function to handle deep links
  const setupDeepLinks = (callback: (url: string) => void) => {
    if (!isNative) return;
    
    // This would typically use Capacitor's App plugin
    // You would need to install @capacitor/app
    const setupListener = async () => {
      try {
        const { App } = await import('@capacitor/app');
        
        // Listen for deep link events
        App.addListener('appUrlOpen', (data: { url: string }) => {
          callback(data.url);
        });
        
        return () => {
          App.removeAllListeners();
        };
      } catch (err) {
        console.error('Failed to setup deep link listeners:', err);
      }
    };
    
    setupListener();
  };
  
  // Function to request push notification permissions
  const requestPushPermissions = async () => {
    if (!isNative) return false;
    
    try {
      // This would typically use Capacitor's Push Notifications plugin
      // You would need to install @capacitor/push-notifications
      const { PushNotifications } = await import('@capacitor/push-notifications');
      
      // Register with FCM/APNS
      await PushNotifications.register();
      
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      return permission.receive === 'granted';
    } catch (err) {
      console.error('Failed to request push permissions:', err);
      return false;
    }
  };
  
  // Function to handle app state changes
  const onAppStateChange = (
    onResume: () => void, 
    onPause: () => void
  ) => {
    if (!isNative) return;
    
    const setupListeners = async () => {
      try {
        const { App } = await import('@capacitor/app');
        
        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            onResume();
          } else {
            onPause();
          }
        });
        
        return () => {
          App.removeAllListeners();
        };
      } catch (err) {
        console.error('Failed to setup app state listeners:', err);
      }
    };
    
    setupListeners();
  };
  
  return {
    isNative,
    isPlatformIOS,
    isPlatformAndroid,
    setupDeepLinks,
    requestPushPermissions,
    onAppStateChange
  };
}