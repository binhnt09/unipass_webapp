import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Product from './product';
import ProductDeleteDialog from './product-delete-dialog';
import ProductDetail from './product-detail';
import ProductUpdate from './product-update';

const ProductRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Product />} />
    <Route path="new" element={<ProductUpdate />} />
    <Route path=":id">
      <Route index element={<ProductDetail />} />
      <Route path="edit" element={<ProductUpdate />} />
      <Route path="delete" element={<ProductDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProductRoutes;
