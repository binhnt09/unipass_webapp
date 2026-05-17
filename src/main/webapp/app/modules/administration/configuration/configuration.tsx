import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getConfigurations, getEnv } from '../administration.reducer';

export const ConfigurationPage = () => {
  const [filter, setFilter] = useState('');
  const [reversePrefix, setReversePrefix] = useState(false);
  const [reverseProperties, setReverseProperties] = useState(false);
  const dispatch = useAppDispatch();

  const configuration = useAppSelector(state => state.administration.configuration);

  useEffect(() => {
    dispatch(getConfigurations());
    dispatch(getEnv());
  }, []);

  const changeFilter = evt => setFilter(evt.target.value);

  const envFilterFn = configProp => configProp.toUpperCase().includes(filter.toUpperCase());

  const propsFilterFn = configProp => configProp.prefix.toUpperCase().includes(filter.toUpperCase());

  const changeReversePrefix = () => setReversePrefix(!reversePrefix);

  const changeReverseProperties = () => setReverseProperties(!reverseProperties);

  const getContextList = contexts =>
    Object.values(contexts)
      .map((v: any) => v.beans)
      .reduce((acc, e) => ({ ...acc, ...e }), {});

  const configProps = configuration?.configProps ?? {};

  const env = configuration?.env ?? {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="configuration-page-heading" data-cy="configurationPageHeading" className="text-3xl font-semibold text-slate-900">
            <Translate contentKey="configuration.title">Configuration</Translate>
          </h2>
          <p className="text-sm text-slate-600">
            <Translate contentKey="configuration.filter">Filter</Translate>
          </p>
        </div>
        <div className="w-full max-w-md">
          <label className="sr-only" htmlFor="search">
            <Translate contentKey="configuration.filter">Filter</Translate>
          </label>
          <input
            id="search"
            name="search"
            type="search"
            value={filter}
            onChange={changeFilter}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            placeholder="Search configuration"
          />
        </div>
      </div>

      <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 text-sm font-medium text-slate-700">Spring configuration</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 border border-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
              <tr>
                <th onClick={changeReversePrefix} className="cursor-pointer px-4 py-3">
                  <Translate contentKey="configuration.table.prefix">Prefix</Translate>
                </th>
                <th onClick={changeReverseProperties} className="cursor-pointer px-4 py-3">
                  <Translate contentKey="configuration.table.properties">Properties</Translate>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {configProps.contexts &&
                Object.values(getContextList(configProps.contexts))
                  .filter(propsFilterFn)
                  .map((property: any, propIndex) => (
                    <tr key={propIndex} className="odd:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-4 align-top font-medium text-slate-900">{property.prefix}</td>
                      <td className="px-4 py-4">
                        <div className="space-y-3">
                          {Object.keys(property.properties).map((propKey, index) => (
                            <div key={index} className="grid gap-3 sm:grid-cols-[35%_65%]">
                              <div className="font-medium text-slate-700">{propKey}</div>
                              <div>
                                <span className="inline-flex max-w-full flex-wrap items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 break-words">
                                  {JSON.stringify(property.properties[propKey])}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {env.propertySources &&
        env.propertySources.map((envKey, envIndex) => (
          <div key={envIndex} className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-xl font-semibold text-slate-900">{envKey.name}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 border border-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="w-2/5 px-4 py-3">Property</th>
                    <th className="w-3/5 px-4 py-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {Object.keys(envKey.properties)
                    .filter(envFilterFn)
                    .map((propKey, propIndex) => (
                      <tr key={propIndex} className="odd:bg-slate-50">
                        <td className="px-4 py-4 align-top break-words text-slate-700">{propKey}</td>
                        <td className="px-4 py-4 align-top break-words">
                          <span className="inline-flex max-w-full flex-wrap items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {envKey.properties[propKey].value}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConfigurationPage;
