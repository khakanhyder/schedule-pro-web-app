import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  cardBackground: string;
  borderColor: string;
}

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  applyTheme: (themeId: string, industryId: string) => void;
}

const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  primaryColor: '#3B82F6',
  accentColor: '#EFF6FF', 
  textColor: '#1F2937',
  backgroundColor: '#FFFFFF',
  cardBackground: '#F9FAFB',
  borderColor: '#E5E7EB'
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: defaultTheme,
  setTheme: () => {},
  applyTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('selectedTheme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const setTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
    applyCSSVariables(theme);
  };

  const applyCSSVariables = (theme: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-card', theme.cardBackground);
    root.style.setProperty('--color-border', theme.borderColor);
  };

  const getThemeConfig = (themeId: string, industryId: string): ThemeConfig => {
    const themeConfigs: Record<string, Record<string, ThemeConfig>> = {
      beauty: {
        'feminine-elegant': {
          id: 'feminine-elegant',
          name: 'Feminine & Elegant',
          primaryColor: '#EC4899',
          accentColor: '#FDF2F8',
          textColor: '#831843',
          backgroundColor: '#FFFBFF',
          cardBackground: '#FEF7FF',
          borderColor: '#F9A8D4'
        },
        'luxury-spa': {
          id: 'luxury-spa', 
          name: 'Luxury Spa',
          primaryColor: '#8B5CF6',
          accentColor: '#F3E8FF',
          textColor: '#581C87',
          backgroundColor: '#FEFBFF',
          cardBackground: '#FAF5FF',
          borderColor: '#C4B5FD'
        },
        'modern-clean': {
          id: 'modern-clean',
          name: 'Modern Clean',
          primaryColor: '#EC4899',
          accentColor: '#F8FAFC',
          textColor: '#1E293B',
          backgroundColor: '#FFFFFF',
          cardBackground: '#F8FAFC',
          borderColor: '#E2E8F0'
        }
      },
      trades: {
        'industrial-strong': {
          id: 'industrial-strong',
          name: 'Industrial Strong',
          primaryColor: '#EA580C',
          accentColor: '#FFF7ED',
          textColor: '#9A3412',
          backgroundColor: '#FFFBF5',
          cardBackground: '#FEF3C7',
          borderColor: '#FED7AA'
        },
        'professional-blue': {
          id: 'professional-blue',
          name: 'Professional Blue',
          primaryColor: '#2563EB',
          accentColor: '#EFF6FF',
          textColor: '#1E40AF',
          backgroundColor: '#F8FAFC',
          cardBackground: '#F1F5F9',
          borderColor: '#CBD5E1'
        },
        'construction-yellow': {
          id: 'construction-yellow',
          name: 'Construction Yellow',
          primaryColor: '#F59E0B',
          accentColor: '#FFFBEB',
          textColor: '#92400E',
          backgroundColor: '#FEFDF8',
          cardBackground: '#FEF3C7',
          borderColor: '#FCD34D'
        }
      },
      wellness: {
        'natural-green': {
          id: 'natural-green',
          name: 'Natural Green',
          primaryColor: '#10B981',
          accentColor: '#ECFDF5',
          textColor: '#065F46',
          backgroundColor: '#F7FFFE',
          cardBackground: '#F0FDF4',
          borderColor: '#A7F3D0'
        },
        'calming-blue': {
          id: 'calming-blue',
          name: 'Calming Blue',
          primaryColor: '#06B6D4',
          accentColor: '#ECFEFF',
          textColor: '#164E63',
          backgroundColor: '#F7FFFE',
          cardBackground: '#F0F9FF',
          borderColor: '#7DD3FC'
        },
        'peaceful-lavender': {
          id: 'peaceful-lavender',
          name: 'Peaceful Lavender',
          primaryColor: '#8B5CF6',
          accentColor: '#F5F3FF',
          textColor: '#5B21B6',
          backgroundColor: '#FDFCFF',
          cardBackground: '#F5F3FF',
          borderColor: '#C4B5FD'
        }
      },
      'pet-care': {
        'playful-orange': {
          id: 'playful-orange',
          name: 'Playful Orange',
          primaryColor: '#F97316',
          accentColor: '#FFF7ED',
          textColor: '#9A3412',
          backgroundColor: '#FFFBF5',
          cardBackground: '#FFEDD5',
          borderColor: '#FDBA74'
        },
        'friendly-green': {
          id: 'friendly-green',
          name: 'Friendly Green',
          primaryColor: '#22C55E',
          accentColor: '#F0FDF4',
          textColor: '#166534',
          backgroundColor: '#F7FFFE',
          cardBackground: '#DCFCE7',
          borderColor: '#86EFAC'
        },
        'warm-yellow': {
          id: 'warm-yellow',
          name: 'Warm Yellow',
          primaryColor: '#EAB308',
          accentColor: '#FEFCE8',
          textColor: '#854D0E',
          backgroundColor: '#FEFDF8',
          cardBackground: '#FEF9C3',
          borderColor: '#FDE047'
        }
      },
      creative: {
        'artistic-purple': {
          id: 'artistic-purple',
          name: 'Artistic Purple',
          primaryColor: '#9333EA',
          accentColor: '#FAF5FF',
          textColor: '#581C87',
          backgroundColor: '#FEFBFF',
          cardBackground: '#F3E8FF',
          borderColor: '#C4B5FD'
        },
        'vibrant-pink': {
          id: 'vibrant-pink',
          name: 'Vibrant Pink',
          primaryColor: '#EC4899',
          accentColor: '#FDF2F8',
          textColor: '#831843',
          backgroundColor: '#FFFBFF',
          cardBackground: '#FCE7F3',
          borderColor: '#F9A8D4'
        },
        'elegant-black': {
          id: 'elegant-black',
          name: 'Elegant Black',
          primaryColor: '#1F2937',
          accentColor: '#F9FAFB',
          textColor: '#111827',
          backgroundColor: '#FFFFFF',
          cardBackground: '#F3F4F6',
          borderColor: '#D1D5DB'
        }
      }
    };

    return themeConfigs[industryId]?.[themeId] || defaultTheme;
  };

  const applyTheme = (themeId: string, industryId: string) => {
    const theme = getThemeConfig(themeId, industryId);
    setTheme(theme);
  };

  useEffect(() => {
    applyCSSVariables(currentTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};