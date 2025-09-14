import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { Card } from "../components/ui";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    annotationReminders: true,
    weeklyReports: false,
  });

  const [preferences, setPreferences] = useState({
    autoSave: true,
    compressImages: false,
    showTutorials: true,
    defaultAnnotationColor: "#3B82F6",
    annotationOpacity: 70,
    language: "en",
    timezone: "UTC",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    allowDataCollection: true,
    shareUsageStats: false,
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    setSavedMessage("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setNotifications({
        email: true,
        push: false,
        updates: true,
        annotationReminders: true,
        weeklyReports: false,
      });
      setPreferences({
        autoSave: true,
        compressImages: false,
        showTutorials: true,
        defaultAnnotationColor: "#3B82F6",
        annotationOpacity: 70,
        language: "en",
        timezone: "UTC",
      });
      setPrivacy({
        profileVisibility: "public",
        showEmail: false,
        allowDataCollection: true,
        shareUsageStats: false,
      });
      setSavedMessage("Settings reset to default!");
    }
  };

  const SettingToggle = ({
    label,
    description,
    checked,
    onChange,
    disabled = false,
  }) => (
    <div
      className={`flex items-center justify-between py-4 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const SelectField = ({ label, description, value, onChange, options }) => (
    <div className="py-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const ColorPicker = ({ label, description, value, onChange }) => (
    <div className="py-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
          {value}
        </span>
      </div>
    </div>
  );

  const RangeSlider = ({
    label,
    description,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = "",
  }) => (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your experience and manage your account preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {savedMessage && (
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-lg">
                {savedMessage}
              </div>
            )}
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save All Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Appearance */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance & Display
                </h2>
              </div>
              <div className="space-y-1">
                <SettingToggle
                  label="Dark Mode"
                  description="Enable dark theme for better viewing in low light"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
                <SelectField
                  label="Language"
                  description="Choose your preferred language"
                  value={preferences.language}
                  onChange={(value) =>
                    handlePreferenceChange("language", value)
                  }
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                    { value: "de", label: "Deutsch" },
                    { value: "zh", label: "中文" },
                  ]}
                />
                <SelectField
                  label="Timezone"
                  description="Set your local timezone for accurate timestamps"
                  value={preferences.timezone}
                  onChange={(value) =>
                    handlePreferenceChange("timezone", value)
                  }
                  options={[
                    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                    { value: "EST", label: "EST (Eastern Standard Time)" },
                    { value: "PST", label: "PST (Pacific Standard Time)" },
                    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
                    { value: "JST", label: "JST (Japan Standard Time)" },
                  ]}
                />
              </div>
            </Card>

            {/* Annotation Preferences */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Annotation Preferences
                </h2>
              </div>
              <div className="space-y-1">
                <SettingToggle
                  label="Auto-save Annotations"
                  description="Automatically save your work while annotating"
                  checked={preferences.autoSave}
                  onChange={() => handlePreferenceChange("autoSave")}
                />
                <SettingToggle
                  label="Compress Uploaded Images"
                  description="Reduce file size for faster uploads and storage"
                  checked={preferences.compressImages}
                  onChange={() => handlePreferenceChange("compressImages")}
                />
                <SettingToggle
                  label="Show Tutorial Tips"
                  description="Display helpful hints and tooltips while using the app"
                  checked={preferences.showTutorials}
                  onChange={() => handlePreferenceChange("showTutorials")}
                />
                <ColorPicker
                  label="Default Annotation Color"
                  description="Choose the default color for new annotations"
                  value={preferences.defaultAnnotationColor}
                  onChange={(value) =>
                    handlePreferenceChange("defaultAnnotationColor", value)
                  }
                />
                <RangeSlider
                  label="Annotation Opacity"
                  description="Adjust the transparency of annotation overlays"
                  value={preferences.annotationOpacity}
                  onChange={(value) =>
                    handlePreferenceChange("annotationOpacity", value)
                  }
                  min={10}
                  max={100}
                  step={5}
                  unit="%"
                />
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4 19h9m-4-8a3 3 0 100-6 3 3 0 000 6zm-8-1h8a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
              </div>
              <div className="space-y-1">
                <SettingToggle
                  label="Email Notifications"
                  description="Receive important updates and notifications via email"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange("email")}
                />
                <SettingToggle
                  label="Browser Notifications"
                  description="Get real-time notifications in your browser"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange("push")}
                />
                <SettingToggle
                  label="Product Updates"
                  description="Stay informed about new features and improvements"
                  checked={notifications.updates}
                  onChange={() => handleNotificationChange("updates")}
                />
                <SettingToggle
                  label="Annotation Reminders"
                  description="Get reminders about incomplete annotations"
                  checked={notifications.annotationReminders}
                  onChange={() =>
                    handleNotificationChange("annotationReminders")
                  }
                />
                <SettingToggle
                  label="Weekly Reports"
                  description="Receive weekly summaries of your annotation activity"
                  checked={notifications.weeklyReports}
                  onChange={() => handleNotificationChange("weeklyReports")}
                />
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>
              <div className="space-y-1">
                <SelectField
                  label="Profile Visibility"
                  description="Control who can see your profile information"
                  value={privacy.profileVisibility}
                  onChange={(value) =>
                    setPrivacy((prev) => ({
                      ...prev,
                      profileVisibility: value,
                    }))
                  }
                  options={[
                    { value: "public", label: "Public - Anyone can view" },
                    { value: "private", label: "Private - Only you can view" },
                    { value: "friends", label: "Friends Only" },
                  ]}
                />
                <SettingToggle
                  label="Show Email Address"
                  description="Display your email address on your public profile"
                  checked={privacy.showEmail}
                  onChange={() => handlePrivacyChange("showEmail")}
                />
                <SettingToggle
                  label="Allow Data Collection"
                  description="Help improve our service by sharing anonymized usage data"
                  checked={privacy.allowDataCollection}
                  onChange={() => handlePrivacyChange("allowDataCollection")}
                />
                <SettingToggle
                  label="Share Usage Statistics"
                  description="Contribute to product analytics and feature development"
                  checked={privacy.shareUsageStats}
                  onChange={() => handlePrivacyChange("shareUsageStats")}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Settings
              </h3>
              <div className="space-y-4">
                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                      />
                    </svg>
                    Reset All Settings
                  </div>
                </button>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Management
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export My Data
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Change Password
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Deactivate Account
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Account
                  </div>
                </button>
              </div>
            </Card>

            {/* Help & Support */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Help & Support
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Help Center
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Support
                  </div>
                </button>
                <button className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Documentation
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
