import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';

import { faEye, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSystemHealth } from '../administration.reducer';

import HealthModal from './health-modal';

export const HealthPage = () => {
  const [healthObject, setHealthObject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  const health = useAppSelector(state => state.administration.health);
  const isFetching = useAppSelector(state => state.administration.loading);

  useEffect(() => {
    dispatch(getSystemHealth());
  }, []);

  const fetchSystemHealth = () => {
    if (!isFetching) {
      dispatch(getSystemHealth());
    }
  };

  const getSystemHealthInfo = (name, healthObj) => () => {
    setShowModal(true);
    setHealthObject({ ...healthObj, name });
  };

  const getBadgeClasses = (status: string) =>
    status === 'UP'
      ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800'
      : 'inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800';

  const handleClose = () => setShowModal(false);

  const renderModal = () => <HealthModal healthObject={healthObject} handleClose={handleClose} showModal={showModal} />;

  const data = health?.components || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="health-page-heading" data-cy="healthPageHeading" className="text-3xl font-semibold text-slate-900">
          <Translate contentKey="health.title">Health Checks</Translate>
        </h2>
        <button
          type="button"
          onClick={fetchSystemHealth}
          disabled={isFetching}
          className={`inline-flex items-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
            isFetching ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          <FontAwesomeIcon icon={faSync} spin={isFetching} />
          <span className="ml-2">
            <Translate component="span" contentKey="health.refresh.button">
              Refresh
            </Translate>
          </span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
            <tr>
              <th className="px-4 py-3">
                <Translate contentKey="health.table.service">Service Name</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="health.table.status">Status</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="health.details.details">Details</Translate>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {Object.keys(data).map(
              (configPropKey, configPropIndex) =>
                configPropKey !== 'status' && (
                  <tr key={configPropIndex} className="odd:bg-slate-50">
                    <td className="px-4 py-4 text-slate-900">{configPropKey}</td>
                    <td className="px-4 py-4">
                      <span className={getBadgeClasses(data[configPropKey].status)}>{data[configPropKey].status}</span>
                    </td>
                    <td className="px-4 py-4">
                      {data[configPropKey].details && (
                        <button
                          type="button"
                          onClick={getSystemHealthInfo(configPropKey, data[configPropKey])}
                          className="inline-flex items-center rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      )}
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>

      {renderModal()}
    </div>
  );
};

export default HealthPage;
