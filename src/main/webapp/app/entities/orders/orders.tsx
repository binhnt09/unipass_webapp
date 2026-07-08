import React, { useEffect, useState } from 'react';
import { Translate, getPaginationState, TextFormat } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp, faSync, faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

// import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { getEntities } from './orders.reducer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Orders = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const ordersList = useAppSelector(state => state.orders.entities);
  const loading = useAppSelector(state => state.orders.loading);
  const totalItems = useAppSelector(state => state.orders.totalItems);

  const [statusStats, setStatusStats] = useState<any[]>([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
  };

  const filteredList = ordersList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.meetupLocation?.toLowerCase().includes(kw) &&
        !String(item.id).includes(kw) &&
        !item.buyer?.login?.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    // Fake data for UI preview
    const fakeData = [
      { status: 'SUCCESS', count: 126 },
      { status: 'PENDING', count: 8 },
      { status: 'ACCEPTED', count: 4 },
      { status: 'SHIPPING', count: 10 },
      { status: 'CANCELLED', count: 20 },
    ];
    setStatusStats(fakeData);

    // axios
    //   .get('/api/orders/stats/status')
    //   .then(res => {
    //     setStatusStats(res.data);
    //   })
    //   .catch(e => console.error('Error fetching order stats', e));
  }, []);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, paginationState.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = (p: string) => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = (currentPage: number) =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaginationState({
      ...paginationState,
      itemsPerPage: parseInt(event.target.value, 10),
      activePage: 1,
    });
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  // ─── Pagination logic ───────────────────────────────────────────────────
  const pageCount = totalItems ? Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage)) : 0;
  const startIndex = totalItems ? (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 : 0;
  const endIndex = totalItems ? Math.min(totalItems, paginationState.activePage * paginationState.itemsPerPage) : 0;
  const pageRange = 2;
  const pageStart = Math.max(1, paginationState.activePage - pageRange);
  const pageEnd = Math.min(pageCount, paginationState.activePage + pageRange);

  // ─── Styles ─────────────────────────────────────────────────────────────
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
    whiteSpace: 'nowrap',
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
          <h2 id="orders-heading" data-cy="OrdersHeading" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            <Translate contentKey="unipassWebApp.orders.home.title">Orders</Translate>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            {totalItems} <Translate contentKey="unipassWebApp.orders.home.title">total orders</Translate>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => sortEntities()}
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
            <Translate contentKey="unipassWebApp.orders.home.refreshListLabel">Refresh List</Translate>
          </button>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>📦</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tổng số Đơn hàng
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#0b5fff', lineHeight: 1.2 }}>
              {statusStats.reduce((sum, item: any) => sum + item.count, 0)}
            </div>
          </div>
        </div>
        <div
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>✅</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Thành công
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#10b981', lineHeight: 1.2 }}>
              {statusStats.find((s: any) => s.status === 'COMPLETED' || s.status === 'SUCCESS')?.count || 0}
            </div>
          </div>
        </div>
        <div
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>⏳</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Đang chờ
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#f59e0b', lineHeight: 1.2 }}>
              {statusStats.find((s: any) => s.status === 'PENDING_CONFIRM' || s.status === 'PENDING')?.count || 0}
            </div>
          </div>
        </div>
        <div
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>👍</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Đã xác nhận
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#3b82f6', lineHeight: 1.2 }}>
              {statusStats.find((s: any) => s.status === 'ACCEPTED')?.count || 0}
            </div>
          </div>
        </div>
        <div
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>❌</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Đã hủy
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#ef4444', lineHeight: 1.2 }}>
              {statusStats.find((s: any) => s.status === 'CANCELLED' || s.status === 'REJECTED')?.count || 0}
            </div>
          </div>
        </div>
      </div>

      {/* ── Growth Chart ────────────────────────────────────────────── */}
      <div
        className="chart-container"
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '20px 24px',
          marginBottom: 20,
          height: 350,
        }}
      >
        <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 12 }}>
          📊 Phân bố trạng thái Đơn hàng
        </h4>
        {statusStats && statusStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={statusStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50} label={{ position: 'top', fill: '#6b7280', fontSize: 12 }}>
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted mt-5" style={{ fontSize: 14 }}>
            No status data available for chart
          </div>
        )}
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
              placeholder="Tìm theo địa chỉ, mã đơn, user..."
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('id')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('totalAmount')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.totalAmount">Total Amount</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('totalAmount')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('platformDiscount')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.platformDiscount">Platform Discount</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('platformDiscount')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('status')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.status">Status</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('status')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('meetupLocation')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.meetupLocation">Meetup Location</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('meetupLocation')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('cancelReason')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.cancelReason">Cancel Reason</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('cancelReason')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('buyerNote')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.buyerNote">Buyer Note</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('buyerNote')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdAt')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('buyer.login')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.buyer">Buyer</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('buyer.login')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('seller.login')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.orders.seller">Seller</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('seller.login')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? (
                filteredList.map(orders => (
                  <tr
                    key={`entity-${orders.id}`}
                    data-cy="entityTable"
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                      <Link to={`/admin-orders/${orders.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        #{orders.id}
                      </Link>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0b5fff' }}>
                      {orders.totalAmount ? `${orders.totalAmount.toLocaleString()} VNĐ` : '0 VNĐ'}
                    </td>
                    <td style={tdStyle}>{orders.platformDiscount ? `${orders.platformDiscount.toLocaleString()} VNĐ` : '-'}</td>
                    <td style={tdStyle}>
                      {orders.status === 'COMPLETED' || orders.status === 'SUCCESS' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#166534',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /> {orders.status}
                        </span>
                      ) : orders.status === 'PENDING_CONFIRM' || orders.status === 'PENDING' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#fef3c7',
                            color: '#92400e',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706' }} /> {orders.status}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#fee2e2',
                            color: '#991b1b',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} /> {orders.status}
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>{orders.meetupLocation}</td>
                    <td style={tdStyle}>{orders.cancelReason}</td>
                    <td style={tdStyle}>{orders.buyerNote}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#6b7280' }}>
                      {orders.createdAt ? <TextFormat type="date" value={orders.createdAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td style={{ ...tdStyle, color: '#2563eb', fontWeight: 500 }}>{orders.buyer ? orders.buyer.login : ''}</td>
                    <td style={{ ...tdStyle, color: '#2563eb', fontWeight: 500 }}>{orders.seller ? orders.seller.login : ''}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <Link
                          to={`/admin-orders/${orders.id}`}
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
                        <Link
                          to={`/admin-orders/${orders.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          title="Edit"
                          data-cy="entityEditButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#2563eb',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fff';
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </Link>
                        <button
                          onClick={() =>
                            (window.location.href = `/admin-orders/${orders.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                          }
                          title="Delete"
                          data-cy="entityDeleteButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#dc2626',
                            fontSize: 14,
                            cursor: 'pointer',
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fef2f2';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fff';
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>
                        <Translate contentKey="unipassWebApp.orders.loading">Loading orders...</Translate>
                      </span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                        <div style={{ fontSize: 14 }}>
                          <Translate contentKey="unipassWebApp.orders.home.notFound">No Orders found</Translate>
                        </div>
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
                Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalItems}</strong> orders
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Hiển thị:</span>
                <select
                  value={paginationState.itemsPerPage}
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
                onClick={() => handlePagination(Math.max(1, paginationState.activePage - 1))}
                disabled={paginationState.activePage === 1}
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
                  active={page === paginationState.activePage}
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
                onClick={() => handlePagination(Math.min(pageCount, paginationState.activePage + 1))}
                disabled={paginationState.activePage === pageCount}
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
    onMouseEnter={e => {
      if (!active && !disabled) e.currentTarget.style.background = '#f9fafb';
    }}
    onMouseLeave={e => {
      if (!active && !disabled) e.currentTarget.style.background = '#fff';
    }}
  >
    {label}
  </button>
);

export default Orders;
