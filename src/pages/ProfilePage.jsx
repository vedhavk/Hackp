import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
    location: "",
    website: "",
    bio: "",
  });

  const stats = {
    lastLogin: "2024-01-15T10:30:00Z",
    annotationsCount: 127,
    projectsCount: 8,
    storageUsed: "2.4 GB",
  };

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleSave = () => {
    // In a real app, this would save to backend
    setSavedMessage("Profile updated successfully!");
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Elegant Header */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/40 mb-8 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
            <div className="relative px-8 py-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Profile Settings
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-light">
                    Manage your account information and personal preferences
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Online
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Last updated: {formatDate(stats.lastLogin)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Profile Section */}
            <div className="xl:col-span-3 space-y-8">
              {/* Profile Information Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-8">
                      <div className="relative group/avatar">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-purple-500/25 transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-purple-500/40">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110">
                          <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {editForm.name || "User"}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                          {editForm.email || "user@example.com"}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Active Member
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                              Pro User
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="font-medium">
                          {isEditing ? "Cancel" : "Edit Profile"}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter your email address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Company/Organization
                          </label>
                          <input
                            type="text"
                            value={editForm.company}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                company: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="Your company or organization"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Location
                          </label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                location: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="City, Country"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Website/Portfolio
                          </label>
                          <input
                            type="url"
                            value={editForm.website}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                website: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="https://your-website.com"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Bio
                          </label>
                          <textarea
                            value={editForm.bio}
                            onChange={(e) =>
                              setEditForm({ ...editForm, bio: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>

                      {savedMessage && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-lg">
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {savedMessage}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-4 mt-8">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 font-semibold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Mode */}
                  {!isEditing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Company/Organization
                        </label>
                        <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-gray-900 dark:text-white">
                            {editForm.company || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Location
                        </label>
                        <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-gray-900 dark:text-white">
                            {editForm.location || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Website/Portfolio
                        </label>
                        <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                          {editForm.website ? (
                            <a
                              href={editForm.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {editForm.website}
                            </a>
                          ) : (
                            <p className="text-gray-900 dark:text-white">
                              Not specified
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Bio
                        </label>
                        <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 min-h-[100px]">
                          <p className="text-gray-900 dark:text-white">
                            {editForm.bio || "No bio provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/30 dark:hover:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30 dark:from-indigo-950/10 dark:via-transparent dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Stats
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Annotations
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.annotationsCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Projects
                      </span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.projectsCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Storage Used
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stats.storageUsed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
