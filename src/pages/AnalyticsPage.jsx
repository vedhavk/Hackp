import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Card, Button, Skeleton } from "../components/ui";
import { useToast } from "../contexts/ToastContext";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { success: toastSuccess, info: toastInfo } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d, 1y
  const [exportFormat, setExportFormat] = useState("csv"); // csv, json
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const handleExportData = async () => {
    if (!analyticsData) {
      toastInfo("No data available to export");
      return;
    }

    setIsExporting(true);

    try {
      // Simulate processing time for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      let content, mimeType, extension;

      if (exportFormat === "json") {
        // Export as JSON
        content = JSON.stringify(analyticsData, null, 2);
        mimeType = "application/json;charset=utf-8;";
        extension = "json";
      } else {
        // Export as CSV
        try {
          content = generateCSVContent(analyticsData);
          mimeType = "text/csv;charset=utf-8;";
          extension = "csv";
        } catch (csvError) {
          console.error("CSV generation error:", csvError);
          toastInfo("Error generating CSV format. Please try JSON format.");
          return;
        }
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        toastInfo("No data to export");
        return;
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `analytics-report-${timeRange}-${
            new Date().toISOString().split("T")[0]
          }.${extension}`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up

        toastSuccess(
          `Analytics report exported as ${extension.toUpperCase()} successfully!`
        );
      } else {
        toastInfo("Download not supported in this browser");
      }
    } catch (error) {
      console.error("Export error:", error);
      toastInfo("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVContent = (data) => {
    const headers = ["Metric", "Value", "Category", "Additional Info"];
    const rows = [];

    // Overview metrics
    if (data.overview) {
      rows.push([
        "Total Images",
        data.overview.totalImages || 0,
        "Overview",
        `Trend: ${data.overview.uploadTrend || "N/A"}`,
      ]);
      rows.push([
        "Total Annotations",
        data.overview.totalAnnotations || 0,
        "Overview",
        `Trend: ${data.overview.annotationTrend || "N/A"}`,
      ]);
      rows.push([
        "Annotated Images",
        data.overview.annotatedImages || 0,
        "Overview",
        "",
      ]);
      rows.push([
        "Completion Rate",
        `${data.overview.completionRate || 0}%`,
        "Overview",
        "",
      ]);
    }

    // Upload stats
    if (data.uploadStats) {
      rows.push([
        "This Week Uploads",
        data.uploadStats.thisWeek || 0,
        "Upload Stats",
        "",
      ]);
      rows.push([
        "Last Week Uploads",
        data.uploadStats.lastWeek || 0,
        "Upload Stats",
        "",
      ]);
    }

    // Annotation stats
    if (data.annotationStats) {
      rows.push([
        "Average Annotations Per Image",
        data.annotationStats.averagePerImage || 0,
        "Annotation Stats",
        "",
      ]);
      rows.push([
        "Most Annotated Category",
        data.annotationStats.mostAnnotatedCategory || "N/A",
        "Annotation Stats",
        "",
      ]);

      // Category breakdown
      if (
        data.annotationStats.categoryBreakdown &&
        Array.isArray(data.annotationStats.categoryBreakdown)
      ) {
        data.annotationStats.categoryBreakdown.forEach((category) => {
          rows.push([
            category.name || "Unknown",
            category.count || 0,
            "Category Breakdown",
            `${category.percentage || 0}%`,
          ]);
        });
      }
    }

    // Recent activity
    if (data.recentActivity && Array.isArray(data.recentActivity)) {
      data.recentActivity.forEach((activity, index) => {
        rows.push([
          `Activity ${index + 1}`,
          activity.action || "Unknown action",
          "Recent Activity",
          activity.time || "Unknown time",
        ]);
      });
    }

    // Productivity insights
    if (data.productivityInsights && Array.isArray(data.productivityInsights)) {
      data.productivityInsights.forEach((insight, index) => {
        rows.push([
          `Insight ${index + 1}`,
          insight.title || "Unknown insight",
          "Productivity",
          insight.description || "",
        ]);
      });
    }

    // Convert to CSV format
    const csvRows = [headers, ...rows];
    return csvRows
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  const loadAnalyticsData = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock analytics data
    setAnalyticsData({
      overview: {
        totalImages: 247,
        totalAnnotations: 178,
        annotatedImages: 89,
        uploadTrend: "+12%",
        annotationTrend: "+8%",
        completionRate: 36, // 89/247 * 100 = 36%
      },
      uploadStats: {
        thisWeek: 29, // Sum of daily uploads: 3+5+8+4+6+2+1 = 29
        lastWeek: 25,
        weeklyData: [3, 5, 8, 4, 6, 2, 1], // Matches daily activity
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      annotationStats: {
        averagePerImage: 2.0, // 178/89 = 2.0
        mostAnnotatedCategory: "Objects",
        categoryBreakdown: [
          { name: "Objects", count: 52, percentage: 29 }, // 52/178 ≈ 29%
          { name: "People", count: 45, percentage: 25 }, // 45/178 ≈ 25%
          { name: "Nature", count: 39, percentage: 22 }, // 39/178 ≈ 22%
          { name: "Buildings", count: 28, percentage: 16 }, // 28/178 ≈ 16%
          { name: "Other", count: 14, percentage: 8 }, // 14/178 ≈ 8%
        ], // Total: 52+45+39+28+14 = 178 ✓
      },
      productivity: {
        mostActiveDay: "Wednesday",
        mostActiveHour: "2 PM",
        averageSessionTime: "23 min",
        dailyActivity: [
          { day: "Mon", uploads: 3, annotations: 8 },
          { day: "Tue", uploads: 5, annotations: 12 },
          { day: "Wed", uploads: 8, annotations: 18 }, // Most active day
          { day: "Thu", uploads: 4, annotations: 10 },
          { day: "Fri", uploads: 6, annotations: 14 },
          { day: "Sat", uploads: 2, annotations: 5 },
          { day: "Sun", uploads: 1, annotations: 3 },
        ], // Total uploads: 29, annotations: 70 for this week
      },
      recentActivity: [
        { action: "Uploaded landscape photo", time: "2 hours ago" },
        { action: "Added 3 annotations to building.jpg", time: "4 hours ago" },
        { action: "Created 'Architecture' category", time: "6 hours ago" },
        { action: "Exported analytics report (CSV)", time: "1 day ago" },
        { action: "Updated annotation preferences", time: "2 days ago" },
        { action: "Completed batch annotation task", time: "3 days ago" },
      ],
      productivityInsights: [
        {
          title: "Peak Performance",
          description: "You annotate 45% more images on Wednesday afternoons",
        },
        {
          title: "Weekly Consistency",
          description: "You've maintained daily uploads for 7 consecutive days",
        },
        {
          title: "Quality Improvement",
          description: "Annotation accuracy increased by 15% this month",
        },
        {
          title: "Growth Trend",
          description: "Total annotations grew by 8% compared to last month",
        },
        {
          title: "Efficiency Boost",
          description: "Average time per annotation decreased by 12 seconds",
        },
      ],
    });

    setLoading(false);
  };

  const MetricCard = ({ title, value, change, icon, trend }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} vs last period
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            trend === "up"
              ? "bg-green-100 dark:bg-green-900/20"
              : "bg-blue-100 dark:bg-blue-900/20"
          }`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  const ActivityChart = ({ data, title }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.day}
            </span>
            <div className="flex items-center space-x-4 flex-1 mx-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.uploads / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                {item.uploads}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const CategoryBreakdown = ({ categories }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Annotation Categories
      </h3>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {category.count} ({category.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-green-500"
                    : index === 2
                    ? "bg-yellow-500"
                    : index === 3
                    ? "bg-purple-500"
                    : "bg-gray-500"
                }`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={32}
                  className="mt-2"
                />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={16}
                  className="mt-1"
                />
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton
                  variant="text"
                  width="40%"
                  height={24}
                  className="mb-4"
                />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton
                      key={j}
                      variant="rectangular"
                      width="100%"
                      height={20}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insights into your image annotation activity
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
            </select>

            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isExporting || !analyticsData}
            >
              {isExporting ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
              {isExporting
                ? "Exporting..."
                : `Export ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Images"
            value={analyticsData.overview.totalImages}
            change={analyticsData.overview.uploadTrend}
            trend="up"
            icon={
              <svg
                className="w-6 h-6 text-blue-600"
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
          />

          <MetricCard
            title="Total Annotations"
            value={analyticsData.overview.totalAnnotations}
            change={analyticsData.overview.annotationTrend}
            trend="up"
            icon={
              <svg
                className="w-6 h-6 text-green-600"
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
            }
          />

          <MetricCard
            title="Annotated Images"
            value={analyticsData.overview.annotatedImages}
            icon={
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <MetricCard
            title="Completion Rate"
            value={`${analyticsData.overview.completionRate}%`}
            icon={
              <svg
                className="w-6 h-6 text-yellow-600"
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
            }
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart
            data={analyticsData.productivity.dailyActivity}
            title="Daily Upload Activity"
          />

          <CategoryBreakdown
            categories={analyticsData.annotationStats.categoryBreakdown}
          />
        </div>

        {/* Productivity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Most Active Day
            </h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {analyticsData.productivity.mostActiveDay}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Peak productivity day
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-green-600"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Avg. Annotations
            </h3>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {analyticsData.annotationStats.averagePerImage}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Per image
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Session Time
            </h3>
            <p className="text-2xl font-bold text-purple-600 mb-1">
              {analyticsData.productivity.averageSessionTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average duration
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/gallery")}>View Gallery</Button>
            <Button onClick={() => navigate("/upload")} variant="outline">
              Upload Images
            </Button>
            <Button onClick={() => navigate("/annotations")} variant="outline">
              View Annotations
            </Button>
            <Button
              onClick={() => {
                toastInfo("Generating detailed report...");
                setTimeout(() => toastSuccess("Report generated!"), 2000);
              }}
              variant="outline"
            >
              Generate Report
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
