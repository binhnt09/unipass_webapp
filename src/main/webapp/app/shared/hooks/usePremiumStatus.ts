import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';

export interface PremiumStatus {
  isPremium: boolean;
  level: number;
  packageName: string | null;
  startDate: string | null;
  endDate: string | null;
  daysRemaining: number;
}

export function usePremiumStatus() {
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    level: 0,
    packageName: null,
    startDate: null,
    endDate: null,
    daysRemaining: 0,
  });
  const [loading, setLoading] = useState(true);

  const realUser = useAppSelector(state => state.authentication.account);
  const { isAuthenticated: isDemoAuth } = useAuth();
  const isAuthenticated = !!realUser?.login || isDemoAuth;

  const fetchStatus = async () => {
    if (!isAuthenticated) {
      setStatus({
        isPremium: false,
        level: 0,
        packageName: null,
        startDate: null,
        endDate: null,
        daysRemaining: 0,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/user-premiums/my-status');
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setStatus({
        isPremium: false,
        level: 0,
        packageName: null,
        startDate: null,
        endDate: null,
        daysRemaining: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Lắng nghe event khi thanh toán premium thành công
    const handlePremiumUpdate = () => {
      fetchStatus();
    };

    window.addEventListener('premiumUpdated', handlePremiumUpdate);
    return () => {
      window.removeEventListener('premiumUpdated', handlePremiumUpdate);
    };
  }, [isAuthenticated]);

  return { ...status, loading, refetch: fetchStatus };
}
