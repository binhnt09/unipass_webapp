import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ImageCell, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { toast } from 'react-toastify';

import { getEntities, deleteEntity } from './product-image.reducer';

export const ProductImage = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const productImageList = useAppSelector(state => state.productImage.entities);
  const loading = useAppSelector(state => state.productImage.loading);
  const totalItems = useAppSelector(state => state.productImage.totalItems);
  const updateSuccess = useAppSelector(state => state.productImage.updateSuccess);

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
      toast.success('Product image deleted successfully!');
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

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Product Images</h2>
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
            to="/product-image/new"
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
            <FontAwesomeIcon icon="plus" /> Add New
          </Link>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
        {productImageList?.length > 0 ? (
          <Table responsive style={{ margin: 0 }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th
                  className="hand"
                  onClick={sort('id')}
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Translate contentKey="unipassWebApp.productImage.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th
                  className="hand"
                  onClick={sort('imageUrl')}
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Translate contentKey="unipassWebApp.productImage.imageUrl">Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('imageUrl')} />
                </th>
                <th
                  className="hand"
                  onClick={sort('isPrimary')}
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Translate contentKey="unipassWebApp.productImage.isPrimary">Is Primary</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isPrimary')} />
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Translate contentKey="unipassWebApp.productImage.product">Product</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {productImageList.map(productImage => (
                <tr key={`entity-${productImage.id}`} data-cy="entityTable" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#374151' }}>#{productImage.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <ImageCell src={productImage.imageUrl} alt="Product image" />
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {productImage.isPrimary ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          background: '#d1fae5',
                          color: '#065f46',
                        }}
                      >
                        ✓ Primary
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          background: '#f3f4f6',
                          color: '#6b7280',
                        }}
                      >
                        Secondary
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {productImage.product ? <Link to={`/product/${productImage.product.id}`}>{productImage.product.name}</Link> : ''}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/product-image/${productImage.id}`)}
                        title="View details"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#374151',
                        }}
                      >
                        👁
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/product-image/${productImage.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`,
                          )
                        }
                        title="Edit"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#2563eb',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(productImage.id);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete"
                        style={{
                          padding: '5px 9px',
                          borderRadius: 6,
                          border: '1px solid #fee2e2',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#dc2626',
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
            <div className="alert alert-warning" style={{ margin: 16 }}>
              <Translate contentKey="unipassWebApp.productImage.home.notFound">No Product Images found</Translate>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {totalItems ? (
        <div className={productImageList && productImageList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex" style={{ marginTop: 16 }}>
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        show={deleteModalOpen}
        entityName="Product Image"
        entityId={deleteId}
        onConfirm={() => {
          if (deleteId) dispatch(deleteEntity(deleteId));
          setDeleteModalOpen(false);
        }}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default ProductImage;
