import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth-context';
import { AdminLoginPage } from './pages/Login';
import { AdminDashboard } from './pages/Dashboard';
import { AdminRoutesPage } from './pages/Routes';
import { AdminPagesList } from './pages/PagesList';
import { AdminPageDetail } from './pages/PageDetail';

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

