import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
import { Link } from 'react-router';

import { toast } from 'react-toastify';
import './register.scss';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

import { handleRegister, reset } from './register.reducer';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = (values: any) => {
    const { username, email, firstPassword } = values;
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 id="register-title" data-cy="registerTitle" className="text-3xl font-semibold text-slate-900 mb-6">
          <Translate contentKey="register.title">Registration</Translate>
        </h1>
        <ValidatedForm id="register-form" onSubmit={handleValidSubmit} className="register-form space-y-6">
          <ValidatedField
            className="mb-6"
            name="username"
            label={translate('global.form.username.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.username.placeholder')}
            validate={{
              required: { value: true, message: translate('register.messages.validate.login.required') },
              pattern: {
                value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                message: translate('register.messages.validate.login.pattern'),
              },
              minLength: { value: 1, message: translate('register.messages.validate.login.minlength') },
              maxLength: { value: 50, message: translate('register.messages.validate.login.maxlength') },
            }}
            data-cy="username"
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
            className="mb-6"
            name="firstPassword"
            label={translate('global.form.newpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            onChange={updatePassword}
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            data-cy="firstPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <PasswordStrengthBar password={password} />
          <ValidatedField
            className="mb-6"
            name="secondPassword"
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
            data-cy="secondPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <div>
            <button
              id="register-submit"
              type="submit"
              data-cy="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Translate contentKey="register.form.button">Register</Translate>
            </button>
          </div>
        </ValidatedForm>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 mt-6">
          <span>
            <Translate contentKey="global.messages.info.authenticated.prefix">If you want to</Translate>{' '}
          </span>
          <Link to="/login" className="font-semibold text-amber-900 underline">
            <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
          </Link>
          <span>
            <Translate contentKey="global.messages.info.authenticated.suffix">
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
              <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
            </Translate>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
