import React, { useEffect } from 'react';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { useNavigate, useParams } from 'react-router';

import { faArrowLeft, faSave, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { locales, languages } from 'app/config/translation';

import { getRoles, getUser, reset, updateUser } from './user-management.reducer';

const labelClass = 'mb-2 block text-sm font-semibold text-slate-700';
const inputClass =
  'form-control block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { login } = useParams<'login'>();

  useEffect(() => {
    if (login) {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [dispatch, login]);

  const handleClose = () => navigate('/admin/user-management');

  const saveUser = values => {
    dispatch(updateUser(values));
    handleClose();
  };

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px 40px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <FontAwesomeIcon icon={faUserShield} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Phân quyền & Trạng thái</h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Cập nhật quyền hạn và trạng thái hoạt động cho tài khoản {login}</p>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '32px 40px' }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
          ) : (
            <ValidatedForm onSubmit={saveUser} defaultValues={user}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                {/* Read-only Personal Info section */}
                <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: 8,
                    }}
                  >
                    Thông tin cá nhân (Chỉ xem)
                  </h3>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <ValidatedField type="text" name="login" label="Tên đăng nhập" disabled inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div>
                  <ValidatedField type="text" name="firstName" label="Tên" disabled inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div>
                  <ValidatedField type="text" name="lastName" label="Họ" disabled inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div>
                  <ValidatedField
                    name="email"
                    label="Địa chỉ Email"
                    type="email"
                    disabled
                    inputClass={inputClass}
                    labelClass={labelClass}
                  />
                </div>

                <div>
                  <ValidatedField type="select" name="langKey" label="Ngôn ngữ" disabled inputClass={inputClass} labelClass={labelClass}>
                    {locales.map(locale => (
                      <option value={locale} key={locale}>
                        {languages[locale].name}
                      </option>
                    ))}
                  </ValidatedField>
                </div>

                {/* Editable Admin controls section */}
                <div style={{ gridColumn: '1 / -1', marginTop: 16, marginBottom: 8 }}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#0f172a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: 8,
                    }}
                  >
                    Quản lý quyền hạn
                  </h3>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <ValidatedField
                    type="select"
                    name="authorities"
                    multiple
                    label="Phân quyền (Profiles) *"
                    inputClass={`${inputClass} min-h-[120px]`}
                    labelClass={labelClass}
                  >
                    {authorities.map(role => (
                      <option value={role} key={role} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                        {role}
                      </option>
                    ))}
                  </ValidatedField>
                  <span style={{ fontSize: 12, color: '#64748b', marginTop: 6, display: 'block' }}>
                    * Giữ phím Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều quyền
                  </span>
                </div>

                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <ValidatedField
                    type="checkbox"
                    name="activated"
                    check
                    value={true}
                    label="Kích hoạt tài khoản này"
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    labelClass="ml-2 text-sm font-semibold text-slate-800 cursor-pointer select-none mb-0 pt-0.5"
                    style={{ margin: 0 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'flex-end',
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#fff',
                    color: '#475569',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} /> Quay lại
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    padding: '12px 32px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    transition: 'all 0.15s',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    opacity: updating ? 0.7 : 1,
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                  }}
                  onMouseEnter={e => {
                    if (!updating) e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={e => {
                    if (!updating) e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: 8 }} /> Lưu thay đổi
                </button>
              </div>
            </ValidatedForm>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementUpdate;
