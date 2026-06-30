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

import { getEntities, reset } from './ai-chat-session.reducer';

export const AiChatSession = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const aiChatSessionList = useAppSelector(state => state.aiChatSession.entities);
  const loading = useAppSelector(state => state.aiChatSession.loading);
  const links = useAppSelector(state => state.aiChatSession.links);
  const updateSuccess = useAppSelector(state => state.aiChatSession.updateSuccess);

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
      <h2 id="ai-chat-session-heading" data-cy="AiChatSessionHeading">
        <Translate contentKey="unipassWebApp.aiChatSession.home.title">Ai Chat Sessions</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.aiChatSession.home.refreshListLabel">Refresh List</Translate>
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          dataLength={aiChatSessionList ? aiChatSessionList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className="loader">Loading ...</div>}
        >
          {aiChatSessionList?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    <Translate contentKey="unipassWebApp.aiChatSession.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th className="hand" onClick={sort('contextSummary')}>
                    <Translate contentKey="unipassWebApp.aiChatSession.contextSummary">Context Summary</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('contextSummary')} />
                  </th>
                  <th className="hand" onClick={sort('createdAt')}>
                    <Translate contentKey="unipassWebApp.aiChatSession.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                  </th>
                  <th className="hand" onClick={sort('updatedAt')}>
                    <Translate contentKey="unipassWebApp.aiChatSession.updatedAt">Updated At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                  </th>
                  <th>
                    <Translate contentKey="unipassWebApp.aiChatSession.user">User</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {aiChatSessionList.map(aiChatSession => (
                  <tr key={`entity-${aiChatSession.id}`} data-cy="entityTable">
                    <td>
                      <Button as={Link as any} to={`/ai-chat-session/${aiChatSession.id}`} variant="link" size="sm">
                        {aiChatSession.id}
                      </Button>
                    </td>
                    <td>{aiChatSession.contextSummary}</td>
                    <td>
                      {aiChatSession.createdAt ? <TextFormat type="date" value={aiChatSession.createdAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td>
                      {aiChatSession.updatedAt ? <TextFormat type="date" value={aiChatSession.updatedAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td>{aiChatSession.user ? aiChatSession.user.login : ''}</td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link as any}
                          to={`/ai-chat-session/${aiChatSession.id}`}
                          variant="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
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
                <Translate contentKey="unipassWebApp.aiChatSession.home.notFound">No Ai Chat Sessions found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AiChatSession;
