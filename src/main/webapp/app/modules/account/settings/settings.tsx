import React, { useEffect } from 'react';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';

import { toast } from 'react-toastify';
import './settings.scss';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import { languages, locales } from 'app/config/translation';
import { getSession } from 'app/shared/reducers/authentication';

import { reset, saveAccountSettings } from './settings.reducer';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user: authContextUser } = useAuth();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);

  const displayUsername = account?.login || authContextUser?.name || 'User';

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = values => {
    dispatch(
      saveAccountSettings({
        ...account,
        ...values,
      }),
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 id="settings-title" className="text-2xl font-semibold text-slate-900 mb-6">
          <Translate contentKey="settings.title" interpolate={{ username: displayUsername }}>
            User settings for {displayUsername}
          </Translate>
        </h2>

        <ValidatedForm id="settings-form" onSubmit={handleValidSubmit} defaultValues={account} className="settings-form space-y-6">
          <ValidatedField
            className="mb-6"
            name="firstName"
            label={translate('settings.form.firstname')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            id="firstName"
            placeholder={translate('settings.form.firstname.placeholder')}
            validate={{
              required: { value: true, message: translate('settings.messages.validate.firstname.required') },
              minLength: { value: 1, message: translate('settings.messages.validate.firstname.minlength') },
              maxLength: { value: 50, message: translate('settings.messages.validate.firstname.maxlength') },
            }}
            data-cy="firstname"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <ValidatedField
            className="mb-6"
            name="lastName"
            label={translate('settings.form.lastname')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            id="lastName"
            placeholder={translate('settings.form.lastname.placeholder')}
            validate={{
              required: { value: true, message: translate('settings.messages.validate.lastname.required') },
              minLength: { value: 1, message: translate('settings.messages.validate.lastname.minlength') },
              maxLength: { value: 50, message: translate('settings.messages.validate.lastname.maxlength') },
            }}
            data-cy="lastname"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <ValidatedField
            className="mb-6"
            name="email"
            label={translate('global.form.email.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.email.placeholder')}
            type="email"
            validate={{
              required: { value: true, message: translate('global.messages.validate.email.required') },
              minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
              maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
              validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
            }}
            data-cy="email"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <ValidatedField
            type="select"
            id="langKey"
            name="langKey"
            label={translate('settings.form.language')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            data-cy="langKey"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {locales.map(locale => (
              <option value={locale} key={locale}>
                {languages[locale].name}
              </option>
            ))}
          </ValidatedField>

          <div>
            <button
              type="submit"
              data-cy="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Translate contentKey="settings.form.button">Save</Translate>
            </button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
};

export default SettingsPage;
