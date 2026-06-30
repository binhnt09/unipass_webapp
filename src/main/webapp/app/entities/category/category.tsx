import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { StatusBadge, IconCell, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';

import { getEntities, deleteEntity } from './category.reducer';

export const Category = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const categoryList = useAppSelector(state => state.category.entities);
  const loading = useAppSelector(state => state.category.loading);
  const totalItems = useAppSelector(state => state.category.totalItems);
  const updateSuccess = useAppSelector(state => state.category.updateSuccess);
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
      toast.success('Category deleted successfully!');
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
          <h2 id="category-heading" data-cy="CategoryHeading" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Categories
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
            to="/category/new"
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
            <FontAwesomeIcon icon="plus" /> Add Category
          </Link>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
        {categoryList?.length > 0 ? (
          <Table responsive style={{ margin: 0 }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={thStyle} onClick={sort('id')}>
                  ID <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th style={thStyle} onClick={sort('name')}>
                  Name <FontAwesomeIcon icon={getSortIconByFieldName('name')} />
                </th>
                <th style={thStyle} onClick={sort('iconUrl')}>
                  Icon <FontAwesomeIcon icon={getSortIconByFieldName('iconUrl')} />
                </th>
                <th style={thStyle} onClick={sort('status')}>
                  Status <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th style={thStyle}>Parent Category</th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map(category => (
                <tr
                  key={`entity-${category.id}`}
                  data-cy="entityTable"
                  className="entity-table-row"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#2563eb' }}>
                    <button
                      onClick={() => navigate(`/category/${category.id}`)}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                    >
                      #{category.id}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{category.name || '—'}</td>
                  <td style={tdStyle}>
                    <IconCell src={category.iconUrl} alt={category.name} />
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={category.status} />
                  </td>
                  <td style={tdStyle}>
                    {category.parent ? (
                      <Link to={`/category/${category.parent.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {category.parent.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/category/${category.id}`)}
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
                            `/category/${category.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`,
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
                          setDeleteId(category.id);
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
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
              <p style={{ fontSize: 15, margin: 0 }}>No categories found</p>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {totalItems ? (
        <div className={categoryList && categoryList.length > 0 ? '' : 'd-none'} style={{ marginTop: 16 }}>
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
        entityName="Category"
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

export default Category;
