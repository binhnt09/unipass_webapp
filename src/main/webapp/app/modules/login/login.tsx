import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { useAppSelector } from 'app/config/store';
// import { login } from 'app/shared/reducers/authentication';

import { AuthModal } from './AuthModal';

export const Login = () => {
  // const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);
  const account = useAppSelector(state => state.authentication.account);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const pageLocation = useLocation();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const pageState = pageLocation.state as { from?: { pathname: string; search?: string } } | undefined;
  const from = pageState?.from || { pathname: '/', search: pageLocation.search };

  const handleClose = () => {
    setShowModal(false);
    navigate(from, { replace: true });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isAuthenticated) {
    if (!sessionHasBeenFetched) {
      return null;
    }

    const authorities = account?.authorities || [];
    if (authorities.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin" replace />;
    }
    if (authorities.some(auth => /MANAGER/i.test(auth))) {
      return <Navigate to="/entities" replace />;
    }
    if (authorities.some(auth => /SELLER/i.test(auth))) {
      return <Navigate to="/seller-dashboard" replace />;
    }
    return <Navigate to={from} replace />;
  }
  return showModal ? <AuthModal onClose={handleClose} onLoginSuccess={closeModal} /> : null;
};

export default Login;
