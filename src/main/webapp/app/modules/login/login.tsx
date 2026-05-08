import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { useAppSelector } from 'app/config/store';
// import { login } from 'app/shared/reducers/authentication';

import { AuthModal } from './AuthModal';

export const Login = () => {
  // const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
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

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return showModal ? <AuthModal onClose={handleClose} /> : null;
};

export default Login;
