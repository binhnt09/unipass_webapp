import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './ai-chat-session.reducer';

export const AiChatSessionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const aiChatSessionEntity = useAppSelector(state => state.aiChatSession.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="aiChatSessionDetailsHeading">
          <Translate contentKey="unipassWebApp.aiChatSession.detail.title">AiChatSession</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{aiChatSessionEntity.id}</dd>
          <dt>
            <span id="contextSummary">
              <Translate contentKey="unipassWebApp.aiChatSession.contextSummary">Context Summary</Translate>
            </span>
          </dt>
          <dd>{aiChatSessionEntity.contextSummary}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.aiChatSession.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {aiChatSessionEntity.createdAt ? (
              <TextFormat value={aiChatSessionEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.aiChatSession.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {aiChatSessionEntity.updatedAt ? (
              <TextFormat value={aiChatSessionEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.aiChatSession.user">User</Translate>
          </dt>
          <dd>{aiChatSessionEntity.user ? aiChatSessionEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/ai-chat-session" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/ai-chat-session/${aiChatSessionEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AiChatSessionDetail;
