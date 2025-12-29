"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  User, Mail, Lock, Bell, Globe, Palette, 
  Save, LogOut, Trash2, AlertCircle, CheckCircle,
  Eye, EyeOff, Shield, Calendar
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    bookingConfirmations: true,
    cancellations: true,
    weeklyDigest: false,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "en",
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        username: session.user.email?.split('@')[0] || "",
      });
    }
    setLoading(false);
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        setSaving(false);
        return;
      }

      setSuccess("Profile updated successfully!");
      await update();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password change failed");
        setSaving(false);
        return;
      }

      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });

      if (!res.ok) {
        setError("Failed to update notifications");
        setSaving(false);
        return;
      }

      setSuccess("Notification preferences updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone. All your events and bookings will be permanently deleted.")) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== "DELETE") {
      return;
    }

    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete account");
        return;
      }

      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fadeUp">
        <h1 className="text-4xl font-bold text-text mb-2">Settings</h1>
        <p className="text-subtle text-lg">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-soft animate-fadeUp" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Profile Information</h2>
            <p className="text-sm text-subtle">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div className="group">
            <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white hover:border-brand/30"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-subtle mt-1.5">Email cannot be changed</p>
          </div>

          <div className="group">
            <label htmlFor="username" className="block text-sm font-semibold text-text mb-2">
              Username
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="username"
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white hover:border-brand/30 font-mono"
                placeholder="johndoe"
              />
            </div>
            <p className="text-xs text-subtle mt-1.5">
              Your booking URL: yoursite.com/{profileData.username}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brand text-white px-6 py-3 rounded-lg font-medium
                     hover:bg-brand-dark transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-soft animate-fadeUp" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Change Password</h2>
            <p className="text-sm text-subtle">Update your password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div className="group">
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-text mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white hover:border-brand/30"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-brand transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="group">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-text mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white hover:border-brand/30"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-brand transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="group">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full pl-11 pr-12 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white hover:border-brand/30"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-brand transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brand text-white px-6 py-3 rounded-lg font-medium
                     hover:bg-brand-dark transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-soft animate-fadeUp" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Notifications</h2>
            <p className="text-sm text-subtle">Choose what notifications you receive</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-text capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-subtle">
                  {key === 'emailReminders' && 'Get reminded about upcoming meetings'}
                  {key === 'bookingConfirmations' && 'Receive booking confirmation emails'}
                  {key === 'cancellations' && 'Get notified when meetings are cancelled'}
                  {key === 'weeklyDigest' && 'Weekly summary of your bookings'}
                </p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 
                             rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                             after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white 
                             after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 
                             after:transition-all peer-checked:bg-brand"></div>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleNotificationUpdate}
          disabled={saving}
          className="mt-6 bg-brand text-white px-6 py-3 rounded-lg font-medium
                   hover:bg-brand-dark transition-all duration-300
                   hover:-translate-y-0.5 hover:shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-soft animate-fadeUp" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
            <p className="text-sm text-subtle">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                       hover:bg-red-700 transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg
                       flex items-center gap-2 whitespace-nowrap"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 p-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}