import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { ToastContainer } from "./components/ui";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GalleryPage from "./pages/GalleryPage";
import AnnotationsPage from "./pages/AnnotationsPage";
import UploadAndAnnotatePage from "./pages/UploadAndAnnotatePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Toast Display Component
const ToastDisplay = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/gallery"
                    element={
                      <ProtectedRoute>
                        <GalleryPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <UploadAndAnnotatePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/annotations"
                    element={
                      <ProtectedRoute>
                        <AnnotationsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Default redirect */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />

                  {/* Catch-all route */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            404 - Page Not Found
                          </h1>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            The page you're looking for doesn't exist.
                          </p>
                          <a
                            href="/dashboard"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Go to Dashboard
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>

                {/* Toast Display */}
                <ToastDisplay />
              </div>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
