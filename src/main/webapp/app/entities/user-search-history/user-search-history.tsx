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

import { getEntities, reset } from './user-search-history.reducer';

export const UserSearchHistory = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const userSearchHistoryList = useAppSelector(state => state.userSearchHistory.entities);
  const loading = useAppSelector(state => state.userSearchHistory.loading);
  const links = useAppSelector(state => state.userSearchHistory.links);
  const updateSuccess = useAppSelector(state => state.userSearchHistory.updateSuccess);

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
    const { order } = paginationState;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="user-search-history-heading" data-cy="UserSearchHistoryHeading">
        <Translate contentKey="unipassWebApp.userSearchHistory.home.title">User Search Histories</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.userSearchHistory.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/user-search-history/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.userSearchHistory.home.createLabel">Create new User Search History</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          dataLength={userSearchHistoryList ? userSearchHistoryList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className="loader">Loading ...</div>}
        >
          {userSearchHistoryList?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    <Translate contentKey="unipassWebApp.userSearchHistory.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th className="hand" onClick={sort('keyword')}>
                    <Translate contentKey="unipassWebApp.userSearchHistory.keyword">Keyword</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('keyword')} />
                  </th>
                  <th className="hand" onClick={sort('searchCount')}>
                    <Translate contentKey="unipassWebApp.userSearchHistory.searchCount">Search Count</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('searchCount')} />
                  </th>
                  <th className="hand" onClick={sort('lastSearchedAt')}>
                    <Translate contentKey="unipassWebApp.userSearchHistory.lastSearchedAt">Last Searched At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('lastSearchedAt')} />
                  </th>
                  <th>
                    <Translate contentKey="unipassWebApp.userSearchHistory.user">User</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {userSearchHistoryList.map(userSearchHistory => (
                  <tr key={`entity-${userSearchHistory.id}`} data-cy="entityTable">
                    <td>
                      <Button as={Link as any} to={`/user-search-history/${userSearchHistory.id}`} variant="link" size="sm">
                        {userSearchHistory.id}
                      </Button>
                    </td>
                    <td>{userSearchHistory.keyword}</td>
                    <td>{userSearchHistory.searchCount}</td>
                    <td>
                      {userSearchHistory.lastSearchedAt ? (
                        <TextFormat type="date" value={userSearchHistory.lastSearchedAt} format={APP_DATE_FORMAT} />
                      ) : null}
                    </td>
                    <td>{userSearchHistory.user ? userSearchHistory.user.login : ''}</td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link as any}
                          to={`/user-search-history/${userSearchHistory.id}`}
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
                          to={`/user-search-history/${userSearchHistory.id}/edit`}
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
                          onClick={() => (globalThis.location.href = `/user-search-history/${userSearchHistory.id}/delete`)}
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
                <Translate contentKey="unipassWebApp.userSearchHistory.home.notFound">No User Search Histories found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserSearchHistory;
