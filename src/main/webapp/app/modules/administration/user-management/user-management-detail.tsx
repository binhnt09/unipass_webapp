import React, { useEffect } from 'react';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { faArrowLeft, faEnvelope, faUserShield, faClock, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getUser } from './user-management.reducer';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  ROLE_ADMIN: { bg: '#fef3c7', text: '#92400e' },
  ROLE_MANAGER: { bg: '#ede9fe', text: '#5b21b6' },
  ROLE_SELLER: { bg: '#dbeafe', text: '#1e40af' },
  ROLE_BUYER: { bg: '#dcfce7', text: '#166534' },
  ROLE_USER: { bg: '#f3f4f6', text: '#374151' },
};
const getRoleColor = (role: string) => ROLE_COLORS[role] ?? { bg: '#f3f4f6', text: '#374151' };

export const UserManagementDetail = () => {
  const dispatch = useAppDispatch();

  const { login } = useParams<'login'>();
  if (!login) {
    throw new Error('Không tìm thấy thẻ login');
  }

  useEffect(() => {
    dispatch(getUser(login));
  }, [dispatch, login]);

  const user = useAppSelector(state => state.userManagement.user);

  const initials = (user.firstName?.[0] || user.login?.[0] || '?').toUpperCase();
  const hue = ((user.login || 'x').charCodeAt(0) * 17) % 360;

  const InfoItem = ({ label, value, icon }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {icon && <FontAwesomeIcon icon={icon} style={{ opacity: 0.6 }} />} {label}
      </span>
      <div style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>{value || '—'}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '24px 24px 0 0',
          border: '1px solid #e5e7eb',
          borderBottom: 'none',
          padding: '40px 40px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(135deg, hsl(${hue}, 70%, 85%), hsl(${hue + 40}, 70%, 85%))`,
          }}
        />

        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: `hsl(${hue}, 55%, 55%)`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 700,
            border: '4px solid #fff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ position: 'relative', zIndex: 1, paddingTop: 60, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#111827' }}>
                {user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : user.login}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, color: '#4b5563' }}>@{user.login}</span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: user.activated ? '#dcfce7' : '#fee2e2',
                    color: user.activated ? '#166534' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: user.activated ? '#16a34a' : '#dc2626' }} />
                  {user.activated ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>

            <Link
              to={`/admin/user-management/${user.login}/edit`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: '#2563eb',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.15s',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <FontAwesomeIcon icon={faPencilAlt} /> Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '0 0 24px 24px',
          border: '1px solid #e5e7eb',
          padding: '32px 40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h3
          style={{
            margin: '0 0 24px',
            fontSize: 18,
            fontWeight: 700,
            color: '#111827',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: 16,
          }}
        >
          Thông tin chi tiết
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 28 }}>
          <InfoItem label="Tên người dùng" value={user.firstName} />
          <InfoItem label="Họ người dùng" value={user.lastName} />
          <InfoItem label="Email" value={user.email} icon={faEnvelope} />
          <InfoItem label="Ngôn ngữ" value={user.langKey?.toUpperCase()} />

          <div style={{ gridColumn: '1 / -1' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 10,
              }}
            >
              <FontAwesomeIcon icon={faUserShield} style={{ opacity: 0.6 }} /> Vai trò (Phân quyền)
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.authorities?.length ? (
                user.authorities.map((role: string, i: number) => {
                  const color = getRoleColor(role);
                  return (
                    <span
                      key={i}
                      style={{
                        padding: '6px 16px',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 600,
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  );
                })
              ) : (
                <span style={{ color: '#9ca3af', fontSize: 14 }}>Chưa cấp quyền</span>
              )}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', height: 1, backgroundColor: '#f3f4f6', margin: '8px 0' }} />

          <InfoItem label="Tạo bởi" value={user.createdBy} />
          <InfoItem
            label="Ngày tạo"
            icon={faClock}
            value={user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
          />
          <InfoItem label="Sửa lần cuối bởi" value={user.lastModifiedBy} />
          <InfoItem
            label="Ngày sửa lần cuối"
            icon={faClock}
            value={
              user.lastModifiedDate ? (
                <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
              ) : null
            }
          />
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #f3f4f6' }}>
          <Link
            to="/admin/user-management"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              color: '#374151',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDetail;
