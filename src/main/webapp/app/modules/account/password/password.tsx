import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';

import { toast } from 'react-toastify';
import './password.scss';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { getSession } from 'app/shared/reducers/authentication';

import { reset, savePassword } from './password.reducer';

export const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { user: authContextUser } = useAuth();

  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = (values: any) => {
    const { currentPassword, newPassword } = values;
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  // Get username from AuthContext if Redux account is not available
  const displayUsername = account?.login || authContextUser?.name || 'User';

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    } else if (errorMessage) {
      toast.error(translate(errorMessage));
    }
    dispatch(reset());
  }, [successMessage, errorMessage]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 id="password-title" className="text-2xl font-semibold text-slate-900 mb-6">
          <Translate contentKey="password.title" interpolate={{ username: displayUsername }}>
            Password for {displayUsername}
          </Translate>
        </h2>

        <ValidatedForm id="password-form" onSubmit={handleValidSubmit} className="password-form space-y-6">
          <ValidatedField
            className="mb-6"
            name="currentPassword"
            label={translate('global.form.currentpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.currentpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
            }}
            data-cy="currentPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <ValidatedField
            className="mb-6"
            name="newPassword"
            label={translate('global.form.newpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            onChange={updatePassword}
            data-cy="newPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <PasswordStrengthBar password={password} />

          <ValidatedField
            className="mb-6"
            name="confirmPassword"
            label={translate('global.form.confirmpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
              validate: v => v === password || translate('global.messages.error.dontmatch'),
            }}
            data-cy="confirmPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <div>
            <button
              type="submit"
              data-cy="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Translate contentKey="password.form.button">Save</Translate>
            </button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
};

export default PasswordPage;
