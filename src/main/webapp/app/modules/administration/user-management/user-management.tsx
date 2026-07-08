import React, { useEffect, useRef, useState } from 'react';
import { TextFormat, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { faEye, faSort, faSortDown, faSortUp, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getUsersAsAdmin, updateUser } from './user-management.reducer';

// ─── Role Badge colors ─────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  ROLE_ADMIN: { bg: '#fef3c7', text: '#92400e' },
  ROLE_MANAGER: { bg: '#ede9fe', text: '#5b21b6' },
  ROLE_SELLER: { bg: '#dbeafe', text: '#1e40af' },
  ROLE_BUYER: { bg: '#dcfce7', text: '#166534' },
  ROLE_USER: { bg: '#f3f4f6', text: '#374151' },
};
const getRoleColor = (role: string) => ROLE_COLORS[role] ?? { bg: '#f3f4f6', text: '#374151' };

// ─── Avatar ────────────────────────────────────────────────────────────────
const UserAvatar = ({ login, firstName }: { login?: string; firstName?: string }) => {
  const initials = (firstName?.[0] || login?.[0] || '?').toUpperCase();
  const hue = ((login || 'x').charCodeAt(0) * 17) % 360;
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `hsl(${hue}, 55%, 55%)`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
};

export const UserManagement = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [growthStats, setGrowthStats] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  // const account = useAppSelector(state => state.authentication.account);
  const users = useAppSelector(state => state.userManagement.users);
  const totalItems = useAppSelector(state => state.userManagement.totalItems);
  const loading = useAppSelector(state => state.userManagement.loading);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
    console.warn(setSearchText);
  };

  const filteredList = users?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.login?.toLowerCase().includes(kw) &&
        !item.email?.toLowerCase().includes(kw) &&
        !item.firstName?.toLowerCase().includes(kw) &&
        !item.lastName?.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const updateSuccess = useAppSelector(state => state.userManagement.updateSuccess);
  const prevUpdateSuccess = useRef(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
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
  }, [dispatch, pagination.activePage, pagination.order, pagination.sort, pagination.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sortParam = params.get(SORT);
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
      setPagination(prev => ({
        ...prev,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      }));
    }
  }, [pageLocation.search]);

  // Reload list whenever a child route (create/edit/delete) resolves back to index
  useEffect(() => {
    if (updateSuccess && !prevUpdateSuccess.current) {
      toast.success('User updated successfully!');
      getUsersFromProps();
    }
    prevUpdateSuccess.current = updateSuccess;
  }, [updateSuccess]);

  // ─── Growth chart ─────────────────────────────────────────────────────────
  useEffect(() => {
    axios
      .get('/api/admin/users/stats/growth')
      .then(res => setGrowthStats(res.data))
      .catch(e => console.error('Error fetching user growth stats', e));
  }, []);

  // ─── Sort ─────────────────────────────────────────────────────────────────
  const sort = (p: string) => () =>
    setPagination(prev => ({
      ...prev,
      order: prev.order === ASC ? DESC : ASC,
      sort: p,
    }));

  const getSortIcon = (fieldName: string) => {
    if (pagination.sort !== fieldName) return faSort;
    return pagination.order === ASC ? faSortUp : faSortDown;
  };

  // ─── Toggle active ────────────────────────────────────────────────────────
  const toggleActive = (user: any) => () => {
    dispatch(updateUser({ ...user, activated: !user.activated }));
  };

  // ─── Open User Profile ──────────────────────────────────────────────────
  const openUserProfile = async (userId: number) => {
    try {
      const res = await axios.get(`/api/user-profiles?userId.equals=${userId}`);
      if (res.data && res.data.length > 0) {
        navigate(`/user-profile/${res.data[0].id}`);
      } else {
        toast.info('Người dùng này chưa có hồ sơ');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải hồ sơ');
    }
  };

  // ─── Pagination ───────────────────────────────────────────────────────────
  const handlePagination = (page: number) => setPagination(prev => ({ ...prev, activePage: page }));
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: parseInt(event.target.value, 10),
      activePage: 1,
    }));
  };
  const pageCount = totalItems ? Math.max(1, Math.ceil(totalItems / pagination.itemsPerPage)) : 0;
  const startIndex = totalItems ? (pagination.activePage - 1) * pagination.itemsPerPage + 1 : 0;
  const endIndex = totalItems ? Math.min(totalItems, pagination.activePage * pagination.itemsPerPage) : 0;
  const pageRange = 2;
  const pageStart = Math.max(1, pagination.activePage - pageRange);
  const pageEnd = Math.min(pageCount, pagination.activePage + pageRange);

  // ─── Styles ───────────────────────────────────────────────────────────────
  const thStyle: React.CSSProperties = {
    padding: '11px 14px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
  };
  const tdStyle: React.CSSProperties = {
    padding: '12px 14px',
    fontSize: 13.5,
    color: '#374151',
    verticalAlign: 'middle',
    borderBottom: '1px solid #f3f4f6',
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px' }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: '20px 24px',
        }}
      >
        <div>
          <h2
            id="user-management-page-heading"
            data-cy="UserManagementHeading"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}
          >
            User Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{totalItems} total users in the system</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Refresh */}
          <button
            type="button"
            onClick={() => getUsersFromProps()}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Users', value: totalItems, color: '#2563eb', icon: '👥' },
          {
            label: 'Active Today',
            value: growthStats.length > 0 ? growthStats[growthStats.length - 1].total : 0,
            color: '#059669',
            icon: '📈',
          },
          { label: 'Days with Signups', value: growthStats.length, color: '#7c3aed', icon: '📅' },
        ].map(card => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: card.color, lineHeight: 1.2 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Growth Chart ────────────────────────────────────────────── */}
      {growthStats.length > 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            padding: '20px 24px',
            marginBottom: 20,
          }}
        >
          <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#374151' }}>📊 New User Registrations</h4>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v: any) => [v + ' users', 'Registrations']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
                />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Filter Panel ────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '20px 24px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block', fontWeight: 600 }}>Tìm kiếm từ khóa</label>
            <input
              type="text"
              placeholder="Tìm theo username, email, tên..."
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleApplyFilter()}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleApplyFilter}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Áp dụng
            </button>
            <button
              onClick={handleClearFilter}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('id')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    ID <FontAwesomeIcon icon={getSortIcon('id')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('login')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    User <FontAwesomeIcon icon={getSortIcon('login')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('email')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    Email <FontAwesomeIcon icon={getSortIcon('email')} size="xs" />
                  </span>
                </th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('langKey')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    Lang <FontAwesomeIcon icon={getSortIcon('langKey')} size="xs" />
                  </span>
                </th>
                <th style={thStyle}>Roles</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdDate')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    Created <FontAwesomeIcon icon={getSortIcon('createdDate')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('lastModifiedDate')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    Modified <FontAwesomeIcon icon={getSortIcon('lastModifiedDate')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? (
                filteredList.map(user => (
                  <tr
                    key={user.id}
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    {/* ID */}
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>#{user.id}</td>

                    {/* User avatar + name */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <UserAvatar login={user.login} firstName={user.firstName} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>
                            {user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : user.login}
                          </div>
                          <div style={{ fontSize: 11, color: '#6b7280' }}>@{user.login}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>{user.email}</td>

                    {/* Activated badge - clickable to toggle */}
                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={toggleActive(user)}
                        title="Click to toggle activation"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'opacity 0.15s',
                          ...(user.activated ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }),
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            flexShrink: 0,
                            background: user.activated ? '#16a34a' : '#dc2626',
                          }}
                        />
                        {user.activated ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Lang */}
                    <td style={{ ...tdStyle, fontSize: 12, color: '#6b7280', textTransform: 'uppercase' }}>{user.langKey || '—'}</td>

                    {/* Roles */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {user.authorities?.map((role: string, j: number) => {
                          const color = getRoleColor(role);
                          const shortName = role.replace('ROLE_', '');
                          return (
                            <span
                              key={`auth-${user.id}-${j}`}
                              title={role}
                              style={{
                                padding: '2px 8px',
                                borderRadius: 9999,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                backgroundColor: color.bg,
                                color: color.text,
                                textTransform: 'uppercase',
                              }}
                            >
                              {shortName}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Created */}
                    <td style={{ ...tdStyle, fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : '—'}
                    </td>

                    {/* Modified */}
                    <td style={{ ...tdStyle, fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {user.lastModifiedDate ? (
                        <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        {/* View */}
                        <Link
                          to={user.login}
                          title="View details"
                          data-cy="entityDetailsButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#f3f4f6';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fff';
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        {/* Profile */}
                        <button
                          onClick={() => openUserProfile(user.id)}
                          title="Hồ sơ người dùng"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #d1fae5',
                            background: '#ecfdf5',
                            color: '#059669',
                            cursor: 'pointer',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#d1fae5';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#ecfdf5';
                          }}
                        >
                          <FontAwesomeIcon icon="id-card" />
                          Profile
                        </button>
                        {/* Edit */}
                        {/* <Link
                          to={`${user.login}/edit`}
                          title="Edit user"
                          data-cy="entityEditButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #dbeafe',
                            background: '#eff6ff',
                            color: '#2563eb',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </Link> */}
                        {/* Delete */}
                        {/* <Link
                          to={`${user.login}/delete`}
                          title="Delete user"
                          data-cy="entityDeleteButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: account.login === user.login ? '1px solid #e5e7eb' : '1px solid #fee2e2',
                            background: account.login === user.login ? '#f9fafb' : '#fff5f5',
                            color: account.login === user.login ? '#9ca3af' : '#dc2626',
                            textDecoration: 'none',
                            fontSize: 14,
                            pointerEvents: account.login === user.login ? 'none' : 'auto',
                            opacity: account.login === user.login ? 0.4 : 1,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            if (account.login !== user.login) (e.currentTarget as HTMLElement).style.background = '#fee2e2';
                          }}
                          onMouseLeave={e => {
                            if (account.login !== user.login) (e.currentTarget as HTMLElement).style.background = '#fff5f5';
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Link> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>Loading users…</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>👤</div>
                        <div style={{ fontSize: 14 }}>{searchText ? 'No users match your search' : 'No users found'}</div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────── */}
        {totalItems > 0 && filteredList.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              padding: '14px 20px',
              borderTop: '1px solid #f3f4f6',
              background: '#fafafa',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalItems}</strong> users
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Hiển thị:</span>
                <select
                  value={pagination.itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                    background: '#fff',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <PaginationButton
                label="← Prev"
                onClick={() => handlePagination(Math.max(1, pagination.activePage - 1))}
                disabled={pagination.activePage === 1}
                active={false}
              />
              {pageStart > 1 && (
                <>
                  <PaginationButton label="1" onClick={() => handlePagination(1)} active={false} />
                  {pageStart > 2 && <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>}
                </>
              )}
              {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i).map(page => (
                <PaginationButton
                  key={page}
                  label={String(page)}
                  onClick={() => handlePagination(page)}
                  active={page === pagination.activePage}
                />
              ))}
              {pageEnd < pageCount && (
                <>
                  {pageEnd < pageCount - 1 && <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>}
                  <PaginationButton label={String(pageCount)} onClick={() => handlePagination(pageCount)} active={false} />
                </>
              )}
              <PaginationButton
                label="Next →"
                onClick={() => handlePagination(Math.min(pageCount, pagination.activePage + 1))}
                disabled={pagination.activePage === pageCount}
                active={false}
              />
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pagination Button helper ─────────────────────────────────────────────
const PaginationButton = ({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '5px 11px',
      borderRadius: 7,
      border: active ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
      background: active ? '#2563eb' : '#fff',
      color: active ? '#fff' : '#374151',
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'all 0.12s',
      minWidth: 34,
    }}
  >
    {label}
  </button>
);

export default UserManagement;
