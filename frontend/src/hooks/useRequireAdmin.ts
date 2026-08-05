import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/connexion', { replace: true, state: { from: '/admin' } });
      return;
    }
    if (user?.role !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  return { user, ready: !isLoading && isAuthenticated && user?.role === 'ADMIN' };
}