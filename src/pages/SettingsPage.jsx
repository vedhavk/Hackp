import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import { Modal, Button } from "../components/ui";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { success: toastSuccess, error: toastError } = useToast();
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

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  // Account Management Functions
  const handleExportData = () => {
    toastSuccess("Data export started. You'll receive an email when ready.");
    // In a real app, this would trigger a backend export process
    console.log("Exporting user data...");
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastError("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toastError("Password must be at least 8 characters long!");
      return;
    }
    // In a real app, this would call an API
    toastSuccess("Password changed successfully!");
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeactivateAccount = () => {
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = () => {
    toastSuccess(
      "Account deactivated. You can reactivate anytime by logging in."
    );
    setShowDeactivateModal(false);
    // In a real app, this would call an API and redirect to login
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    toastSuccess("Account deletion process initiated. This cannot be undone.");
    setShowDeleteModal(false);
    // In a real app, this would call an API and redirect to home page
  };

  // Help & Support Functions
  const handleHelpCenter = () => {
    window.open("https://help.example.com", "_blank");
    toastSuccess("Opening Help Center in new tab");
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("Support Request");
    const body = encodeURIComponent("Please describe your issue here...");
    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
    toastSuccess("Opening email client to contact support");
  };

  const handleDocumentation = () => {
    window.open("https://docs.example.com", "_blank");
    toastSuccess("Opening Documentation in new tab");
  };

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
      className={`group flex items-center justify-between py-6 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
          checked
            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
            : "bg-gray-200 dark:bg-gray-700"
        } ${
          disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const SelectField = ({ label, description, value, onChange, options }) => (
    <div className="py-6">
      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 backdrop-blur-sm"
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
    <div className="py-6">
      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <div className="flex items-center space-x-4">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer transition-all duration-300 hover:scale-110"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
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
    <div className="py-6">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </label>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
          {value}
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider transition-all duration-300"
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Elegant Header */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/40 mb-8 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-pink-600/5"></div>
            <div className="relative px-8 py-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-light">
                    Customize your experience and manage your account
                    preferences
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {savedMessage && (
                    <div className="animate-fade-in px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 text-sm rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-lg">
                      {savedMessage}
                    </div>
                  )}
                  <button
                    onClick={handleResetSettings}
                    className="px-6 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 font-semibold backdrop-blur-sm"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 font-semibold"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              {/* Appearance & Display */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 dark:from-purple-950/10 dark:via-transparent dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Appearance & Display
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <SettingToggle
                      label="Dark Mode"
                      description="Enable dark theme for better viewing in low light environments"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                    />
                    <SelectField
                      label="Language"
                      description="Choose your preferred language for the interface"
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
                        {
                          value: "UTC",
                          label: "UTC (Coordinated Universal Time)",
                        },
                        { value: "EST", label: "EST (Eastern Standard Time)" },
                        { value: "PST", label: "PST (Pacific Standard Time)" },
                        { value: "GMT", label: "GMT (Greenwich Mean Time)" },
                        { value: "JST", label: "JST (Japan Standard Time)" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Annotation Preferences */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-cyan-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Annotation Preferences
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <SettingToggle
                      label="Auto-save Annotations"
                      description="Automatically save your work while annotating to prevent data loss"
                      checked={preferences.autoSave}
                      onChange={() => handlePreferenceChange("autoSave")}
                    />
                    <SettingToggle
                      label="Compress Uploaded Images"
                      description="Reduce file size for faster uploads and optimized storage"
                      checked={preferences.compressImages}
                      onChange={() => handlePreferenceChange("compressImages")}
                    />
                    <SettingToggle
                      label="Show Tutorial Tips"
                      description="Display helpful hints and tooltips while using the application"
                      checked={preferences.showTutorials}
                      onChange={() => handlePreferenceChange("showTutorials")}
                    />
                    <ColorPicker
                      label="Default Annotation Color"
                      description="Choose the default color for new annotations and highlights"
                      value={preferences.defaultAnnotationColor}
                      onChange={(value) =>
                        handlePreferenceChange("defaultAnnotationColor", value)
                      }
                    />
                    <RangeSlider
                      label="Annotation Opacity"
                      description="Adjust the transparency level of annotation overlays"
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
                </div>
              </div>

              {/* Notifications */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-orange-50/30 dark:from-yellow-950/10 dark:via-transparent dark:to-orange-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Notification Settings
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <SettingToggle
                      label="Email Notifications"
                      description="Receive important updates and notifications via email"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange("email")}
                    />
                    <SettingToggle
                      label="Browser Notifications"
                      description="Get real-time notifications directly in your browser"
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
                      description="Get helpful reminders about incomplete annotations"
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
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-pink-50/30 dark:from-red-950/10 dark:via-transparent dark:to-pink-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Privacy & Security
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <SelectField
                      label="Profile Visibility"
                      description="Control who can see your profile information and activity"
                      value={privacy.profileVisibility}
                      onChange={(value) =>
                        setPrivacy((prev) => ({
                          ...prev,
                          profileVisibility: value,
                        }))
                      }
                      options={[
                        { value: "public", label: "Public - Anyone can view" },
                        {
                          value: "private",
                          label: "Private - Only you can view",
                        },
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
                      onChange={() =>
                        handlePrivacyChange("allowDataCollection")
                      }
                    />
                    <SettingToggle
                      label="Share Usage Statistics"
                      description="Contribute to product analytics and feature development"
                      checked={privacy.shareUsageStats}
                      onChange={() => handlePrivacyChange("shareUsageStats")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Elegant Sidebar */}
            <div className="space-y-8">
              {/* Quick Settings */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30 dark:from-indigo-950/10 dark:via-transparent dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Quick Settings
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={toggleTheme}
                      className="w-full group/quick p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-600/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {theme === "dark" ? "☀️" : "🌙"}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover/quick:text-gray-900 dark:group-hover/quick:text-white transition-colors duration-200">
                          Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className="w-full group/quick p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-600/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">🔄</div>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover/quick:text-gray-900 dark:group-hover/quick:text-white transition-colors duration-200">
                          Reset All Settings
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Management */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-teal-50/30 dark:from-emerald-950/10 dark:via-transparent dark:to-teal-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Management
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: "📥",
                        text: "Export My Data",
                        color: "blue",
                        action: handleExportData,
                      },
                      {
                        icon: "🔑",
                        text: "Change Password",
                        color: "blue",
                        action: handleChangePassword,
                      },
                      {
                        icon: "⏸️",
                        text: "Deactivate Account",
                        color: "orange",
                        action: handleDeactivateAccount,
                      },
                      {
                        icon: "🗑️",
                        text: "Delete Account",
                        color: "red",
                        action: handleDeleteAccount,
                      },
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`w-full group/account p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-600/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm ${
                          action.color === "red"
                            ? "hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20"
                            : action.color === "orange"
                            ? "hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20"
                            : "hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{action.icon}</div>
                          <span
                            className={`font-semibold transition-colors duration-200 ${
                              action.color === "red"
                                ? "text-red-600 dark:text-red-400 group-hover/account:text-red-700 dark:group-hover/account:text-red-300"
                                : action.color === "orange"
                                ? "text-orange-600 dark:text-orange-400 group-hover/account:text-orange-700 dark:group-hover/account:text-orange-300"
                                : "text-blue-600 dark:text-blue-400 group-hover/account:text-blue-700 dark:group-hover/account:text-blue-300"
                            }`}
                          >
                            {action.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Help & Support */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-purple-50/30 dark:from-violet-950/10 dark:via-transparent dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Help & Support
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: "❓",
                        text: "Help Center",
                        action: handleHelpCenter,
                      },
                      {
                        icon: "✉️",
                        text: "Contact Support",
                        action: handleContactSupport,
                      },
                      {
                        icon: "📚",
                        text: "Documentation",
                        action: handleDocumentation,
                      },
                    ].map((help, index) => (
                      <button
                        key={index}
                        onClick={help.action}
                        className="w-full group/help p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 dark:from-gray-700/30 dark:to-gray-600/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{help.icon}</div>
                          <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover/help:text-gray-900 dark:group-hover/help:text-white transition-colors duration-200">
                            {help.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit} className="flex-1">
                Change Password
              </Button>
            </div>
          </div>
        </Modal>

        {/* Account Deletion Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          size="md"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Are you absolutely sure?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                className="flex-1"
              >
                Yes, Delete Account
              </Button>
            </div>
          </div>
        </Modal>

        {/* Account Deactivation Modal */}
        <Modal
          isOpen={showDeactivateModal}
          onClose={() => setShowDeactivateModal(false)}
          title="Deactivate Account"
          size="md"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Deactivate Your Account?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your account will be temporarily deactivated. You can reactivate
                it anytime by logging in again. Your data will be preserved.
              </p>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleDeactivateConfirm}
                className="flex-1"
              >
                Deactivate Account
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
