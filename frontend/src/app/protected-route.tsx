import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '../types/api';
import { useAuth } from './providers';

interface ProtectedRouteProps {
  roles?: Role[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, hasAnyRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !hasAnyRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
