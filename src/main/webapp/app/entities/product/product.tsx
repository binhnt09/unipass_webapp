import React, { useEffect, useRef, useState } from 'react';
import { TextFormat, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { faSort, faSortDown, faSortUp, faEye, faPencilAlt, faTrash, faSync, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StatusBadge, TruncatedText, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getEntities, deleteEntity } from './product.reducer';

export const Product = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const productList = useAppSelector(state => state.product.entities);
  const loading = useAppSelector(state => state.product.loading);
  const totalItems = useAppSelector(state => state.product.totalItems);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '' });

  const handleApplyFilter = () => setAppliedFilters({ keyword: filterKeyword });
  const handleClearFilter = () => {
    setFilterKeyword('');
    setAppliedFilters({ keyword: '' });
  };

  const filteredList = productList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (
        !item.name?.toLowerCase().includes(kw) &&
        !item.description?.toLowerCase().includes(kw) &&
        !item.brand?.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const updateSuccess = useAppSelector(state => state.product.updateSuccess);
  const prevUpdateSuccess = useRef(false);

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

  useEffect(() => {
    if (updateSuccess && prevUpdateSuccess.current === false) {
      toast.success('Product deleted successfully!');
      sortEntities();
    }
    prevUpdateSuccess.current = updateSuccess;
  }, [updateSuccess]);

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
          <h2 id="product-heading" data-cy="ProductHeading" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Products
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{totalItems} total products in the system</p>
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
            <FontAwesomeIcon icon={faSync} spin={loading} /> Refresh List
          </button>
          <Link
            to="/product/new"
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
            <FontAwesomeIcon icon={faPlus} /> Add Product
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
              placeholder="Tìm theo tên, mô tả, brand..."
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
                  ID <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('name')}>
                  Name <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('description')}>
                  Description <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('price')}>
                  Price <FontAwesomeIcon icon={getSortIconByFieldName('price')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('status')}>
                  Status <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('condition')}>
                  Condition <FontAwesomeIcon icon={getSortIconByFieldName('condition')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('stock')}>
                  Stock <FontAwesomeIcon icon={getSortIconByFieldName('stock')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdAt')}>
                  Created At <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('updatedAt')}>
                  Updated At <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Seller</th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList && filteredList.length > 0 ? (
                filteredList.map(product => (
                  <tr
                    key={`entity-${product.id}`}
                    data-cy="entityTable"
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: '#2563eb' }}>
                        #{product.id}
                      </Link>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500, maxWidth: 160, color: '#111827' }}>
                      <TruncatedText text={product.name} maxLength={30} />
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200, color: '#6b7280' }}>
                      <TruncatedText text={product.description} maxLength={50} />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#059669' }}>
                      {product.price != null ? `${Number(product.price).toLocaleString('vi-VN')} ₫` : '—'}
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={product.status} />
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={product.condition} />
                    </td>
                    <td style={tdStyle}>{product.stock ?? '—'}</td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                      {product.createdAt ? <TextFormat type="date" value={product.createdAt} format={APP_DATE_FORMAT} /> : '—'}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>
                      {product.updatedAt ? <TextFormat type="date" value={product.updatedAt} format={APP_DATE_FORMAT} /> : '—'}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>
                      {product.category ? (
                        <Link to={`/category/${product.category.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {product.category.name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{product.seller ? product.seller.login : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <Link
                          to={`/product/${product.id}`}
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
                          to={`/product/${product.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          onClick={() => {
                            setDeleteId(product.id);
                            setDeleteModalOpen(true);
                          }}
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
                  <td colSpan={12} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>Loading...</span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                        <div style={{ fontSize: 14 }}>No Products found</div>
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
                Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{totalItems}</strong> products
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

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={deleteModalOpen}
        entityName="Product"
        entityId={deleteId}
        onConfirm={() => {
          if (deleteId) dispatch(deleteEntity(deleteId));
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
      />
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

export default Product;
