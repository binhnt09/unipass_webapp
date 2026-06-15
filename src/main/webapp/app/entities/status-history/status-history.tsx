import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import { getEntities, reset } from './status-history.reducer';

export const StatusHistory = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const statusHistoryList = useAppSelector(state => state.statusHistory.entities);
  const loading = useAppSelector(state => state.statusHistory.loading);
  const links = useAppSelector(state => state.statusHistory.links);
  const updateSuccess = useAppSelector(state => state.statusHistory.updateSuccess);

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
    if (updateSuccess) {
      resetAll();
    }
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
      <h2 id="status-history-heading" data-cy="StatusHistoryHeading">
        <Translate contentKey="unipassWebApp.statusHistory.home.title">Status Histories</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.statusHistory.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/status-history/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.statusHistory.home.createLabel">Create new Status History</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          dataLength={statusHistoryList ? statusHistoryList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className="loader">Loading ...</div>}
        >
          {statusHistoryList?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    <Translate contentKey="unipassWebApp.statusHistory.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th className="hand" onClick={sort('referenceId')}>
                    <Translate contentKey="unipassWebApp.statusHistory.referenceId">Reference Id</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('referenceId')} />
                  </th>
                  <th className="hand" onClick={sort('referenceType')}>
                    <Translate contentKey="unipassWebApp.statusHistory.referenceType">Reference Type</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('referenceType')} />
                  </th>
                  <th className="hand" onClick={sort('status')}>
                    <Translate contentKey="unipassWebApp.statusHistory.status">Status</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                  </th>
                  <th className="hand" onClick={sort('previousStatus')}>
                    <Translate contentKey="unipassWebApp.statusHistory.previousStatus">Previous Status</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('previousStatus')} />
                  </th>
                  <th className="hand" onClick={sort('note')}>
                    <Translate contentKey="unipassWebApp.statusHistory.note">Note</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('note')} />
                  </th>
                  <th className="hand" onClick={sort('createdAt')}>
                    <Translate contentKey="unipassWebApp.statusHistory.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                  </th>
                  <th>
                    <Translate contentKey="unipassWebApp.statusHistory.actor">Actor</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {statusHistoryList.map(statusHistory => (
                  <tr key={`entity-${statusHistory.id}`} data-cy="entityTable">
                    <td>
                      <Button as={Link as any} to={`/status-history/${statusHistory.id}`} variant="link" size="sm">
                        {statusHistory.id}
                      </Button>
                    </td>
                    <td>{statusHistory.referenceId}</td>
                    <td>{statusHistory.referenceType}</td>
                    <td>{statusHistory.status}</td>
                    <td>{statusHistory.previousStatus}</td>
                    <td>{statusHistory.note}</td>
                    <td>
                      {statusHistory.createdAt ? <TextFormat type="date" value={statusHistory.createdAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td>{statusHistory.actor ? statusHistory.actor.login : ''}</td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link as any}
                          to={`/status-history/${statusHistory.id}`}
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
                          to={`/status-history/${statusHistory.id}/edit`}
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
                          onClick={() => (window.location.href = `/status-history/${statusHistory.id}/delete`)}
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
                <Translate contentKey="unipassWebApp.statusHistory.home.notFound">No Status Histories found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default StatusHistory;
