import React, { useEffect } from 'react';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { languages, locales } from 'app/config/translation';

import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer';
import './user-management-update.scss';

const labelClass = 'mb-2 block text-sm font-medium text-slate-700';
const inputClass =
  'form-control block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-150 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200';
const checkboxClass = 'form-control h-4 w-4 rounded border border-slate-300 text-slate-600 focus:ring-slate-500';
const buttonClass =
  'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { login } = useParams<'login'>();
  const isNew = login === undefined;

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isNew, login]);

  const handleClose = () => navigate('/admin/user-management');

  const saveUser = values => {
    if (isNew) {
      dispatch(createUser(values));
    } else {
      dispatch(updateUser(values));
    }
    handleClose();
  };

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-3xl font-semibold text-slate-900" data-cy="UserManagementCreateUpdateHeading">
          <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
        </h1>

        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : (
          <ValidatedForm onSubmit={saveUser} defaultValues={user}>
            <div className="space-y-6">
              {user.id && (
                <ValidatedField
                  type="text"
                  name="id"
                  data-cy="id"
                  required
                  readOnly
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              )}

              <ValidatedField
                type="text"
                name="login"
                data-cy="login"
                label={translate('userManagement.login')}
                validate={{
                  required: {
                    value: true,
                    message: translate('register.messages.validate.login.required'),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: translate('register.messages.validate.login.pattern'),
                  },
                  minLength: {
                    value: 1,
                    message: translate('register.messages.validate.login.minlength'),
                  },
                  maxLength: {
                    value: 50,
                    message: translate('register.messages.validate.login.maxlength'),
                  },
                }}
                inputClass={inputClass}
                labelClass={labelClass}
              />

              <ValidatedField
                type="text"
                name="firstName"
                data-cy="firstName"
                label={translate('userManagement.firstName')}
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
                inputClass={inputClass}
                labelClass={labelClass}
              />

              <ValidatedField
                type="text"
                name="lastName"
                data-cy="lastName"
                label={translate('userManagement.lastName')}
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
                inputClass={inputClass}
                labelClass={labelClass}
              />

              <div className="text-sm text-slate-500">This field cannot be longer than 50 characters.</div>

              <ValidatedField
                name="email"
                data-cy="email"
                label={translate('global.form.email.label')}
                placeholder={translate('global.form.email.placeholder')}
                type="email"
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.email.required'),
                  },
                  minLength: {
                    value: 5,
                    message: translate('global.messages.validate.email.minlength'),
                  },
                  maxLength: {
                    value: 254,
                    message: translate('global.messages.validate.email.maxlength'),
                  },
                  validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                }}
                inputClass={inputClass}
                labelClass={labelClass}
              />

              <ValidatedField
                type="checkbox"
                name="activated"
                data-cy="activated"
                check
                value={true}
                disabled={!user.id}
                label={translate('userManagement.activated')}
                inputClass={checkboxClass}
                labelClass={labelClass}
              />

              <ValidatedField
                type="select"
                name="langKey"
                data-cy="langKey"
                label={translate('userManagement.langKey')}
                inputClass={inputClass}
                labelClass={labelClass}
              >
                {locales.map(locale => (
                  <option value={locale} key={locale}>
                    {languages[locale].name}
                  </option>
                ))}
              </ValidatedField>

              <ValidatedField
                type="select"
                name="authorities"
                data-cy="profiles"
                multiple
                label={translate('userManagement.profiles')}
                inputClass={inputClass}
                labelClass={labelClass}
              >
                {authorities.map(role => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </ValidatedField>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
                <Link
                  to="/admin/user-management"
                  replace
                  className={`${buttonClass} rounded-2xl border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100`}
                  data-cy="entityCreateCancelButton"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span className="ml-2">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Link>
                <button
                  type="submit"
                  disabled={updating}
                  className={`${buttonClass} rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50`}
                  data-cy="entityCreateSaveButton"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span className="ml-2">
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </span>
                </button>
              </div>
            </div>
          </ValidatedForm>
        )}
      </div>
    </div>
  );
};

export default UserManagementUpdate;
