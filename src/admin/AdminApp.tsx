import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth-context';
import type { UserRole } from './api';
import { AdminLoginPage } from './pages/Login';
import { AdminDashboard } from './pages/Dashboard';
import { AdminRoutesPage } from './pages/Routes';
import { AdminPagesList } from './pages/PagesList';
import { AdminPageDetail } from './pages/PageDetail';
import { AdminMediaLibrary } from './pages/MediaLibrary';
import { AdminNewsList } from './pages/NewsList';
import { AdminNewsDetail } from './pages/NewsDetail';
import { AdminEventsList } from './pages/EventsList';
import { AdminEmailRecipientsPage } from './pages/EmailRecipients';
import { AdminEmailSettingsPage } from './pages/EmailSettings';
import { AdminProfilePage } from './pages/Profile';
import { AdminUsersPage } from './pages/Users';

type ProtectedRouteProps = {
  children: JSX.Element;
  roles?: UserRole[];
};

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { accessToken, user } = useAuth();
  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }
  if (roles && (!user || !roles.includes(user.role as UserRole))) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function AdminRouter() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routes"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminRoutesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminPagesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/:pageId"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminPageDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/media"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminMediaLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminNewsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminEventsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-recipients"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEmailRecipientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-settings"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminEmailSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:newsId"
        element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <AdminNewsDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export function AdminApp() {
  return (
    <AuthProvider>
      <AdminRouter />
    </AuthProvider>
  );
}

