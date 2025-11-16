import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth-context';
import { AdminLoginPage } from './pages/Login';
import { AdminDashboard } from './pages/Dashboard';
import { AdminRoutesPage } from './pages/Routes';
import { AdminPagesList } from './pages/PagesList';
import { AdminPageDetail } from './pages/PageDetail';
import { AdminMediaLibrary } from './pages/MediaLibrary';
import { AdminNewsList } from './pages/NewsList';
import { AdminNewsDetail } from './pages/NewsDetail';
import { AdminEventsList } from './pages/EventsList';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
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
          <ProtectedRoute>
            <AdminRoutesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <AdminPagesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/:pageId"
        element={
          <ProtectedRoute>
            <AdminPageDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/media"
        element={
          <ProtectedRoute>
            <AdminMediaLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <AdminNewsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AdminEventsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:newsId"
        element={
          <ProtectedRoute>
            <AdminNewsDetail />
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

