import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '../types/settings';

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  applySettings: (settings: Settings) => void;
}

const defaultSettings: Settings = {
  general: {
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'es',
    emailNotifications: true,
    pushNotifications: true,
    systemEmails: {
      from: 'noreply@fpinnova.es',
      replyTo: 'support@fpinnova.es',
    },
  },
  appearance: {
    branding: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/2560px-Logotipo_del_Gobierno_de_Canarias.svg.png',
      appName: 'FP Innova',
      favicon: 'https://www3.gobiernodecanarias.org/medusa/mediateca/ecoescuela/wp-content/uploads/sites/2/2013/11/favicon-Gobierno-de-Canarias.png',
    },
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      headerBg: '#1e3a8a',
      sidebarBg: '#f0f9ff',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
    },
  },
  views: {
    defaultViews: {
      projects: 'list',
      users: 'list',
      convocatorias: 'list',
    },
    displayOptions: {
      showDescription: true,
      showMetadata: true,
      showThumbnails: true,
      itemsPerPage: 12,
    },
    dashboardLayout: {
      showStats: true,
      showRecentActivity: true,
      showUpcomingDeadlines: true,
      showQuickActions: true,
    },
  },
  reviews: {
    allowAdminReview: false,
    allowCoordinatorReview: false,
  },
  legal: {
    termsAndConditions: {
      content: '',
      lastUpdated: new Date().toISOString()
    },
    privacyPolicy: {
      content: '',
      lastUpdated: new Date().toISOString()
    }
  }
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => false,
  applySettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } else {
        setSettings(defaultSettings);
        applySettings(defaultSettings);
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
      applySettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      setSettings(updatedSettings);
      applySettings(updatedSettings);
      localStorage.setItem('settings', JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  const applySettings = (settings: Settings) => {
    const root = document.documentElement;
    const colors = settings.appearance.colors;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    document.title = settings.appearance.branding.appName;
    
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && settings.appearance.branding.favicon) {
      favicon.href = settings.appearance.branding.favicon;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings, applySettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};