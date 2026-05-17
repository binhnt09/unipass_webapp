import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { changeLogLevel, getLoggers } from '../administration.reducer';

const buttonColorMap = {
  TRACE: 'bg-sky-600 text-white hover:bg-sky-700',
  DEBUG: 'bg-emerald-600 text-white hover:bg-emerald-700',
  INFO: 'bg-indigo-600 text-white hover:bg-indigo-700',
  WARN: 'bg-amber-500 text-white hover:bg-amber-600',
  ERROR: 'bg-rose-600 text-white hover:bg-rose-700',
  OFF: 'bg-slate-500 text-white hover:bg-slate-600',
};

export const LogsPage = () => {
  const [filter, setFilter] = useState('');
  const logs = useAppSelector(state => state.administration.logs);
  const isFetching = useAppSelector(state => state.administration.loading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoggers());
  }, []);

  const changeLevel = (loggerName, level) => () => dispatch(changeLogLevel(loggerName, level));

  const changeFilter = evt => setFilter(evt.target.value);

  const filterFn = l => l.name.toUpperCase().includes(filter.toUpperCase());

  const loggers = logs ? Object.entries(logs.loggers).map((e: any) => ({ name: e[0], level: e[1].effectiveLevel })) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h2 id="logs-page-heading" data-cy="logsPageHeading" className="text-3xl font-semibold text-slate-900 mb-4">
        <Translate contentKey="logs.title">Logs</Translate>
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        <Translate contentKey="logs.nbloggers" interpolate={{ total: loggers.length }}>
          There are {loggers.length.toString()} loggers.
        </Translate>
      </p>

      <div className="mb-6">
        <label htmlFor="logger-filter" className="mb-2 block text-sm font-medium text-slate-700">
          <Translate contentKey="logs.filter">Filter</Translate>
        </label>
        <input
          id="logger-filter"
          type="text"
          value={filter}
          onChange={changeFilter}
          disabled={isFetching}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
            <tr title="click to order">
              <th className="px-4 py-3">
                <Translate contentKey="logs.table.name">Name</Translate>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="logs.table.level">Level</Translate>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loggers.filter(filterFn).map((logger, i) => (
              <tr key={`log-row-${i}`} className="odd:bg-slate-50">
                <td className="px-4 py-4 text-slate-900">
                  <small>{logger.name}</small>
                </td>
                <td className="px-4 py-4 space-x-2">
                  {['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'].map(level => (
                    <button
                      key={level}
                      type="button"
                      disabled={isFetching}
                      onClick={changeLevel(logger.name, level)}
                      className={`inline-flex items-center rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                        logger.level === level ? buttonColorMap[level] : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } ${isFetching ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      {level}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsPage;
