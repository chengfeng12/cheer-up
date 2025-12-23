import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from "./components/Layout/MobileLayout";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import TaskHistoryPage from "./pages/TaskHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import NotificationCenter from "./components/Notifications/NotificationCenter";
import GlobalLoader from "./components/Loading/GlobalLoader";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import AuthGuard from "./components/Auth/AuthGuard";

import { useHybridStore } from "./store/useHybridStore";
import { useEffect } from "react";

function App() {
  const { settings } = useHybridStore();

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Clean Layout Routes */}
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />

            {/* Protected Routes - Now public for browsing, actions guarded inside */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="history" element={<TaskHistoryPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <GlobalLoader />
        <NotificationCenter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
