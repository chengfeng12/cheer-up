import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './components/Layout/MobileLayout';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TaskHistoryPage from './pages/TaskHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import NotificationCenter from './components/Notifications/NotificationCenter';
import GlobalLoader from './components/Loading/GlobalLoader';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />
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
