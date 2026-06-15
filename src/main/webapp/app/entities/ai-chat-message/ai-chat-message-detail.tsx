import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './ai-chat-message.reducer';

export const AiChatMessageDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const aiChatMessageEntity = useAppSelector(state => state.aiChatMessage.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="aiChatMessageDetailsHeading">
          <Translate contentKey="unipassWebApp.aiChatMessage.detail.title">AiChatMessage</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{aiChatMessageEntity.id}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="unipassWebApp.aiChatMessage.role">Role</Translate>
            </span>
          </dt>
          <dd>{aiChatMessageEntity.role}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="unipassWebApp.aiChatMessage.content">Content</Translate>
            </span>
          </dt>
          <dd>{aiChatMessageEntity.content}</dd>
          <dt>
            <span id="recommendedProductIds">
              <Translate contentKey="unipassWebApp.aiChatMessage.recommendedProductIds">Recommended Product Ids</Translate>
            </span>
          </dt>
          <dd>{aiChatMessageEntity.recommendedProductIds}</dd>
          <dt>
            <span id="tokensUsed">
              <Translate contentKey="unipassWebApp.aiChatMessage.tokensUsed">Tokens Used</Translate>
            </span>
          </dt>
          <dd>{aiChatMessageEntity.tokensUsed}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.aiChatMessage.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {aiChatMessageEntity.createdAt ? (
              <TextFormat value={aiChatMessageEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.aiChatMessage.session">Session</Translate>
          </dt>
          <dd>{aiChatMessageEntity.session ? aiChatMessageEntity.session.id : ''}</dd>
        </dl>
        <Button as={Link as any} to="/ai-chat-message" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/ai-chat-message/${aiChatMessageEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AiChatMessageDetail;
