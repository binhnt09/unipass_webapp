import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RequestOffer from './request-offer';
import RequestOfferDeleteDialog from './request-offer-delete-dialog';
import RequestOfferDetail from './request-offer-detail';
import RequestOfferUpdate from './request-offer-update';

const RequestOfferRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RequestOffer />} />
    <Route path="new" element={<RequestOfferUpdate />} />
    <Route path=":id">
      <Route index element={<RequestOfferDetail />} />
      <Route path="edit" element={<RequestOfferUpdate />} />
      <Route path="delete" element={<RequestOfferDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RequestOfferRoutes;
