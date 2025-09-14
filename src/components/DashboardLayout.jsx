import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, ThemeToggle } from "../components/ui";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

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
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 backdrop-blur-lg border-r border-gray-200/60 dark:border-gray-700/60 shadow-xl transform transition-all duration-300 ease-in-out lg:relative lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "w-16" : "w-72"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between h-20 px-3 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
            sidebarCollapsed ? "px-2" : "px-6"
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Hamburger/Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
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
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    PhotoApp
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Premium Studio
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
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <ThemeToggle className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />

              {/* User menu button */}
              <div className="hidden sm:block">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
