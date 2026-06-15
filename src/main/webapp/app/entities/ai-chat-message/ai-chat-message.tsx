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

import { getEntities, reset } from './ai-chat-message.reducer';

export const AiChatMessage = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const aiChatMessageList = useAppSelector(state => state.aiChatMessage.entities);
  const loading = useAppSelector(state => state.aiChatMessage.loading);
  const links = useAppSelector(state => state.aiChatMessage.links);
  const updateSuccess = useAppSelector(state => state.aiChatMessage.updateSuccess);

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
      <h2 id="ai-chat-message-heading" data-cy="AiChatMessageHeading">
        <Translate contentKey="unipassWebApp.aiChatMessage.home.title">Ai Chat Messages</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.aiChatMessage.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/ai-chat-message/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.aiChatMessage.home.createLabel">Create new Ai Chat Message</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          dataLength={aiChatMessageList ? aiChatMessageList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className="loader">Loading ...</div>}
        >
          {aiChatMessageList?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th className="hand" onClick={sort('role')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.role">Role</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('role')} />
                  </th>
                  <th className="hand" onClick={sort('content')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.content">Content</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('content')} />
                  </th>
                  <th className="hand" onClick={sort('recommendedProductIds')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.recommendedProductIds">Recommended Product Ids</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('recommendedProductIds')} />
                  </th>
                  <th className="hand" onClick={sort('tokensUsed')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.tokensUsed">Tokens Used</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('tokensUsed')} />
                  </th>
                  <th className="hand" onClick={sort('createdAt')}>
                    <Translate contentKey="unipassWebApp.aiChatMessage.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                  </th>
                  <th>
                    <Translate contentKey="unipassWebApp.aiChatMessage.session">Session</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {aiChatMessageList.map(aiChatMessage => (
                  <tr key={`entity-${aiChatMessage.id}`} data-cy="entityTable">
                    <td>
                      <Button as={Link as any} to={`/ai-chat-message/${aiChatMessage.id}`} variant="link" size="sm">
                        {aiChatMessage.id}
                      </Button>
                    </td>
                    <td>{aiChatMessage.role}</td>
                    <td>{aiChatMessage.content}</td>
                    <td>{aiChatMessage.recommendedProductIds}</td>
                    <td>{aiChatMessage.tokensUsed}</td>
                    <td>
                      {aiChatMessage.createdAt ? <TextFormat type="date" value={aiChatMessage.createdAt} format={APP_DATE_FORMAT} /> : null}
                    </td>
                    <td>
                      {aiChatMessage.session ? (
                        <Link to={`/ai-chat-session/${aiChatMessage.session.id}`}>{aiChatMessage.session.id}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link as any}
                          to={`/ai-chat-message/${aiChatMessage.id}`}
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
                          to={`/ai-chat-message/${aiChatMessage.id}/edit`}
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
                          onClick={() => (window.location.href = `/ai-chat-message/${aiChatMessage.id}/delete`)}
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
                <Translate contentKey="unipassWebApp.aiChatMessage.home.notFound">No Ai Chat Messages found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AiChatMessage;
