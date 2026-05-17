import React, { useEffect } from 'react';
import {
  CacheMetrics,
  DatasourceMetrics,
  EndpointsRequestsMetrics,
  GarbageCollectorMetrics,
  HttpRequestMetrics,
  JvmMemory,
  JvmThreads,
  SystemMetrics,
  Translate,
} from 'react-jhipster';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_TIMESTAMP_FORMAT, APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT, APP_WHOLE_NUMBER_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSystemMetrics, getSystemThreadDump } from '../administration.reducer';

export const MetricsPage = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(state => state.administration.metrics);
  const isFetching = useAppSelector(state => state.administration.loading);
  const threadDump = useAppSelector(state => state.administration.threadDump);

  useEffect(() => {
    dispatch(getSystemMetrics());
    dispatch(getSystemThreadDump());
  }, []);

  const getMetrics = () => {
    if (!isFetching) {
      dispatch(getSystemMetrics());
      dispatch(getSystemThreadDump());
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="metrics-page-heading" data-cy="metricsPageHeading" className="text-3xl font-semibold text-slate-900">
          <Translate contentKey="metrics.title">Application Metrics</Translate>
        </h2>
        <button
          type="button"
          onClick={getMetrics}
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
      <div className="space-y-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-slate-900">
            <Translate contentKey="metrics.jvm.title">JVM Metrics</Translate>
          </h3>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {metrics?.jvm && <JvmMemory jvmMetrics={metrics.jvm} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT} />}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {threadDump && <JvmThreads jvmThreads={threadDump} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT} />}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {metrics?.processMetrics && (
                <SystemMetrics
                  systemMetrics={metrics.processMetrics}
                  wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                  timestampFormat={APP_TIMESTAMP_FORMAT}
                />
              )}
            </div>
          </div>
        </section>

        {metrics?.garbageCollector && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GarbageCollectorMetrics garbageCollectorMetrics={metrics.garbageCollector} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT} />
          </section>
        )}

        {metrics?.['http.server.requests'] && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <HttpRequestMetrics
              requestMetrics={metrics['http.server.requests']}
              twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT}
              wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
            />
          </section>
        )}

        {metrics?.services && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <EndpointsRequestsMetrics endpointsRequestsMetrics={metrics.services} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT} />
          </section>
        )}

        {metrics?.cache && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <CacheMetrics cacheMetrics={metrics.cache} twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT} />
          </section>
        )}

        {metrics?.databases && JSON.stringify(metrics.databases) !== '{}' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DatasourceMetrics datasourceMetrics={metrics.databases} twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT} />
          </section>
        )}
      </div>
    </div>
  );
};

export default MetricsPage;
