import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Skeleton } from "../components/ui";
import DashboardLayout from "../components/DashboardLayout";
import { useToast } from "../contexts/ToastContext";
import { mockUploadedImages } from "../utils/mockApi";

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
          type: "upload",
        },
        {
          id: 2,
          action: "Annotation added",
          time: "15 minutes ago",
          image: "city-042.jpg",
          type: "annotation",
        },
        {
          id: 3,
          action: "Image annotated",
          time: "1 hour ago",
          image: "portrait-023.jpg",
          type: "annotation",
        },
        {
          id: 4,
          action: "New collection created",
          time: "3 hours ago",
          name: "Summer 2024",
          type: "collection",
        },
        {
          id: 5,
          action: "Gallery viewed",
          time: "4 hours ago",
          image: "landscape-015.jpg",
          type: "view",
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

      // Convert file to base64 data URL
      const reader = new FileReader();

      const imageData = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          resolve({
            id: `upload_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            url: e.target.result,
            filename: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            type: "uploaded",
          });
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Actually save the image using the API
      await mockUploadedImages.saveImage(imageData);

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
            type: "upload",
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
      console.error("Upload error:", error);
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
    toast.info("Opening analytics dashboard...");
    navigate("/analytics");
  };

  const handleActivityClick = (activity) => {
    // Navigate based on activity type
    switch (activity.type || "default") {
      case "upload":
        toast.info(`Opening uploaded image: ${activity.image}`);
        navigate("/gallery");
        break;
      case "annotation":
        if (activity.image) {
          toast.info(`Opening annotated image: ${activity.image}`);
          navigate("/upload"); // Go to upload page where they can view/edit annotations
        } else {
          navigate("/annotations");
        }
        break;
      case "collection":
        toast.info(`Opening collection: ${activity.name}`);
        navigate("/gallery");
        break;
      case "view":
        toast.info(`Opening gallery`);
        navigate("/gallery");
        break;
      default:
        // Fallback navigation based on action text
        if (activity.action.includes("uploaded")) {
          toast.info(`Opening uploaded image: ${activity.image}`);
          navigate("/gallery");
        } else if (
          activity.action.includes("annotation") ||
          activity.action.includes("annotated")
        ) {
          toast.info(`Opening annotated image: ${activity.image}`);
          navigate("/upload");
        } else if (activity.action.includes("collection")) {
          toast.info(`Opening collection: ${activity.name}`);
          navigate("/gallery");
        } else {
          navigate("/gallery");
        }
        break;
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color = "blue",
    loading = false,
    trend = null,
    subtitle = null,
  }) => (
    <Card hover className="overflow-hidden group relative">
      {/* Gradient background overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${color}-50/50 to-transparent dark:from-${color}-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br from-${color}-500 to-${color}-600 dark:from-${color}-600 dark:to-${color}-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {loading ? (
              <Skeleton variant="rectangular" width={28} height={28} />
            ) : (
              <div className="text-white text-lg">{icon}</div>
            )}
          </div>

          {trend && (
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                trend > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    trend > 0
                      ? "M7 17l9.2-9.2M17 17V7h-10"
                      : "M7 7l9.2 9.2M17 7v10H7"
                  }
                />
              </svg>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
            {title}
          </h3>
          {loading ? (
            <Skeleton variant="text" width="70%" height="2rem" />
          ) : (
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-${color}-500/20 via-transparent to-${color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl text-white shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-16 right-0 w-24 h-24 bg-white rounded-full translate-x-12"></div>
            <div className="absolute bottom-0 right-16 w-40 h-40 bg-white rounded-full translate-y-20"></div>
          </div>

          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">
                      Welcome back, {user?.name || "User"}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Your annotation workspace is ready to go
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats?.totalImages || 0}
                    </div>
                    <div className="text-sm text-blue-100">Images Uploaded</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats?.totalAnnotations || 0}
                    </div>
                    <div className="text-sm text-blue-100">
                      Total Annotations
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold">
                      {loading
                        ? "..."
                        : Math.round(
                            (stats?.annotatedImages /
                              Math.max(stats?.totalImages, 1)) *
                              100
                          ) || 0}
                      %
                    </div>
                    <div className="text-sm text-blue-100">Completion Rate</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleUploadImages}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Images
                  </button>
                  <button
                    onClick={handleStartAnnotating}
                    className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm border border-white/30"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Start Annotating
                  </button>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Images"
            value={loading ? "" : stats?.totalImages.toLocaleString()}
            subtitle={loading ? "" : "Images uploaded"}
            loading={loading}
            trend={12}
            icon={
              <svg
                className="w-7 h-7"
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
            subtitle={loading ? "" : "Fully processed"}
            loading={loading}
            trend={8}
            icon={
              <svg
                className="w-7 h-7"
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
            subtitle={loading ? "" : "Active annotations"}
            loading={loading}
            trend={15}
            icon={
              <svg
                className="w-7 h-7"
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
            subtitle={loading ? "" : "Overall progress"}
            loading={loading}
            trend={5}
            icon={
              <svg
                className="w-7 h-7"
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
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <button
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => navigate("/annotations")}
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1">
                      <Skeleton variant="text" width="80%" height="1.25rem" />
                      <Skeleton variant="text" width="60%" height="1rem" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer hover:shadow-md"
                    onClick={() => handleActivityClick(activity)}
                    title={`Click to view ${activity.image || activity.name}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                        activity.action.includes("uploaded")
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : activity.action.includes("annotation") ||
                            activity.action.includes("annotated")
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : activity.action.includes("collection")
                          ? "bg-gradient-to-br from-purple-500 to-purple-600"
                          : "bg-gradient-to-br from-gray-500 to-gray-600"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {activity.action.includes("uploaded") ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        ) : activity.action.includes("annotation") ||
                          activity.action.includes("annotated") ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        ) : activity.action.includes("collection") ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
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
                        {activity.image || activity.name}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity insights */}
            {!loading && stats?.recentActivity?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {stats.recentActivity.length} recent activities
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    All systems active
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleUploadImages}
                className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Upload Images
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Add new images to your collection
                  </p>
                </div>
              </button>

              <button
                onClick={handleStartAnnotating}
                className="group relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Start Annotating
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Begin annotating your images
                  </p>
                </div>
              </button>

              <button
                onClick={handleViewGallery}
                className="group relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    View Gallery
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Browse your image collection
                  </p>
                </div>
              </button>

              <button
                onClick={handleViewReports}
                className="group relative p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Analytics
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    View detailed reports & insights
                  </p>
                </div>
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
