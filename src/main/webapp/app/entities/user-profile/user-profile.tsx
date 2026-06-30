import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StatusBadge, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getEntities, deleteEntity } from './user-profile.reducer';

export const UserProfile = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const userProfileList = useAppSelector(state => state.userProfile.entities);
  const loading = useAppSelector(state => state.userProfile.loading);
  const totalItems = useAppSelector(state => state.userProfile.totalItems);
  const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);

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
      toast.success('Record deleted successfully!');
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
  };

  const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 14 };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>User Profiles</h2>
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
            to="/user-profile/new"
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
      <div
        className="table-responsive"
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}
      >
        {userProfileList?.length > 0 ? (
          <Table responsive style={{ margin: 0 }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th className="hand" onClick={sort('id')} style={thStyle}>
                  ID <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('phoneNumber')} style={thStyle}>
                  Phone Number <FontAwesomeIcon icon={getSortIconByFieldName('phoneNumber')} />
                </th>
                <th className="hand" onClick={sort('studentIdNumber')} style={thStyle}>
                  Student ID <FontAwesomeIcon icon={getSortIconByFieldName('studentIdNumber')} />
                </th>
                <th className="hand" onClick={sort('reputationScore')} style={thStyle}>
                  Reputation <FontAwesomeIcon icon={getSortIconByFieldName('reputationScore')} />
                </th>
                <th className="hand" onClick={sort('referralCode')} style={thStyle}>
                  Referral Code <FontAwesomeIcon icon={getSortIconByFieldName('referralCode')} />
                </th>
                <th className="hand" onClick={sort('currentPremiumLevel')} style={thStyle}>
                  Premium Level <FontAwesomeIcon icon={getSortIconByFieldName('currentPremiumLevel')} />
                </th>
                <th className="hand" onClick={sort('isStudentVerified')} style={thStyle}>
                  Verified <FontAwesomeIcon icon={getSortIconByFieldName('isStudentVerified')} />
                </th>
                <th className="hand" onClick={sort('isDeleted')} style={thStyle}>
                  Status <FontAwesomeIcon icon={getSortIconByFieldName('isDeleted')} />
                </th>
                <th className="hand" onClick={sort('createdAt')} style={thStyle}>
                  Created At <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Campus</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userProfileList.map(userProfile => (
                <tr key={`entity-${userProfile.id}`} data-cy="entityTable" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>#{userProfile.id}</span>
                  </td>
                  <td style={tdStyle}>{userProfile.phoneNumber}</td>
                  <td style={tdStyle}>{userProfile.studentIdNumber}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: '#2563eb' }}>{userProfile.reputationScore}</span>
                  </td>
                  <td style={tdStyle}>{userProfile.referralCode}</td>
                  <td style={tdStyle}>
                    <StatusBadge status={userProfile.currentPremiumLevel} />
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={userProfile.isStudentVerified ? 'VERIFIED' : 'UNVERIFIED'} />
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={userProfile.isDeleted ? 'DELETED' : 'ACTIVE'} />
                  </td>
                  <td style={tdStyle}>
                    {userProfile.createdAt ? <TextFormat type="date" value={userProfile.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td style={tdStyle}>{userProfile.user ? userProfile.user.login : ''}</td>
                  <td style={tdStyle}>
                    {userProfile.campus ? <Link to={`/campus/${userProfile.campus.id}`}>{userProfile.campus.name}</Link> : ''}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/user-profile/${userProfile.id}`)}
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
                            `/user-profile/${userProfile.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`,
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
                          setDeleteId(userProfile.id);
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
            <div className="alert alert-warning">
              <Translate contentKey="unipassWebApp.userProfile.home.notFound">No User Profiles found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={userProfileList && userProfileList.length > 0 ? '' : 'd-none'}>
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
      <DeleteConfirmModal
        show={deleteModalOpen}
        entityName="User Profile"
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

export default UserProfile;
