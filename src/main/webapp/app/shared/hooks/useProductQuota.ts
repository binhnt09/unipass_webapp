import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

export interface ProductQuota {
  activeCount: number;
  limit: number; // -1 = vô hạn
  canPost: boolean;
  level: number;
}

export function useProductQuota() {
  const [quota, setQuota] = useState<ProductQuota>({
    activeCount: 0,
    limit: 3,
    canPost: true,
    level: 0,
  });
  const [loading, setLoading] = useState(true);

  const realUser = useAppSelector(state => state.authentication.account);
  const isRealAuth = !!realUser?.login;

  useEffect(() => {
    if (!isRealAuth) {
      setLoading(false);
      return;
    }
    axios
      .get<ProductQuota>('/api/products/my-quota')
      .then(res => setQuota(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isRealAuth]);

  return { ...quota, loading };
}
