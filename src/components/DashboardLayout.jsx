import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, ThemeToggle, Modal } from "../components/ui";
import { mockGallery } from "../utils/mockApi";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New annotation added",
      message: "You've successfully annotated Image 3",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Annotation updated",
      message: "Annotation on Image 1 was modified",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Welcome!",
      message: "Welcome to PhotoAnnotator. Start annotating your images.",
      time: "2 hours ago",
      read: true,
    },
  ]);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Simple search function without complex debouncing
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await mockGallery.getImages(1, 50);
      const filtered = response.images.filter((image) => {
        const titleMatch = image.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const annotationMatch = image.annotations?.some((ann) =>
          ann.label.toLowerCase().includes(query.toLowerCase())
        );
        return titleMatch || annotationMatch;
      });
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search effect with proper cleanup
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, handleSearch]);

  // Simple search input handler - no automatic search
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Manual search trigger
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSearchSelect = (image) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/annotations`, { state: { selectedImageId: image.id } });
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Notification bell clicked! Current state:", notificationOpen);
    setNotificationOpen((prev) => !prev);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationOpen &&
        !event.target.closest(".notification-dropdown") &&
        !event.target.closest(".notification-button")
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationOpen]);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
          />
        </svg>
      ),
    },
    {
      name: "Upload",
      href: "/upload",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      name: "Gallery",
      href: "/gallery",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      name: "Annotations",
      href: "/annotations",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentNav = navigation.find((nav) => nav.href === currentPath);
    return currentNav?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black opacity-25" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-all duration-300 ease-in-out lg:relative lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "w-16" : "w-72"}`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none"></div>

        {/* Header */}
        <div
          className={`relative flex items-center justify-between h-20 px-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${
            sidebarCollapsed ? "px-2" : "px-6"
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Hamburger/Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group backdrop-blur-sm"
            >
              <div className="space-y-1">
                <div
                  className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                    sidebarCollapsed ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                    sidebarCollapsed ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                    sidebarCollapsed ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
            </button>

            {!sidebarCollapsed && (
              <>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"></div>
                    <svg
                      className="w-7 h-7 text-white relative z-10"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      {/* Photo frame */}
                      <rect
                        x="25"
                        y="30"
                        width="50"
                        height="35"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Annotation tag */}
                      <circle cx="40" cy="42" r="3" fill="currentColor" />
                      <rect
                        x="46"
                        y="40"
                        width="12"
                        height="4"
                        rx="1"
                        fill="currentColor"
                      />
                      {/* Focus indicators */}
                      <path
                        d="M30 35 L35 35 L35 40"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M70 35 L65 35 L65 40"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M30 60 L35 60 L35 55"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M70 60 L65 60 L65 55"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    PhotoAnnotator
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Professional Studio
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
          <div className="mb-6">
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </p>
            )}
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      className={`group flex items-center text-sm font-medium rounded-xl transition-all duration-200 ${
                        sidebarCollapsed
                          ? "px-3 py-3 justify-center"
                          : "px-4 py-3"
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01] hover:shadow-md"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 ${
                          sidebarCollapsed ? "" : "mr-4"
                        } ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                        }`}
                      >
                        {item.icon}
                      </div>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {isActive && (
                            <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          )}
                        </>
                      )}
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          {!sidebarCollapsed && (
            <div className="mt-8 px-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Stats
              </p>
              <div className="space-y-3">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Images
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      247
                    </span>
                  </div>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Annotated
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      89
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User section */}
        <div
          className={`p-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
            sidebarCollapsed ? "p-2" : "p-4"
          }`}
        >
          {sidebarCollapsed ? (
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md mx-auto cursor-pointer">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>

              {/* User tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {user?.name || "User"}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 bg-white/70 dark:bg-gray-700/70 rounded-xl border border-gray-200/50 dark:border-gray-600/50 mb-3 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <svg
                  className="w-4 h-4 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
          <div className="flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Page title with breadcrumb */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {getPageTitle()}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>PhotoAnnotator</span>
                  <svg
                    className="w-3 h-3 mx-2"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <path d="M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8 6 4.5z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {getPageTitle()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="notification-button relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 z-10"
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5h5m-5-5V8a3 3 0 10-6 0v9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                      <span className="sr-only">
                        {unreadCount} unread notifications
                      </span>
                    </div>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              !notification.read
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  !notification.read
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          )
                        }
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <ThemeToggle className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />

              {/* User profile dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 cursor-pointer">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Premium Plan
                    </p>
                  </div>
                  <svg
                    className="hidden sm:block w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
        title="Search Images"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search by image title or annotation... (Press Enter)"
              className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  d="M13 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Searching...
                </p>
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No results found
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {searchResults.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleSearchSelect(image)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {image.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {image.annotations?.length || 0} annotations
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Start typing to search for images...
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
