import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, TextFormat, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
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
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

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

  const thStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: 14,
    color: '#374151',
    verticalAlign: 'middle',
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 id="product-heading" data-cy="ProductHeading" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Products
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{totalItems} total records</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 14 }}
            variant="outline-secondary"
            onClick={handleSyncList}
            disabled={loading}
          >
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh
          </Button>
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
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: '#2563eb',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            <FontAwesomeIcon icon="plus" /> Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        {productList?.length > 0 ? (
          <Table responsive style={{ margin: 0 }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={thStyle} onClick={sort('id')}>
                  ID <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th style={thStyle} onClick={sort('name')}>
                  Name <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
                </th>
                <th style={thStyle} onClick={sort('description')}>
                  Description <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th style={thStyle} onClick={sort('price')}>
                  Price <FontAwesomeIcon icon={getSortIconByFieldName('price')} />
                </th>
                <th style={thStyle} onClick={sort('status')}>
                  Status <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th style={thStyle} onClick={sort('condition')}>
                  Condition <FontAwesomeIcon icon={getSortIconByFieldName('condition')} />
                </th>
                <th style={thStyle} onClick={sort('stock')}>
                  Stock <FontAwesomeIcon icon={getSortIconByFieldName('stock')} />
                </th>
                <th style={thStyle} onClick={sort('createdAt')}>
                  Created At <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th style={thStyle} onClick={sort('updatedAt')}>
                  Updated At <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Seller</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map(product => (
                <tr
                  key={`entity-${product.id}`}
                  data-cy="entityTable"
                  className="entity-table-row"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#2563eb' }}>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                    >
                      #{product.id}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500, maxWidth: 160 }}>
                    <TruncatedText text={product.name} maxLength={30} />
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 200 }}>
                    <TruncatedText text={product.description} maxLength={50} />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {product.price != null ? (
                      <span style={{ color: '#059669' }}>{Number(product.price).toLocaleString('vi-VN')} ₫</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={product.status} />
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={product.condition} />
                  </td>
                  <td style={tdStyle}>{product.stock ?? '—'}</td>
                  <td style={tdStyle}>
                    {product.createdAt ? <TextFormat type="date" value={product.createdAt} format={APP_DATE_FORMAT} /> : '—'}
                  </td>
                  <td style={tdStyle}>
                    {product.updatedAt ? <TextFormat type="date" value={product.updatedAt} format={APP_DATE_FORMAT} /> : '—'}
                  </td>
                  <td style={tdStyle}>
                    {product.category ? (
                      <Link to={`/category/${product.category.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {product.category.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={tdStyle}>{product.seller ? product.seller.login : '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        title="View details"
                        className="entity-action-btn"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#374151',
                          transition: 'all 0.15s',
                        }}
                      >
                        👁
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/product/${product.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`,
                          )
                        }
                        title="Edit"
                        className="entity-action-btn"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#2563eb',
                          transition: 'all 0.15s',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(product.id);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete"
                        className="entity-action-btn"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #fee2e2',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#dc2626',
                          transition: 'all 0.15s',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ fontSize: 15, margin: 0 }}>No products found</p>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {totalItems ? (
        <div className={productList && productList.length > 0 ? '' : 'd-none'} style={{ marginTop: 16 }}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}

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

export default Product;
