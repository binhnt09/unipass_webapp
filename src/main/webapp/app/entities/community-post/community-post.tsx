import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StatusBadge, TruncatedText, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { toast } from 'react-toastify';

import { getEntities, reset, deleteEntity } from './community-post.reducer';

export const CommunityPost = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const communityPostList = useAppSelector(state => state.communityPost.entities);
  const loading = useAppSelector(state => state.communityPost.loading);
  const links = useAppSelector(state => state.communityPost.links);
  const updateSuccess = useAppSelector(state => state.communityPost.updateSuccess);

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

  const resetAll = () => {
    dispatch(reset());
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
    dispatch(getEntities({}));
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (updateSuccess && prevUpdateSuccess.current === false) {
      toast.success('Community post deleted successfully!');
      resetAll();
    }
    prevUpdateSuccess.current = updateSuccess;
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

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Community Posts</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Manage all community posts</p>
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
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
        <InfiniteScroll
          dataLength={communityPostList ? communityPostList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={
            <div className="loader" style={{ padding: '12px 16px', color: '#6b7280' }}>
              Loading ...
            </div>
          }
        >
          {communityPostList?.length > 0 ? (
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
                    <Translate contentKey="unipassWebApp.communityPost.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th
                    className="hand"
                    onClick={sort('title')}
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
                    <Translate contentKey="unipassWebApp.communityPost.title">Title</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('title')} />
                  </th>
                  <th
                    className="hand"
                    onClick={sort('content')}
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
                    <Translate contentKey="unipassWebApp.communityPost.content">Content</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('content')} />
                  </th>
                  <th
                    className="hand"
                    onClick={sort('status')}
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
                    <Translate contentKey="unipassWebApp.communityPost.status">Status</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                  </th>
                  <th
                    className="hand"
                    onClick={sort('createdAt')}
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
                    <Translate contentKey="unipassWebApp.communityPost.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                  </th>
                  <th
                    className="hand"
                    onClick={sort('updatedAt')}
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
                    <Translate contentKey="unipassWebApp.communityPost.updatedAt">Updated At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
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
                    <Translate contentKey="unipassWebApp.communityPost.category">Category</Translate> <FontAwesomeIcon icon="sort" />
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
                    <Translate contentKey="unipassWebApp.communityPost.author">Author</Translate> <FontAwesomeIcon icon="sort" />
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
                {communityPostList.map(communityPost => (
                  <tr key={`entity-${communityPost.id}`} data-cy="entityTable" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#374151' }}>#{communityPost.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{communityPost.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, maxWidth: 260 }}>
                      <TruncatedText text={communityPost.content} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      <StatusBadge status={communityPost.status} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#6b7280' }}>
                      {communityPost.createdAt ? <TextFormat type="date" value={communityPost.createdAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#6b7280' }}>
                      {communityPost.updatedAt ? <TextFormat type="date" value={communityPost.updatedAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      {communityPost.category ? (
                        <Link to={`/post-category/${communityPost.category.id}`}>{communityPost.category.name}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>{communityPost.author ? communityPost.author.login : ''}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => navigate(`/community-post/${communityPost.id}`)}
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
                          onClick={() => navigate(`/community-post/${communityPost.id}/edit`)}
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
                            setDeleteId(communityPost.id);
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
                <Translate contentKey="unipassWebApp.communityPost.home.notFound">No Community Posts found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        show={deleteModalOpen}
        entityName="Community Post"
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

export default CommunityPost;
