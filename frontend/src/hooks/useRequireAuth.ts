import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/connexion', { replace: true, state: { from: location.pathname } });
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  return { user, ready: !isLoading && isAuthenticated };
}