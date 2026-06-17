import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

export interface PremiumStatus {
  isPremium: boolean;
  level: number;
  packageName: string | null;
  startDate: string | null;
  endDate: string | null;
  daysRemaining: number;
}

const DEFAULT_STATUS: PremiumStatus = {
  isPremium: false,
  level: 0,
  packageName: null,
  startDate: null,
  endDate: null,
  daysRemaining: 0,
};

export function usePremiumStatus() {
  const [status, setStatus] = useState<PremiumStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);

  const realUser = useAppSelector(state => state.authentication.account);
  const isRealAuth = !!realUser?.login;

  // useCallback giúp fetchStatus luôn capture đúng giá trị isRealAuth mới nhất
  const fetchStatus = useCallback(async () => {
    if (!isRealAuth) {
      setStatus(DEFAULT_STATUS);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/user-premiums/my-status');
      setStatus({
        ...response.data,
        isPremium: response.data.premium,
      });
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setStatus(DEFAULT_STATUS);
    } finally {
      setLoading(false);
    }
  }, [isRealAuth]);

  useEffect(() => {
    fetchStatus();

    // Lắng nghe event khi thanh toán premium thành công
    window.addEventListener('premiumUpdated', fetchStatus);
    return () => {
      window.removeEventListener('premiumUpdated', fetchStatus);
    };
  }, [fetchStatus]);

  return { ...status, loading, refetch: fetchStatus };
}
