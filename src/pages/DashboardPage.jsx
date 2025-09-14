import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Skeleton } from "../components/ui";
import DashboardLayout from "../components/DashboardLayout";
import { useToast } from "../contexts/ToastContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Simulate loading dashboard data
  const loadDashboardData = async () => {
    setLoading(true);

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStats({
      totalImages: 247,
      annotatedImages: 89,
      totalAnnotations: 156,
      recentActivity: [
        {
          id: 1,
          action: "Image uploaded",
          time: "2 minutes ago",
          image: "nature-001.jpg",
        },
        {
          id: 2,
          action: "Annotation added",
          time: "15 minutes ago",
          image: "city-042.jpg",
        },
        {
          id: 3,
          action: "Image annotated",
          time: "1 hour ago",
          image: "portrait-023.jpg",
        },
        {
          id: 4,
          action: "New collection created",
          time: "3 hours ago",
          name: "Summer 2024",
        },
      ],
    });

    setLoading(false);
  };

  // Quick action handlers
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      toast.info("Uploading image...");

      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalImages: prev.totalImages + 1,
        recentActivity: [
          {
            id: Date.now(),
            action: "Image uploaded",
            time: "Just now",
            image: file.name,
          },
          ...prev.recentActivity.slice(0, 3),
        ],
      }));

      toast.success(`Successfully uploaded ${file.name}`);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleUploadImages = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnnotating = () => {
    if (stats.totalImages === 0) {
      toast.warning("Please upload some images first before annotating");
      return;
    }
    toast.info("Navigating to annotation tool...");
    navigate("/annotations");
  };

  const handleViewGallery = () => {
    toast.info("Opening gallery...");
    navigate("/gallery");
  };

  const handleViewReports = () => {
    toast.info("Reports feature coming soon!");
  };

  const StatCard = ({
    title,
    value,
    icon,
    color = "blue",
    loading = false,
  }) => (
    <Card hover className="overflow-hidden">
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center`}
        >
          {loading ? (
            <Skeleton variant="rectangular" width={24} height={24} />
          ) : (
            <div className={`text-${color}-600 dark:text-${color}-400`}>
              {icon}
            </div>
          )}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          {loading ? (
            <Skeleton variant="text" width="60%" height="1.5rem" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-blue-100">
            Here's what's happening with your photo collection today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Images"
            value={loading ? "" : stats?.totalImages.toLocaleString()}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            color="blue"
          />

          <StatCard
            title="Annotated Images"
            value={loading ? "" : stats?.annotatedImages.toLocaleString()}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
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
            }
            color="green"
          />

          <StatCard
            title="Total Annotations"
            value={loading ? "" : stats?.totalAnnotations.toLocaleString()}
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
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
            }
            color="purple"
          />

          <StatCard
            title="Completion Rate"
            value={
              loading
                ? ""
                : `${Math.round(
                    (stats?.annotatedImages / stats?.totalImages) * 100
                  )}%`
            }
            loading={loading}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            color="orange"
          />
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                View all
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton variant="circular" width={32} height={32} />
                    <div className="flex-1">
                      <Skeleton variant="text" width="80%" height="1rem" />
                      <Skeleton variant="text" width="60%" height="0.75rem" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.image || activity.name} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleUploadImages}
                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Upload Images
                </span>
              </button>

              <button
                onClick={handleStartAnnotating}
                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                  Start Annotating
                </span>
              </button>

              <button
                onClick={handleViewGallery}
                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  View Gallery
                </span>
              </button>

              <button
                onClick={handleViewReports}
                className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-300">
                  View Reports
                </span>
              </button>
            </div>

            {/* Hidden file input for image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
