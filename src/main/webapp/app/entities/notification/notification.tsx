import React, { useEffect, useState } from 'react';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation } from 'react-router';

import {
  faSort,
  faSortDown,
  faSortUp,
  faEye,
  faPencilAlt,
  faTrash,
  faSync,
  faPlus,
  faCheckCircle,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import { getEntities, reset } from './notification.reducer';

export const Notification = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const notificationList = useAppSelector(state => state.notification.entities);
  const loading = useAppSelector(state => state.notification.loading);
  const links = useAppSelector(state => state.notification.links);
  const updateSuccess = useAppSelector(state => state.notification.updateSuccess);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
  };

  const filteredList = notificationList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.title?.toLowerCase().includes(kw) &&
        !item.content?.toLowerCase().includes(kw) &&
        !String(item.id).includes(kw) &&
        !item.user?.login?.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const resetAll = () => {
    dispatch(reset());
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      resetAll();
    }
  }, [updateSuccess]);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if ((globalThis as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const sort = p => () => {
    dispatch(reset());
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
    setSorting(true);
  };

  const handleSyncList = () => {
    resetAll();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

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
            id="notification-heading"
            data-cy="NotificationHeading"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}
          >
            <Translate contentKey="unipassWebApp.notification.home.title">Notifications</Translate>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Notifications system tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSyncList}
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
            <FontAwesomeIcon icon={faSync} spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.notification.home.refreshListLabel">Refresh List</Translate>
          </button>
          <Link
            to="/notification/new"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <Translate contentKey="unipassWebApp.notification.home.createLabel">Create new Notification</Translate>
          </Link>
        </div>
      </div>

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
              placeholder="Tìm theo tiêu đề, nội dung, user..."
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

      {/* ── Infinite Scroll Table ───────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <InfiniteScroll
          dataLength={filteredList ? filteredList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < (links?.next || 0)}
          loader={<div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Loading more notifications...</div>}
        >
          {filteredList && filteredList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('id')}>
                      <Translate contentKey="unipassWebApp.notification.id">ID</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                    </th>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('title')}>
                      <Translate contentKey="unipassWebApp.notification.title">Title</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('title')} />
                    </th>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('content')}>
                      <Translate contentKey="unipassWebApp.notification.content">Content</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('content')} />
                    </th>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('type')}>
                      <Translate contentKey="unipassWebApp.notification.type">Type</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('type')} />
                    </th>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('isRead')}>
                      <Translate contentKey="unipassWebApp.notification.isRead">Is Read</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('isRead')} />
                    </th>
                    <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdAt')}>
                      <Translate contentKey="unipassWebApp.notification.createdAt">Created At</Translate>{' '}
                      <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                    </th>
                    <th style={thStyle}>
                      <Translate contentKey="unipassWebApp.notification.user">User</Translate> <FontAwesomeIcon icon={faSort} />
                    </th>
                    <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }} />
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map(notification => (
                    <tr
                      key={`entity-${notification.id}`}
                      data-cy="entityTable"
                      style={{ transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                        <Link to={`/notification/${notification.id}`} style={{ textDecoration: 'none', color: '#2563eb' }}>
                          #{notification.id}
                        </Link>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#111827' }}>{notification.title}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: '#6b7280',
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {notification.content}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>
                        <span style={{ padding: '3px 8px', borderRadius: 6, background: '#f3f4f6', fontSize: 11, color: '#4b5563' }}>
                          {notification.type}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {notification.isRead ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: '#059669',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <FontAwesomeIcon icon={faCheckCircle} /> Read
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: '#dc2626',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> Unread
                          </span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                        {notification.createdAt ? <TextFormat type="date" value={notification.createdAt} format={APP_DATE_FORMAT} /> : '—'}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{notification.user ? notification.user.login : '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <Link
                            to={`/notification/${notification.id}`}
                            title="View"
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
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f4f6')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                          <Link
                            to={`/notification/${notification.id}/edit`}
                            title="Edit"
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
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#dbeafe')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#eff6ff')}
                          >
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </Link>
                          <button
                            onClick={() => (window.location.href = `/notification/${notification.id}/delete`)}
                            title="Delete"
                            style={{
                              padding: '5px 9px',
                              borderRadius: 7,
                              border: '1px solid #fee2e2',
                              background: '#fff5f5',
                              color: '#dc2626',
                              cursor: 'pointer',
                              fontSize: 14,
                              transition: 'all 0.12s',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#fee2e2')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff5f5')}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 15, margin: 0 }}>
                  <Translate contentKey="unipassWebApp.notification.home.notFound">No Notifications found</Translate>
                </p>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Notification;
