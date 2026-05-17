import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { useNavigate, useParams } from 'react-router';

import { faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { deleteUser, getUser } from './user-management.reducer';

export const UserManagementDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { login } = useParams<'login'>();

  if (!login) {
    throw new Error('Không tìm thấy thẻ login trong file user-management-delete.html');
  }

  useEffect(() => {
    dispatch(getUser(login));
  }, [dispatch, login]);

  const handleClose = () => navigate('/admin/user-management');

  const user = useAppSelector(state => state.userManagement.user);

  const confirmDelete = () => {
    dispatch(deleteUser(user.login));
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900" data-cy="userManagementDeleteDialogHeading">
            <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
          </h2>
        </div>
        <div className="space-y-4 px-6 py-6 text-slate-700">
          <p className="text-base leading-relaxed">
            <Translate contentKey="userManagement.delete.question" interpolate={{ login: user.login }}>
              Are you sure you want to delete this User?
            </Translate>
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faBan} />
            <span className="ml-2">
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            onClick={confirmDelete}
            data-cy="entityConfirmDeleteButton"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span className="ml-2">
              <Translate contentKey="entity.action.delete">Delete</Translate>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDeleteDialog;
