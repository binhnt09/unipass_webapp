import React from 'react';
import { Translate } from 'react-jhipster';

import { useAppSelector } from 'app/config/store';

export const TrackerPage = () => {
  const activities = useAppSelector(state => state.administration.tracker.activities);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h2 data-cy="trackerPageHeading" className="mb-6 text-3xl font-semibold text-slate-900">
        <Translate contentKey="tracker.title">Real-time user activities</Translate>
      </h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm" data-cy="trackerTable">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
            <tr>
              <th className="px-4 py-3">
                <Translate contentKey="tracker.table.userlogin">User</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="tracker.table.ipaddress">IP Address</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="tracker.table.page">Current page</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="tracker.table.time">Time</Translate>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {activities.map((activity, i) => (
              <tr key={`log-row-${i}`} className="odd:bg-slate-50">
                <td className="px-4 py-4 text-slate-700">{activity.userLogin}</td>
                <td className="px-4 py-4 text-slate-700">{activity.ipAddress}</td>
                <td className="px-4 py-4 text-slate-700">{activity.page}</td>
                <td className="px-4 py-4 text-slate-700">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerPage;
