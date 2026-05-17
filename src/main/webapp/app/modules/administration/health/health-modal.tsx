import React from 'react';
import { Translate } from 'react-jhipster';

const formatDiskSpaceOutput = rawValue => {
  const val = rawValue / 1073741824;
  if (val > 1) {
    return `${val.toFixed(2)} GB`;
  }
  return `${(rawValue / 1048576).toFixed(2)} MB`;
};

const HealthModal = ({ handleClose, healthObject, showModal }) => {
  if (!showModal) {
    return null;
  }

  const data = healthObject.details || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-slate-900">{healthObject.name}</h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
                <tr>
                  <th className="px-4 py-3">
                    <Translate contentKey="health.details.name">Name</Translate>
                  </th>
                  <th className="px-4 py-3">
                    <Translate contentKey="health.details.value">Value</Translate>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {Object.keys(data).map((key, index) => (
                  <tr key={index} className="odd:bg-slate-50">
                    <td className="px-4 py-4 text-slate-700">{key}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {healthObject.name === 'diskSpace' ? formatDiskSpaceOutput(data[key]) : JSON.stringify(data[key])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthModal;
