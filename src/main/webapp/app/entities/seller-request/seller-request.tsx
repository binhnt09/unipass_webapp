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
      <h2 id="seller-request-heading" data-cy="SellerRequestHeading">
        <Translate contentKey="unipassWebApp.sellerRequest.home.title">Seller Requests</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.sellerRequest.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/seller-request/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.sellerRequest.home.createLabel">Create new Seller Request</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {sellerRequestList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('phoneNumber')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.phoneNumber">Phone Number</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('phoneNumber')} />
                </th>
                <th className="hand" onClick={sort('hostelLocation')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.hostelLocation">Hostel Location</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hostelLocation')} />
                </th>
                <th className="hand" onClick={sort('bio')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.bio">Bio</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('bio')} />
                </th>
                <th className="hand" onClick={sort('idCardUrl')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.idCardUrl">Id Card Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('idCardUrl')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('rejectionReason')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.rejectionReason">Rejection Reason</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('rejectionReason')} />
                </th>
                <th className="hand" onClick={sort('submittedAt')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.submittedAt">Submitted At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('submittedAt')} />
                </th>
                <th className="hand" onClick={sort('reviewedAt')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.reviewedAt">Reviewed At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reviewedAt')} />
                </th>
                <th className="hand" onClick={sort('reviewedBy')}>
                  <Translate contentKey="unipassWebApp.sellerRequest.reviewedBy">Reviewed By</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reviewedBy')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.sellerRequest.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sellerRequestList.map(sellerRequest => (
                <tr key={`entity-${sellerRequest.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/seller-request/${sellerRequest.id}`} variant="link" size="sm">
                      {sellerRequest.id}
                    </Button>
                  </td>
                  <td>{sellerRequest.phoneNumber}</td>
                  <td>{sellerRequest.hostelLocation}</td>
                  <td>{sellerRequest.bio}</td>
                  <td>{sellerRequest.idCardUrl}</td>
                  <td>{sellerRequest.status}</td>
                  <td>{sellerRequest.rejectionReason}</td>
                  <td>
                    {sellerRequest.submittedAt ? (
                      <TextFormat type="date" value={sellerRequest.submittedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {sellerRequest.reviewedAt ? <TextFormat type="date" value={sellerRequest.reviewedAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{sellerRequest.reviewedBy}</td>
                  <td>{sellerRequest.user ? sellerRequest.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        as={Link as any}
                        to={`/seller-request/${sellerRequest.id}`}
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
                        to={`/seller-request/${sellerRequest.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (globalThis.location.href = `/seller-request/${sellerRequest.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="unipassWebApp.sellerRequest.home.notFound">No Seller Requests found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={sellerRequestList && sellerRequestList.length > 0 ? '' : 'd-none'}>
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

export default SellerRequest;
