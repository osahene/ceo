"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/store/store";
import { setDarkMode } from "../../lib/store/slices/uiSlice";
import {
  Settings as SettingsIcon,
  Bell,
  Database,
  Users,
  CreditCard,
  Save,
  Moon,
  Sun,
  Shield,
  Upload,
} from "lucide-react";

interface Settings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingAlerts: boolean;
  maintenanceAlerts: boolean;
  paymentReminders: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  defaultBookingDuration: number;
  advanceBookingLimit: number;
  cancellationPolicy: string;
  lateReturnFee: number;
  cleaningFee: number;
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  cashEnabled: boolean;
  bankTransferEnabled: boolean;
  taxRate: number;
  autoBackup: boolean;
  backupFrequency: string;
  dataRetention: number;
}

// const notificationKeys: Array<
//   keyof Pick<
//     Settings,
//     | "emailNotifications"
//     | "smsNotifications"
//     | "bookingAlerts"
//     | "maintenanceAlerts"
//     | "paymentReminders"
//   >
// > = [
//   "emailNotifications",
//   "smsNotifications",
//   "bookingAlerts",
//   "maintenanceAlerts",
//   "paymentReminders",
// ];

const paymentKeys: Array<
  keyof Pick<
    Settings,
    "stripeEnabled" | "paypalEnabled" | "cashEnabled" | "bankTransferEnabled"
  >
> = ["stripeEnabled", "paypalEnabled", "cashEnabled", "bankTransferEnabled"];

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    companyName: "YOS Rentals",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",

    emailNotifications: true,
    smsNotifications: true,
    bookingAlerts: true,
    maintenanceAlerts: true,
    paymentReminders: true,

    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,

    defaultBookingDuration: 7,
    advanceBookingLimit: 365,
    cancellationPolicy: "flexible",
    lateReturnFee: 50,
    cleaningFee: 25,

    stripeEnabled: true,
    paypalEnabled: true,
    cashEnabled: true,
    bankTransferEnabled: false,
    taxRate: 8.5,

    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
  });

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Australia/Sydney",
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "AU$", name: "Australian Dollar" },
  ];

  const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD MMM YYYY"];

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Settings saved successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to save settings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "yos-rentals-settings.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            System Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your rental management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          {darkMode ? (
            <Moon className="w-6 h-6 text-purple-500 mr-2" />
          ) : (
            <Sun className="w-6 h-6 text-yellow-500 mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Appearance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme Mode
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => dispatch(setDarkMode(false))}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  !darkMode
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Sun
                  className={`w-5 h-5 mx-auto mb-2 ${
                    !darkMode ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    !darkMode
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Light
                </span>
              </button>
              <button
                onClick={() => dispatch(setDarkMode(true))}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  darkMode
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <Moon
                  className={`w-5 h-5 mx-auto mb-2 ${
                    darkMode ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    darkMode
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Dark
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            General Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) =>
                setSettings({ ...settings, companyName: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) =>
                setSettings({ ...settings, dateFormat: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications" },
            { key: "smsNotifications", label: "SMS Notifications" },
            { key: "bookingAlerts", label: "Booking Alerts" },
            { key: "maintenanceAlerts", label: "Maintenance Alerts" },
            { key: "paymentReminders", label: "Payment Reminders" },
          ].map((notification) => (
            <label
              key={notification.key}
              className="flex items-center justify-between"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {notification.label}
              </span>
              <input
                type="checkbox"
                checked={(settings as any)[notification.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [notification.key]: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Security
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) =>
                  setSettings({ ...settings, twoFactorAuth: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Two-Factor Authentication
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
              min="5"
              max="480"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password Expiry (days)
            </label>
            <input
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordExpiry: parseInt(e.target.value),
                })
              }
              min="30"
              max="365"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rental Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <Users className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Rental Policies
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Booking Duration (days)
            </label>
            <input
              type="number"
              value={settings.defaultBookingDuration}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultBookingDuration: parseInt(e.target.value),
                })
              }
              min="1"
              max="30"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Advance Booking Limit (days)
            </label>
            <input
              type="number"
              value={settings.advanceBookingLimit}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  advanceBookingLimit: parseInt(e.target.value),
                })
              }
              min="1"
              max="730"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Late Return Fee ($)
            </label>
            <input
              type="number"
              value={settings.lateReturnFee}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  lateReturnFee: parseFloat(e.target.value),
                })
              }
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cleaning Fee ($)
            </label>
            <input
              type="number"
              value={settings.cleaningFee}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cleaningFee: parseFloat(e.target.value),
                })
              }
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cancellation Policy
            </label>
            <select
              value={settings.cancellationPolicy}
              onChange={(e) =>
                setSettings({ ...settings, cancellationPolicy: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="flexible">
                Flexible (Full refund 24h before)
              </option>
              <option value="moderate">
                Moderate (Full refund 48h before)
              </option>
              <option value="strict">Strict (50% refund 7 days before)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  taxRate: parseFloat(e.target.value),
                })
              }
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Payment Methods
          </h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "stripeEnabled", label: "Credit/Debit Card (Stripe)" },
            { key: "paypalEnabled", label: "PayPal" },
            { key: "cashEnabled", label: "Cash" },
            { key: "bankTransferEnabled", label: "Bank Transfer" },
          ].map((method) => (
            <label
              key={method.key}
              className="flex items-center justify-between"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {method.label}
              </span>
              <input
                type="checkbox"
                checked={(settings as any)[method.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [method.key]: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div> */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Payment Methods</h3>
        </div>

        <div className="space-y-4">
          {paymentKeys.map((key) => (
            <label key={key} className="flex justify-between">
              <span>{key.replace(/Enabled$/, "")}</span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => updateSetting(key, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Data & Backup */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <Database className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Data & Backup
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) =>
                  setSettings({ ...settings, autoBackup: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Automatic Backups
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) =>
                setSettings({ ...settings, backupFrequency: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Retention (days)
            </label>
            <input
              type="number"
              value={settings.dataRetention}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dataRetention: parseInt(e.target.value),
                })
              }
              min="30"
              max="1095"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
