import React, { useEffect, useState } from 'react';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp, faEye, faPencilAlt, faTrash, faSync, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getEntities } from './seller-request.reducer';

export const SellerRequest = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const sellerRequestList = useAppSelector(state => state.sellerRequest.entities);
  const loading = useAppSelector(state => state.sellerRequest.loading);
  const totalItems = useAppSelector(state => state.sellerRequest.totalItems);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
  };

  const filteredList = sellerRequestList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.phoneNumber?.toLowerCase().includes(kw) &&
        !item.hostelLocation?.toLowerCase().includes(kw) &&
        !item.bio?.toLowerCase().includes(kw) &&
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

    if (status === 'APPROVED' || status === 'ACCEPTED' || status === 'SUCCESS') {
      bg = '#dcfce7';
      color = '#166534';
      dot = '#16a34a';
    } else if (status === 'REJECTED' || status === 'CANCELLED' || status === 'FAILED') {
      bg = '#fee2e2';
      color = '#991b1b';
      dot = '#dc2626';
    } else if (status === 'PENDING') {
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
            id="seller-request-heading"
            data-cy="SellerRequestHeading"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}
          >
            <Translate contentKey="unipassWebApp.sellerRequest.home.title">Seller Requests</Translate>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{totalItems} total seller requests in the system</p>
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
            <Translate contentKey="unipassWebApp.sellerRequest.home.refreshListLabel">Refresh List</Translate>
          </button>
          <Link
            to="/seller-request/new"
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
            <Translate contentKey="unipassWebApp.sellerRequest.home.createLabel">Create new Seller Request</Translate>
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
              placeholder="Tìm theo SĐT, địa chỉ, mô tả, user..."
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
                  <Translate contentKey="unipassWebApp.sellerRequest.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('phoneNumber')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.phoneNumber">Phone Number</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('phoneNumber')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('hostelLocation')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.hostelLocation">Hostel Location</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hostelLocation')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('bio')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.bio">Bio</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('bio')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('idCardUrl')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.idCardUrl">Id Card Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('idCardUrl')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('submittedAt')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.submittedAt">Submitted At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('submittedAt')} />
                </th>
                <th style={thStyle}>
                  <Translate contentKey="unipassWebApp.sellerRequest.user">User</Translate> <FontAwesomeIcon icon={faSort} />
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }} />
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? (
                filteredList.map(sellerRequest => (
                  <tr
                    key={`entity-${sellerRequest.id}`}
                    data-cy="entityTable"
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                      <Link to={`/seller-request/${sellerRequest.id}`} style={{ textDecoration: 'none', color: '#2563eb' }}>
                        #{sellerRequest.id}
                      </Link>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#111827' }}>{sellerRequest.phoneNumber}</td>
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
                      {sellerRequest.hostelLocation}
                    </td>
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
                      {sellerRequest.bio}
                    </td>
                    <td style={{ ...tdStyle, color: '#2563eb', fontSize: 13 }}>
                      {sellerRequest.idCardUrl ? (
                        <a
                          href={sellerRequest.idCardUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                          View Document
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>No URL</span>
                      )}
                    </td>
                    <td style={tdStyle}>{getStatusBadge(sellerRequest.status || '')}</td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                      {sellerRequest.submittedAt ? (
                        <TextFormat type="date" value={sellerRequest.submittedAt} format={APP_DATE_FORMAT} />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{sellerRequest.user ? sellerRequest.user.login : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <Link
                          to={`/seller-request/${sellerRequest.id}`}
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
                          to={`/seller-request/${sellerRequest.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                          }}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </Link>
                        <button
                          onClick={() =>
                            (window.location.href = `/seller-request/${sellerRequest.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                          }
                          title="Delete"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #fee2e2',
                            background: '#fff5f5',
                            color: '#dc2626',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fee2e2';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fff5f5';
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
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>Loading...</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                        <div style={{ fontSize: 14 }}>
                          <Translate contentKey="unipassWebApp.sellerRequest.home.notFound">No Seller Requests found</Translate>
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

export default SellerRequest;
