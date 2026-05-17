import React, { useEffect } from 'react';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { languages } from 'app/config/translation';

import { getUser } from './user-management.reducer';

export const UserManagementDetail = () => {
  const dispatch = useAppDispatch();

  const { login } = useParams<'login'>();
  if (!login) {
    throw new Error('Không tìm thấy thẻ login trong file user-management-detail.html');
  }

  useEffect(() => {
    dispatch(getUser(login));
  }, [dispatch, login]);

  const user = useAppSelector(state => state.userManagement.user);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-3xl font-semibold text-slate-900" data-cy="userManagementDetailsHeading">
          <Translate contentKey="userManagement.detail.title">User</Translate> [<strong>{user.login}</strong>]
        </h2>

        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.login">Login</Translate>
            </dt>
            <dd className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
              <span>{user.login}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.activated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                <Translate contentKey={user.activated ? 'userManagement.activated' : 'userManagement.deactivated'}>
                  {user.activated ? 'Activated' : 'Deactivated'}
                </Translate>
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.firstName">First Name</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.firstName}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.lastName">Last Name</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.lastName}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.email">Email</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.email}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.langKey">Lang Key</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.langKey ? languages[user.langKey].name : undefined}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.createdBy">Created By</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.createdBy}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.createdDate">Created Date</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">
              {user.createdDate && <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">{user.lastModifiedBy}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
            </dt>
            <dd className="mt-2 text-sm text-slate-700">
              {user.lastModifiedDate && <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              <Translate contentKey="userManagement.profiles">Profiles</Translate>
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2 text-sm font-medium text-slate-700">
              {user.authorities?.map((authority, i) => (
                <span key={`user-auth-${i}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {authority}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <Link
            to="/admin/user-management"
            replace
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            data-cy="entityDetailsBackButton"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <Translate contentKey="entity.action.back">Back</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDetail;
