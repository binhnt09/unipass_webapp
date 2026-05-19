import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './report.reducer';

export const ReportDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const reportEntity = useAppSelector(state => state.report.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reportDetailsHeading">
          <Translate contentKey="unipassWebApp.report.detail.title">Report</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{reportEntity.id}</dd>
          <dt>
            <span id="targetType">
              <Translate contentKey="unipassWebApp.report.targetType">Target Type</Translate>
            </span>
          </dt>
          <dd>{reportEntity.targetType}</dd>
          <dt>
            <span id="targetId">
              <Translate contentKey="unipassWebApp.report.targetId">Target Id</Translate>
            </span>
          </dt>
          <dd>{reportEntity.targetId}</dd>
          <dt>
            <span id="reason">
              <Translate contentKey="unipassWebApp.report.reason">Reason</Translate>
            </span>
          </dt>
          <dd>{reportEntity.reason}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.report.status">Status</Translate>
            </span>
          </dt>
          <dd>{reportEntity.status}</dd>
          <dt>
            <span id="isDeleted">
              <Translate contentKey="unipassWebApp.report.isDeleted">Is Deleted</Translate>
            </span>
          </dt>
          <dd>{reportEntity.isDeleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.report.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{reportEntity.createdAt ? <TextFormat value={reportEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.report.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{reportEntity.updatedAt ? <TextFormat value={reportEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.report.reporter">Reporter</Translate>
          </dt>
          <dd>{reportEntity.reporter ? reportEntity.reporter.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.report.reported">Reported</Translate>
          </dt>
          <dd>{reportEntity.reported ? reportEntity.reported.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/report" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/report/${reportEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReportDetail;
