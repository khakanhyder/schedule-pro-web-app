import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import './SplashScreen.css';

interface SplashScreenProps {
  minDisplayTime?: number;
  children: React.ReactNode;
}

export default function SplashScreen({ 
  minDisplayTime = 2000, 
  children 
}: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    
    const hideSplash = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      // Ensure minimum display time
      setTimeout(() => {
        // Fade out animation
        const splashElement = document.getElementById('app-splash-screen');
        if (splashElement) {
          splashElement.classList.add('fade-out');
          
          // Remove splash after animation completes
          setTimeout(() => {
            setShowSplash(false);
          }, 500); // Match CSS transition duration
        } else {
          setShowSplash(false);
        }
      }, remainingTime);
    };

    // Hide native splash screen on native platforms
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/splash-screen').then(({ SplashScreen }) => {
        SplashScreen.hide().finally(hideSplash);
      });
    } else {
      // For web, just use our custom splash screen
      hideSplash();
    }
  }, [minDisplayTime]);

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <>
      <div id="app-splash-screen" className="app-splash-screen">
        <div className="splash-content">
          <img 
            src="/favicon.svg" 
            alt="Scheduled Logo" 
            className="splash-logo" 
          />
          <h1 className="splash-title">Scheduled</h1>
          <p className="splash-subtitle">Professional Scheduling for All Industries</p>
          <div className="splash-loading">
            <div className="splash-spinner"></div>
          </div>
        </div>
      </div>
      <div style={{ display: 'none' }}>{children}</div>
    </>
  );
}