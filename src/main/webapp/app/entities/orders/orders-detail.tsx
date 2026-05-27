import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './orders.reducer';

export const OrdersDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const ordersEntity = useAppSelector(state => state.orders.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="ordersDetailsHeading">
          <Translate contentKey="unipassWebApp.orders.detail.title">Orders</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.id}</dd>
          <dt>
            <span id="totalAmount">
              <Translate contentKey="unipassWebApp.orders.totalAmount">Total Amount</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.totalAmount}</dd>
          <dt>
            <span id="platformDiscount">
              <Translate contentKey="unipassWebApp.orders.platformDiscount">Platform Discount</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.platformDiscount}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.orders.status">Status</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.status}</dd>
          <dt>
            <span id="meetupLocation">
              <Translate contentKey="unipassWebApp.orders.meetupLocation">Meetup Location</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.meetupLocation}</dd>
          <dt>
            <span id="cancelReason">
              <Translate contentKey="unipassWebApp.orders.cancelReason">Cancel Reason</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.cancelReason}</dd>
          <dt>
            <span id="buyerNote">
              <Translate contentKey="unipassWebApp.orders.buyerNote">Buyer Note</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.buyerNote}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.orders.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{ordersEntity.createdAt ? <TextFormat value={ordersEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.orders.buyer">Buyer</Translate>
          </dt>
          <dd>{ordersEntity.buyer ? ordersEntity.buyer.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.orders.seller">Seller</Translate>
          </dt>
          <dd>{ordersEntity.seller ? ordersEntity.seller.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/orders" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/orders/${ordersEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrdersDetail;
