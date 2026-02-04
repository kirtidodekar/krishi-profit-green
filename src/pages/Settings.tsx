import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  BellOff,
  MessageSquare,
  Mail,
  Smartphone,
  Tag,
  TrendingUp,
  Package,
  Eye,
  EyeOff,
  MapPin,
  Wallet,
  Globe,
  Mic,
  Fingerprint,
  RefreshCw,
  WifiOff,
  ChevronRight,
  User,
  Phone,
  AtSign,
  Shield,
  Database,
  Palette,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import SettingItem from "@/components/settings/SettingItem";
import SettingSection from "@/components/settings/SettingSection";
import SettingSkeleton from "@/components/settings/SettingSkeleton";
import { useSettings, UserSettings } from "@/hooks/useSettings";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { settings, isLoading, savingFields, updateSetting } = useSettings();
  const { vibrate, vibrateOnToggle } = useHapticFeedback();
  const { theme, toggleTheme } = useTheme();
  const [recentlySaved, setRecentlySaved] = useState<Set<keyof UserSettings>>(new Set());

  // Track recently saved fields for animation
  useEffect(() => {
    savingFields.forEach((field) => {
      if (!savingFields.has(field)) {
        setRecentlySaved((prev) => new Set(prev).add(field));
        setTimeout(() => {
          setRecentlySaved((prev) => {
            const next = new Set(prev);
            next.delete(field);
            return next;
          });
        }, 2000);
      }
    });
  }, [savingFields]);

  const handleToggle = async (key: keyof UserSettings, value: boolean) => {
    vibrateOnToggle(value);
    
    // Special handling for dark mode
    if (key === "darkMode") {
      toggleTheme();
    }
    
    await updateSetting(key, value);

    // If master notifications is turned off, disable all sub-notifications
    if (key === "masterNotifications" && !value && settings) {
      await updateSetting("pushNotifications", false);
      await updateSetting("emailNotifications", false);
      await updateSetting("smsNotifications", false);
      await updateSetting("promotionalAlerts", false);
      await updateSetting("priceAlerts", false);
      await updateSetting("orderUpdates", false);
    }
  };

  const isSaving = (key: keyof UserSettings) => savingFields.has(key);
  const isSaved = (key: keyof UserSettings) => recentlySaved.has(key);

  if (isLoading || !settings) {
    return (
      <MobileLayout>
        <AppHeader title="Settings" showBack />
        <div className="px-4 py-4">
          <SettingSkeleton />
        </div>
      </MobileLayout>
    );
  }

  const notificationsDisabled = !settings.masterNotifications;

  return (
    <MobileLayout>
      <AppHeader title="Settings" showBack />

      <div className="px-4 py-4 space-y-6 pb-28">
        {/* Appearance Section */}
        <SettingSection title="Appearance">
          <SettingItem
            icon={theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            label="Dark Mode"
            description={theme === "dark" ? "Using dark theme" : "Using light theme"}
            type="toggle"
            value={settings.darkMode}
            onChange={(v) => handleToggle("darkMode", v as boolean)}
            isSaving={isSaving("darkMode")}
            isSaved={isSaved("darkMode")}
            iconBgColor={theme === "dark" ? "bg-accent/20" : "bg-primary/10"}
          />
          
          <SettingItem
            icon={<Globe className="w-5 h-5" />}
            label="Language"
            description={languages.find((l) => l.code === settings.language)?.label}
            type="link"
            onClick={() => vibrate("light")}
            rightContent={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
          />
        </SettingSection>

        {/* Account Section */}
        <SettingSection title="Account">
          <SettingItem
            icon={<User className="w-5 h-5" />}
            label="Display Name"
            description={settings.displayName}
            type="link"
            onClick={() => vibrate("light")}
            isSaving={isSaving("displayName")}
            isSaved={isSaved("displayName")}
            rightContent={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
          />
          
          <SettingItem
            icon={<Phone className="w-5 h-5" />}
            label="Phone Number"
            description={settings.phone}
            type="link"
            onClick={() => vibrate("light")}
            isSaving={isSaving("phone")}
            isSaved={isSaved("phone")}
            rightContent={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
          />
          
          <SettingItem
            icon={<AtSign className="w-5 h-5" />}
            label="Email Address"
            description={settings.email}
            type="link"
            onClick={() => vibrate("light")}
            isSaving={isSaving("email")}
            isSaved={isSaved("email")}
            rightContent={<ChevronRight className="w-5 h-5 text-muted-foreground" />}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingItem
            icon={settings.masterNotifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            label="All Notifications"
            description="Master control for all alerts"
            type="toggle"
            value={settings.masterNotifications}
            onChange={(v) => handleToggle("masterNotifications", v as boolean)}
            isSaving={isSaving("masterNotifications")}
            isSaved={isSaved("masterNotifications")}
            iconBgColor={settings.masterNotifications ? "bg-primary/10" : "bg-destructive/10"}
          />
        </SettingSection>

        {/* Sub-notifications - Collapsible */}
        <SettingSection 
          title="Notification Preferences" 
          isCollapsed={notificationsDisabled}
        >
          <SettingItem
            icon={<Smartphone className="w-5 h-5" />}
            label="Push Notifications"
            description="Instant alerts on your phone"
            type="toggle"
            value={settings.pushNotifications}
            onChange={(v) => handleToggle("pushNotifications", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("pushNotifications")}
            isSaved={isSaved("pushNotifications")}
          />
          
          <SettingItem
            icon={<Mail className="w-5 h-5" />}
            label="Email Notifications"
            description="Weekly summaries & updates"
            type="toggle"
            value={settings.emailNotifications}
            onChange={(v) => handleToggle("emailNotifications", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("emailNotifications")}
            isSaved={isSaved("emailNotifications")}
          />
          
          <SettingItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="SMS Notifications"
            description="Important alerts via text"
            type="toggle"
            value={settings.smsNotifications}
            onChange={(v) => handleToggle("smsNotifications", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("smsNotifications")}
            isSaved={isSaved("smsNotifications")}
          />
          
          <SettingItem
            icon={<Tag className="w-5 h-5" />}
            label="Promotional Alerts"
            description="Special offers & discounts"
            type="toggle"
            value={settings.promotionalAlerts}
            onChange={(v) => handleToggle("promotionalAlerts", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("promotionalAlerts")}
            isSaved={isSaved("promotionalAlerts")}
          />
          
          <SettingItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="Price Alerts"
            description="When waste prices change"
            type="toggle"
            value={settings.priceAlerts}
            onChange={(v) => handleToggle("priceAlerts", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("priceAlerts")}
            isSaved={isSaved("priceAlerts")}
          />
          
          <SettingItem
            icon={<Package className="w-5 h-5" />}
            label="Order Updates"
            description="Pickup & payment status"
            type="toggle"
            value={settings.orderUpdates}
            onChange={(v) => handleToggle("orderUpdates", v as boolean)}
            disabled={notificationsDisabled}
            isSaving={isSaving("orderUpdates")}
            isSaved={isSaved("orderUpdates")}
          />
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection title="Privacy">
          <SettingItem
            icon={settings.hidePhoneNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            label="Hide Phone Number"
            description="From buyers until you accept"
            type="toggle"
            value={settings.hidePhoneNumber}
            onChange={(v) => handleToggle("hidePhoneNumber", v as boolean)}
            isSaving={isSaving("hidePhoneNumber")}
            isSaved={isSaved("hidePhoneNumber")}
            iconBgColor="bg-secondary/10"
          />
          
          <SettingItem
            icon={<MapPin className="w-5 h-5" />}
            label="Hide Location"
            description="Show only district, not village"
            type="toggle"
            value={settings.hideLocation}
            onChange={(v) => handleToggle("hideLocation", v as boolean)}
            isSaving={isSaving("hideLocation")}
            isSaved={isSaved("hideLocation")}
            iconBgColor="bg-secondary/10"
          />
          
          <SettingItem
            icon={<Wallet className="w-5 h-5" />}
            label="Hide Earnings"
            description="Keep total earnings private"
            type="toggle"
            value={settings.hideEarnings}
            onChange={(v) => handleToggle("hideEarnings", v as boolean)}
            isSaving={isSaving("hideEarnings")}
            isSaved={isSaved("hideEarnings")}
            iconBgColor="bg-secondary/10"
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon={<MapPin className="w-5 h-5" />}
            label="Auto-detect Location"
            description="Use GPS for waste pickup"
            type="toggle"
            value={settings.autoDetectLocation}
            onChange={(v) => handleToggle("autoDetectLocation", v as boolean)}
            isSaving={isSaving("autoDetectLocation")}
            isSaved={isSaved("autoDetectLocation")}
          />
          
          <SettingItem
            icon={<Mic className="w-5 h-5" />}
            label="Voice Input"
            description="Speak to add waste details"
            type="toggle"
            value={settings.voiceInput}
            onChange={(v) => handleToggle("voiceInput", v as boolean)}
            isSaving={isSaving("voiceInput")}
            isSaved={isSaved("voiceInput")}
          />
          
          <SettingItem
            icon={<Fingerprint className="w-5 h-5" />}
            label="Biometric Login"
            description="Use fingerprint to sign in"
            type="toggle"
            value={settings.biometricLogin}
            onChange={(v) => handleToggle("biometricLogin", v as boolean)}
            isSaving={isSaving("biometricLogin")}
            isSaved={isSaved("biometricLogin")}
          />
        </SettingSection>

        {/* Data & Sync Section */}
        <SettingSection title="Data & Sync">
          <SettingItem
            icon={<RefreshCw className="w-5 h-5" />}
            label="Auto Sync"
            description="Keep data updated automatically"
            type="toggle"
            value={settings.autoSync}
            onChange={(v) => handleToggle("autoSync", v as boolean)}
            isSaving={isSaving("autoSync")}
            isSaved={isSaved("autoSync")}
          />
          
          <SettingItem
            icon={<WifiOff className="w-5 h-5" />}
            label="Offline Mode"
            description="Save data for areas with no network"
            type="toggle"
            value={settings.offlineMode}
            onChange={(v) => handleToggle("offlineMode", v as boolean)}
            isSaving={isSaving("offlineMode")}
            isSaved={isSaved("offlineMode")}
          />
        </SettingSection>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Privacy Protection</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When privacy toggles are ON, your data is hidden from buyers until you explicitly share it.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/10 border border-accent/20 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Data Sync</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your settings are automatically synced across all your devices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Settings;
