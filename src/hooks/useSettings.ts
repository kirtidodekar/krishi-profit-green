import { useState, useEffect, useCallback } from "react";

export interface UserSettings {
  // Profile
  displayName: string;
  phone: string;
  email: string;
  language: "en" | "hi" | "mr" | "ta";
  
  // Notifications
  masterNotifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  promotionalAlerts: boolean;
  priceAlerts: boolean;
  orderUpdates: boolean;
  
  // Privacy
  hidePhoneNumber: boolean;
  hideLocation: boolean;
  hideEarnings: boolean;
  
  // Preferences
  darkMode: boolean;
  autoDetectLocation: boolean;
  voiceInput: boolean;
  biometricLogin: boolean;
  
  // Data
  autoSync: boolean;
  offlineMode: boolean;
}

const defaultSettings: UserSettings = {
  displayName: "Ramesh Kumar",
  phone: "+91 98765 43210",
  email: "ramesh@example.com",
  language: "en",
  
  masterNotifications: true,
  pushNotifications: true,
  emailNotifications: false,
  smsNotifications: true,
  promotionalAlerts: false,
  priceAlerts: true,
  orderUpdates: true,
  
  hidePhoneNumber: false,
  hideLocation: false,
  hideEarnings: true,
  
  darkMode: false,
  autoDetectLocation: true,
  voiceInput: true,
  biometricLogin: false,
  
  autoSync: true,
  offlineMode: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingFields, setSavingFields] = useState<Set<keyof UserSettings>>(new Set());

  // Simulate GET request on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const saved = localStorage.getItem("krishi-settings");
      if (saved) {
        setSettings(JSON.parse(saved));
      } else {
        setSettings(defaultSettings);
      }
      setIsLoading(false);
    };
    
    fetchSettings();
  }, []);

  // Simulate PATCH request
  const updateSetting = useCallback(async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<boolean> => {
    if (!settings) return false;
    
    setSavingFields((prev) => new Set(prev).add(key));
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("krishi-settings", JSON.stringify(newSettings));
    
    // Remove from saving set after brief delay for animation
    setTimeout(() => {
      setSavingFields((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 1500);
    
    return true;
  }, [settings]);

  const updateMultipleSettings = useCallback(async (
    updates: Partial<UserSettings>
  ): Promise<boolean> => {
    if (!settings) return false;
    
    const keys = Object.keys(updates) as (keyof UserSettings)[];
    keys.forEach((key) => {
      setSavingFields((prev) => new Set(prev).add(key));
    });
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem("krishi-settings", JSON.stringify(newSettings));
    
    setTimeout(() => {
      setSavingFields((prev) => {
        const next = new Set(prev);
        keys.forEach((key) => next.delete(key));
        return next;
      });
    }, 1500);
    
    return true;
  }, [settings]);

  // Hard enforcement: nullify hidden data
  const getPublicProfile = useCallback(() => {
    if (!settings) return null;
    
    return {
      displayName: settings.displayName,
      phone: settings.hidePhoneNumber ? null : settings.phone,
      location: settings.hideLocation ? null : "Village Rampur, Varanasi",
      earnings: settings.hideEarnings ? null : "₹2.4L",
    };
  }, [settings]);

  return {
    settings,
    isLoading,
    savingFields,
    updateSetting,
    updateMultipleSettings,
    getPublicProfile,
  };
};
