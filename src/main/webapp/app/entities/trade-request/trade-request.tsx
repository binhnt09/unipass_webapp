import React, { useEffect, useState } from 'react';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp, faEye, faSync, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { getEntities } from './trade-request.reducer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const TradeRequest = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const tradeRequestList = useAppSelector(state => state.tradeRequest.entities);
  const loading = useAppSelector(state => state.tradeRequest.loading);
  const totalItems = useAppSelector(state => state.tradeRequest.totalItems);

  const [statusStats, setStatusStats] = useState<any[]>([]);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
  };

  const filteredList = tradeRequestList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.meetupLocation?.toLowerCase().includes(kw) &&
        !String(item.id).includes(kw) &&
        !item.buyer?.login?.toLowerCase().includes(kw) &&
        !item.seller?.login?.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    axios
      .get('/api/trade-requests/stats/status')
      .then(res => {
        setStatusStats(res.data);
      })
      .catch(e => console.error('Error fetching trade request stats', e));
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

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
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

  const handleSyncList = () => {
    sortEntities();
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

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    let bg = '#f3f4f6';
    let color = '#374151';
    let dot = '#9ca3af';

    if (status === 'COMPLETED' || status === 'SUCCESS') {
      bg = '#dcfce7';
      color = '#166534';
      dot = '#16a34a';
    } else if (status === 'REJECTED' || status === 'CANCELLED') {
      bg = '#fee2e2';
      color = '#991b1b';
      dot = '#dc2626';
    } else if (status === 'PENDING_CONFIRM' || status === 'PENDING') {
      bg = '#fef3c7';
      color = '#92400e';
      dot = '#d97706';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 10px',
          borderRadius: 9999,
          fontSize: 11,
          fontWeight: 700,
          background: bg,
          color,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
        {status}
      </span>
    );
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
            id="trade-request-heading"
            data-cy="TradeRequestHeading"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}
          >
            <Translate contentKey="unipassWebApp.tradeRequest.home.title">Trade Requests</Translate>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{totalItems} total trade requests in the system</p>
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
            <Translate contentKey="unipassWebApp.tradeRequest.home.refreshListLabel">Refresh List</Translate>
          </button>
        </div>
      </div>

      {/* ── Summary & Charts ───────────────────────────────────────── */}
      <div
        className="summary-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}
      >
        <div
          className="summary-card"
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span
            className="summary-title"
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Tổng số Đổi đồ
          </span>
          <span className="summary-value" style={{ display: 'block', fontSize: '28px', fontWeight: 700, color: '#0b5fff' }}>
            {statusStats.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
        <div
          className="summary-card"
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span
            className="summary-title"
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Thành công (Completed)
          </span>
          <span className="summary-value" style={{ display: 'block', fontSize: '28px', fontWeight: 700, color: '#10b981' }}>
            {statusStats.find(s => s.status === 'COMPLETED' || s.status === 'SUCCESS')?.count || 0}
          </span>
        </div>
        <div
          className="summary-card"
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span
            className="summary-title"
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Đang chờ (Pending)
          </span>
          <span className="summary-value" style={{ display: 'block', fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
            {statusStats.find(s => s.status === 'PENDING_CONFIRM' || s.status === 'PENDING')?.count || 0}
          </span>
        </div>
        <div
          className="summary-card"
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span
            className="summary-title"
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Đã từ chối (Rejected)
          </span>
          <span className="summary-value" style={{ display: 'block', fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>
            {statusStats.find(s => s.status === 'REJECTED' || s.status === 'CANCELLED')?.count || 0}
          </span>
        </div>
      </div>

      <div
        className="chart-container"
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '24px',
          height: '350px',
        }}
      >
        <h4 className="text-center mb-4" style={{ color: '#111827', fontSize: '16px', fontWeight: 700, marginTop: 0 }}>
          Phân bố trạng thái Đổi đồ
        </h4>
        {statusStats && statusStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={statusStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50} label={{ position: 'top', fill: '#6b7280', fontSize: 12 }}>
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>No status data available for chart</div>
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
              placeholder="Tìm theo địa điểm, ID, buyer, seller..."
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('topUpAmount')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.topUpAmount">Top Up Amount</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('topUpAmount')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('meetupLocation')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.meetupLocation">Meetup Location</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('meetupLocation')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('updatedAt')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('isBuyerConfirmed')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.isBuyerConfirmed">Is Buyer Confirmed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isBuyerConfirmed')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('isSellerConfirmed')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.isSellerConfirmed">Is Seller Confirmed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isSellerConfirmed')} />
                </th>
                <th style={thStyle}>
                  <Translate contentKey="unipassWebApp.tradeRequest.targetProduct">Target Product</Translate>{' '}
                  <FontAwesomeIcon icon={faSort} />
                </th>
                <th style={thStyle}>
                  <Translate contentKey="unipassWebApp.tradeRequest.buyer">Buyer</Translate> <FontAwesomeIcon icon={faSort} />
                </th>
                <th style={thStyle}>
                  <Translate contentKey="unipassWebApp.tradeRequest.seller">Seller</Translate> <FontAwesomeIcon icon={faSort} />
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }} />
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? (
                filteredList.map(tradeRequest => (
                  <tr
                    key={`entity-${tradeRequest.id}`}
                    data-cy="entityTable"
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                      <Link to={`/trade-request/${tradeRequest.id}`} style={{ textDecoration: 'none', color: '#2563eb' }}>
                        #{tradeRequest.id}
                      </Link>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#059669' }}>
                      {tradeRequest.topUpAmount != null ? `${Number(tradeRequest.topUpAmount).toLocaleString('vi-VN')} ₫` : '—'}
                    </td>
                    <td style={tdStyle}>{getStatusBadge(tradeRequest.status || '')}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: '#6b7280',
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tradeRequest.meetupLocation || '—'}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                      {tradeRequest.createdAt ? <TextFormat type="date" value={tradeRequest.createdAt} format={APP_DATE_FORMAT} /> : '—'}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                      {tradeRequest.updatedAt ? <TextFormat type="date" value={tradeRequest.updatedAt} format={APP_DATE_FORMAT} /> : '—'}
                    </td>
                    <td style={tdStyle}>
                      {tradeRequest.isBuyerConfirmed ? (
                        <span style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>
                          <FontAwesomeIcon icon={faCheckCircle} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                          <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> No
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {tradeRequest.isSellerConfirmed ? (
                        <span style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>
                          <FontAwesomeIcon icon={faCheckCircle} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                          <FontAwesomeIcon icon={faCircle} style={{ fontSize: 8 }} /> No
                        </span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      {tradeRequest.targetProduct ? (
                        <Link to={`/product/${tradeRequest.targetProduct.id}`} style={{ textDecoration: 'none', color: '#2563eb' }}>
                          {tradeRequest.targetProduct.name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{tradeRequest.buyer ? tradeRequest.buyer.login : '—'}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{tradeRequest.seller ? tradeRequest.seller.login : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <Link
                          to={`/trade-request/${tradeRequest.id}`}
                          title="View Details"
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>Loading...</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                        <div style={{ fontSize: 14 }}>
                          <Translate contentKey="unipassWebApp.tradeRequest.home.notFound">No Trade Requests found</Translate>
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
                Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalItems}</strong> requests
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

export default TradeRequest;
