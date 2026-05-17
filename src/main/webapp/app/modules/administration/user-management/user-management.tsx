import React, { useEffect, useState } from 'react';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faEye, faPencilAlt, faPlus, faSort, faSortDown, faSortUp, faSync, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getUsersAsAdmin, updateUser } from './user-management.reducer';

const pageButtonClass =
  'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50';
const pageButtonActiveClass =
  'inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-sm font-medium text-white';
const actionButtonClass =
  'inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300';

export const UserManagement = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`,
      }),
    );
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    getUsersFromProps();
  }, [dispatch, pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sortParam = params.get(SORT);
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p,
    });

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    getUsersFromProps();
  };

  const toggleActive = user => () => {
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated,
      }),
    );
  };

  const account = useAppSelector(state => state.authentication.account);
  const users = useAppSelector(state => state.userManagement.users);
  const totalItems = useAppSelector(state => state.userManagement.totalItems);
  const loading = useAppSelector(state => state.userManagement.loading);
  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = pagination.sort;
    const order = pagination.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  const pageCount = totalItems ? Math.max(1, Math.ceil(totalItems / pagination.itemsPerPage)) : 0;
  const startIndex = totalItems ? (pagination.activePage - 1) * pagination.itemsPerPage + 1 : 0;
  const endIndex = totalItems ? Math.min(totalItems, pagination.activePage * pagination.itemsPerPage) : 0;
  const pageRange = 2;
  const pageStart = Math.max(1, pagination.activePage - pageRange);
  const pageEnd = Math.min(pageCount, pagination.activePage + pageRange);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="user-management-page-heading" data-cy="UserManagementHeading" className="text-3xl font-semibold text-slate-900">
            <Translate contentKey="userManagement.home.title">Users</Translate>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSyncList}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSync} spin={loading} />
            <Translate contentKey="userManagement.home.refreshListLabel">Refresh List</Translate>
          </button>
          <Link
            to="new"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon={faPlus} />
            <Translate contentKey="userManagement.home.createLabel">Create a new user</Translate>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-700">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('id')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="global.field.id">ID</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('login')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.login">Login</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('login')} />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('email')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.email">Email</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </div>
              </th>
              <th className="px-4 py-3" />
              <th className="px-4 py-3 cursor-pointer" onClick={sort('langKey')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.langKey">Lang Key</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('langKey')} />
                </div>
              </th>
              <th className="px-4 py-3">
                <Translate contentKey="userManagement.profiles">Profiles</Translate>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('createdDate')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.createdDate">Created Date</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdDate')} />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('lastModifiedBy')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedBy')} />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={sort('lastModifiedDate')}>
                <div className="inline-flex items-center gap-2">
                  <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastModifiedDate')} />
                </div>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user, i) => (
              <tr key={`user-${i}`} className="odd:bg-slate-50">
                <td className="px-4 py-4 text-slate-700">
                  <Link to={user.login} className="text-slate-900 hover:text-slate-700">
                    {user.id}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-700">{user.login}</td>
                <td className="px-4 py-4 text-slate-700">{user.email}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={toggleActive(user)}
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.activated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <Translate contentKey={user.activated ? 'userManagement.activated' : 'userManagement.deactivated'}>
                      {user.activated ? 'Activated' : 'Deactivated'}
                    </Translate>
                  </button>
                </td>
                <td className="px-4 py-4 text-slate-700">{user.langKey}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.authorities?.map((authority, j) => (
                      <span key={`user-auth-${i}-${j}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {authority}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {user.createdDate && <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />}
                </td>
                <td className="px-4 py-4 text-slate-700">{user.lastModifiedBy}</td>
                <td className="px-4 py-4 text-slate-700">
                  {user.lastModifiedDate && (
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Link
                      to={user.login}
                      className={`${actionButtonClass} rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200`}
                      data-cy="entityDetailsButton"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      <span className="hidden sm:inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Link>
                    <Link
                      to={`${user.login}/edit`}
                      className={`${actionButtonClass} rounded-full bg-slate-900 text-white hover:bg-slate-800`}
                      data-cy="entityEditButton"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                      <span className="hidden sm:inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                      </span>
                    </Link>
                    <Link
                      to={`${user.login}/delete`}
                      className={`${actionButtonClass} rounded-full bg-rose-600 text-white hover:bg-rose-700 ${
                        account.login === user.login ? 'pointer-events-none opacity-50' : ''
                      }`}
                      data-cy="entityDeleteButton"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span className="hidden sm:inline">
                        <Translate contentKey="entity.action.delete">Delete</Translate>
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems && users?.length > 0 && (
        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-sm text-slate-600">
            <Translate contentKey="entity.action.viewing">
              Showing {startIndex} - {endIndex} of {totalItems}
            </Translate>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handlePagination(Math.max(1, pagination.activePage - 1))}
              disabled={pagination.activePage === 1}
              className={`${pageButtonClass} ${pagination.activePage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Translate contentKey="entity.action.previous">Previous</Translate>
            </button>
            {pageStart > 1 && (
              <>
                <button type="button" onClick={() => handlePagination(1)} className={pageButtonClass}>
                  1
                </button>
                {pageStart > 2 && <span className="px-2 text-sm text-slate-500">…</span>}
              </>
            )}
            {Array.from({ length: pageEnd - pageStart + 1 }, (_, idx) => pageStart + idx).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => handlePagination(page)}
                className={page === pagination.activePage ? pageButtonActiveClass : pageButtonClass}
              >
                {page}
              </button>
            ))}
            {pageEnd < pageCount && (
              <>
                {pageEnd < pageCount - 1 && <span className="px-2 text-sm text-slate-500">…</span>}
                <button type="button" onClick={() => handlePagination(pageCount)} className={pageButtonClass}>
                  {pageCount}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => handlePagination(Math.min(pageCount, pagination.activePage + 1))}
              disabled={pagination.activePage === pageCount}
              className={`${pageButtonClass} ${pagination.activePage === pageCount ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Translate contentKey="entity.action.next">Next</Translate>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
