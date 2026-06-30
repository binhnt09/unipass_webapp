import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteUser, getUser } from './user-management.reducer';

export const UserManagementDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { login } = useParams<'login'>();

  if (!login) {
    throw new Error('Không tìm thấy thẻ login');
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#fff',
          borderRadius: 24,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'entityModalIn 0.2s ease-out',
        }}
      >
        <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#dc2626',
              fontSize: 28,
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: '#111827' }}>Xác nhận xóa người dùng</h2>
          <p style={{ margin: 0, fontSize: 15, color: '#4b5563', lineHeight: 1.5 }}>
            Bạn có chắc chắn muốn xóa vĩnh viễn người dùng <strong style={{ color: '#111827' }}>{user.login}</strong> không? Hành động này
            không thể hoàn tác.
          </p>
        </div>

        <div
          style={{
            padding: '20px 32px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b91c1c')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#dc2626')}
          >
            <FontAwesomeIcon icon={faTrash} />
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDeleteDialog;
