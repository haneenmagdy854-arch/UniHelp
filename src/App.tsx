import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { SubmitIssuePage } from './pages/SubmitIssuePage';
import { MyReportsPage } from './pages/MyReportsPage';
import { ReportDetailsPage } from './pages/ReportDetailsPage';
import { LostItemsPage } from './pages/LostItemsPage';
import { FoundItemsPage } from './pages/FoundItemsPage';
import { ClaimRequestsPage } from './pages/ClaimRequestsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Main Application Shell */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="submit-issue" element={<SubmitIssuePage />} />
          <Route path="my-reports" element={<MyReportsPage />} />
          <Route path="maintenance/:ticketId" element={<ReportDetailsPage />} />
          <Route path="lost-items" element={<LostItemsPage />} />
          <Route path="found-items" element={<FoundItemsPage />} />
          <Route path="claim-requests" element={<ClaimRequestsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help-center" element={<HelpCenterPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

