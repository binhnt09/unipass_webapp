import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getEntities } from './user-profile.reducer';

export const UserProfile = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const userProfileList = useAppSelector(state => state.userProfile.entities);
  const loading = useAppSelector(state => state.userProfile.loading);
  const totalItems = useAppSelector(state => state.userProfile.totalItems);

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
    const { order } = paginationState;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="user-profile-heading" data-cy="UserProfileHeading">
        <Translate contentKey="unipassWebApp.userProfile.home.title">User Profiles</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.userProfile.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/user-profile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.userProfile.home.createLabel">Create new User Profile</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {userProfileList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.userProfile.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('phoneNumber')}>
                  <Translate contentKey="unipassWebApp.userProfile.phoneNumber">Phone Number</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('phoneNumber')} />
                </th>
                <th className="hand" onClick={sort('studentIdNumber')}>
                  <Translate contentKey="unipassWebApp.userProfile.studentIdNumber">Student Id Number</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('studentIdNumber')} />
                </th>
                <th className="hand" onClick={sort('reputationScore')}>
                  <Translate contentKey="unipassWebApp.userProfile.reputationScore">Reputation Score</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reputationScore')} />
                </th>
                <th className="hand" onClick={sort('referralCode')}>
                  <Translate contentKey="unipassWebApp.userProfile.referralCode">Referral Code</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('referralCode')} />
                </th>
                <th className="hand" onClick={sort('fingerprintId')}>
                  <Translate contentKey="unipassWebApp.userProfile.fingerprintId">Fingerprint Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fingerprintId')} />
                </th>
                <th className="hand" onClick={sort('currentPremiumLevel')}>
                  <Translate contentKey="unipassWebApp.userProfile.currentPremiumLevel">Current Premium Level</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('currentPremiumLevel')} />
                </th>
                <th className="hand" onClick={sort('isStudentVerified')}>
                  <Translate contentKey="unipassWebApp.userProfile.isStudentVerified">Is Student Verified</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isStudentVerified')} />
                </th>
                <th className="hand" onClick={sort('isDeleted')}>
                  <Translate contentKey="unipassWebApp.userProfile.isDeleted">Is Deleted</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isDeleted')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.userProfile.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="unipassWebApp.userProfile.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.userProfile.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.userProfile.campus">Campus</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.userProfile.referredBy">Referred By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {userProfileList.map(userProfile => (
                <tr key={`entity-${userProfile.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/user-profile/${userProfile.id}`} variant="link" size="sm">
                      {userProfile.id}
                    </Button>
                  </td>
                  <td>{userProfile.phoneNumber}</td>
                  <td>{userProfile.studentIdNumber}</td>
                  <td>{userProfile.reputationScore}</td>
                  <td>{userProfile.referralCode}</td>
                  <td>{userProfile.fingerprintId}</td>
                  <td>{userProfile.currentPremiumLevel}</td>
                  <td>{userProfile.isStudentVerified ? 'true' : 'false'}</td>
                  <td>{userProfile.isDeleted ? 'true' : 'false'}</td>
                  <td>
                    {userProfile.createdAt ? <TextFormat type="date" value={userProfile.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {userProfile.updatedAt ? <TextFormat type="date" value={userProfile.updatedAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{userProfile.user ? userProfile.user.login : ''}</td>
                  <td>{userProfile.campus ? <Link to={`/campus/${userProfile.campus.id}`}>{userProfile.campus.name}</Link> : ''}</td>
                  <td>{userProfile.referredBy ? userProfile.referredBy.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        as={Link as any}
                        to={`/user-profile/${userProfile.id}`}
                        variant="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        as={Link as any}
                        to={`/user-profile/${userProfile.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        variant="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (globalThis.location.href = `/user-profile/${userProfile.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        variant="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
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
    </div>
  );
};

export default UserProfile;
