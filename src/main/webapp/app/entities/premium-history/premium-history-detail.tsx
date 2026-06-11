import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './premium-history.reducer';

export const PremiumHistoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const premiumHistoryEntity = useAppSelector(state => state.premiumHistory.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="premiumHistoryDetailsHeading">
          <Translate contentKey="unipassWebApp.premiumHistory.detail.title">PremiumHistory</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{premiumHistoryEntity.id}</dd>
          <dt>
            <span id="coinSpent">
              <Translate contentKey="unipassWebApp.premiumHistory.coinSpent">Coin Spent</Translate>
            </span>
          </dt>
          <dd>{premiumHistoryEntity.coinSpent}</dd>
          <dt>
            <span id="durationDays">
              <Translate contentKey="unipassWebApp.premiumHistory.durationDays">Duration Days</Translate>
            </span>
          </dt>
          <dd>{premiumHistoryEntity.durationDays}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.premiumHistory.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {premiumHistoryEntity.createdAt ? (
              <TextFormat value={premiumHistoryEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.premiumHistory.premiumPackage">Premium Package</Translate>
          </dt>
          <dd>{premiumHistoryEntity.premiumPackage ? premiumHistoryEntity.premiumPackage.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.premiumHistory.user">User</Translate>
          </dt>
          <dd>{premiumHistoryEntity.user ? premiumHistoryEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/premium-history" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/premium-history/${premiumHistoryEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PremiumHistoryDetail;
