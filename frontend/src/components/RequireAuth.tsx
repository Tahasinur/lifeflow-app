import { Navigate } from 'react-router';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  // Check if user is authenticated (simple localStorage check)
  const isAuthenticated = localStorage.getItem('lifeflow-auth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}