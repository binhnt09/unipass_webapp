import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './trade-request.reducer';

export const TradeRequestDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [dispatch, id]);

  const tradeRequestEntity = useAppSelector(state => state.tradeRequest.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="tradeRequestDetailsHeading">
          <Translate contentKey="unipassWebApp.tradeRequest.detail.title">TradeRequest</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.id}</dd>
          <dt>
            <span id="topUpAmount">
              <Translate contentKey="unipassWebApp.tradeRequest.topUpAmount">Top Up Amount</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.topUpAmount}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.tradeRequest.status">Status</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.status}</dd>
          <dt>
            <span id="meetupLocation">
              <Translate contentKey="unipassWebApp.tradeRequest.meetupLocation">Meetup Location</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.meetupLocation}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.tradeRequest.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {tradeRequestEntity.createdAt ? <TextFormat value={tradeRequestEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.tradeRequest.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {tradeRequestEntity.updatedAt ? <TextFormat value={tradeRequestEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="isBuyerConfirmed">
              <Translate contentKey="unipassWebApp.tradeRequest.isBuyerConfirmed">Is Buyer Confirmed</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.isBuyerConfirmed ? 'true' : 'false'}</dd>
          <dt>
            <span id="isSellerConfirmed">
              <Translate contentKey="unipassWebApp.tradeRequest.isSellerConfirmed">Is Seller Confirmed</Translate>
            </span>
          </dt>
          <dd>{tradeRequestEntity.isSellerConfirmed ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.tradeRequest.targetProduct">Target Product</Translate>
          </dt>
          <dd>{tradeRequestEntity.targetProduct ? tradeRequestEntity.targetProduct.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.tradeRequest.buyer">Buyer</Translate>
          </dt>
          <dd>{tradeRequestEntity.buyer ? tradeRequestEntity.buyer.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.tradeRequest.seller">Seller</Translate>
          </dt>
          <dd>{tradeRequestEntity.seller ? tradeRequestEntity.seller.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/trade-request" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/trade-request/${tradeRequestEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TradeRequestDetail;
