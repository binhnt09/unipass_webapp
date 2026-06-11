import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './status-history.reducer';

export const StatusHistoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const statusHistoryEntity = useAppSelector(state => state.statusHistory.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="statusHistoryDetailsHeading">
          <Translate contentKey="unipassWebApp.statusHistory.detail.title">StatusHistory</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.id}</dd>
          <dt>
            <span id="referenceId">
              <Translate contentKey="unipassWebApp.statusHistory.referenceId">Reference Id</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.referenceId}</dd>
          <dt>
            <span id="referenceType">
              <Translate contentKey="unipassWebApp.statusHistory.referenceType">Reference Type</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.referenceType}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.statusHistory.status">Status</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.status}</dd>
          <dt>
            <span id="previousStatus">
              <Translate contentKey="unipassWebApp.statusHistory.previousStatus">Previous Status</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.previousStatus}</dd>
          <dt>
            <span id="note">
              <Translate contentKey="unipassWebApp.statusHistory.note">Note</Translate>
            </span>
          </dt>
          <dd>{statusHistoryEntity.note}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.statusHistory.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {statusHistoryEntity.createdAt ? (
              <TextFormat value={statusHistoryEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.statusHistory.actor">Actor</Translate>
          </dt>
          <dd>{statusHistoryEntity.actor ? statusHistoryEntity.actor.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/status-history" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/status-history/${statusHistoryEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default StatusHistoryDetail;
