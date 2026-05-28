import React from 'react';
import { Translate } from 'react-jhipster';
import { NavigationType, useNavigate, useNavigationType, PathRouteProps } from 'react-router';

import { useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import ErrorBoundary from 'app/shared/error/error-boundary';

interface IOwnProps extends PathRouteProps {
  hasAnyAuthorities?: string[];
  children: React.ReactNode;
}

const PrivateRoute = ({ children, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
  // Try AuthContext first (for temporary auth), fallback to Redux
  const { isAuthenticated: contextIsAuthenticated } = useAuth();
  const isAuthenticatedRedux = useAppSelector(state => state.authentication.isAuthenticated);
  const isAuthenticated = contextIsAuthenticated || isAuthenticatedRedux;

  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);
  const account = useAppSelector(state => state.authentication.account);
  const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities);
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { openAuthModal } = useAuth();
  const redirectAttemptedRef = React.useRef(false);

  if (!children) {
    throw new Error(`A component needs to be specified for private route for path ${rest.path}`);
  }

  React.useEffect(() => {
    if (!isAuthenticated && sessionHasBeenFetched && !contextIsAuthenticated && !redirectAttemptedRef.current) {
      redirectAttemptedRef.current = true;
      const shouldKeepOnRouteChange = navigationType === NavigationType.Push;
      const shouldNavigateBackOnClose = navigationType !== NavigationType.Push && window.history.length > 1;
      openAuthModal({ keepOpenOnRouteChange: shouldKeepOnRouteChange, navigateBackOnClose: shouldNavigateBackOnClose });
      if (shouldKeepOnRouteChange) {
        navigate(-1);
      }
    }
  }, [isAuthenticated, sessionHasBeenFetched, contextIsAuthenticated, navigate, navigationType, openAuthModal]);

  if (!sessionHasBeenFetched && !contextIsAuthenticated) {
    return <div></div>;
  }

  if (isAuthenticated) {
    // If user is from AuthContext, skip authority check (temporary auth)
    if (contextIsAuthenticated && !isAuthenticatedRedux) {
      return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    if (isAuthorized) {
      return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    return (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
        </div>
      </div>
    );
  }

  return null;
};

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

/**
 * Checks authentication before showing the children and redirects to the
 * login page if the user is not authenticated.
 * If hasAnyAuthorities is provided the authorization status is also
 * checked and an error message is shown if the user is not authorized.
 */
export default PrivateRoute;
