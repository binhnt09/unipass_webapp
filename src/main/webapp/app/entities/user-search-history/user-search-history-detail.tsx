import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-search-history.reducer';

export const UserSearchHistoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userSearchHistoryEntity = useAppSelector(state => state.userSearchHistory.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userSearchHistoryDetailsHeading">
          <Translate contentKey="unipassWebApp.userSearchHistory.detail.title">UserSearchHistory</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userSearchHistoryEntity.id}</dd>
          <dt>
            <span id="keyword">
              <Translate contentKey="unipassWebApp.userSearchHistory.keyword">Keyword</Translate>
            </span>
          </dt>
          <dd>{userSearchHistoryEntity.keyword}</dd>
          <dt>
            <span id="searchCount">
              <Translate contentKey="unipassWebApp.userSearchHistory.searchCount">Search Count</Translate>
            </span>
          </dt>
          <dd>{userSearchHistoryEntity.searchCount}</dd>
          <dt>
            <span id="lastSearchedAt">
              <Translate contentKey="unipassWebApp.userSearchHistory.lastSearchedAt">Last Searched At</Translate>
            </span>
          </dt>
          <dd>
            {userSearchHistoryEntity.lastSearchedAt ? (
              <TextFormat value={userSearchHistoryEntity.lastSearchedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.userSearchHistory.user">User</Translate>
          </dt>
          <dd>{userSearchHistoryEntity.user ? userSearchHistoryEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-search-history" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-search-history/${userSearchHistoryEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserSearchHistoryDetail;
