import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Configuration from './configuration/configuration';
import Docs from './docs/docs';
import Health from './health/health';
import Logs from './logs/logs';
import Metrics from './metrics/metrics';
import Tracker from './tracker/tracker';
// import AdminLayout from './admin-layout';
// import UserManagement from './user-management';

const AdministrationRoutes = () => (
  <div className="bg-slate-50 min-h-screen text-slate-900 w-full p-4 sm:p-8">
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 min-h-full">
      <ErrorBoundaryRoutes>
        {/* <Route element={<AdminLayout />}> */}
        {/* <Route path="user-management/*" element={<UserManagement />} /> */}
        <Route path="tracker" element={<Tracker />} />
        <Route path="health" element={<Health />} />
        <Route path="metrics" element={<Metrics />} />
        <Route path="configuration" element={<Configuration />} />
        <Route path="logs" element={<Logs />} />
        <Route path="docs" element={<Docs />} />
        {/* </Route> */}
      </ErrorBoundaryRoutes>
    </div>
  </div>
);

export default AdministrationRoutes;
