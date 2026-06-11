import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './order-item.reducer';

export const OrderItemDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const orderItemEntity = useAppSelector(state => state.orderItem.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="orderItemDetailsHeading">
          <Translate contentKey="unipassWebApp.orderItem.detail.title">OrderItem</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.id}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="unipassWebApp.orderItem.price">Price</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.price}</dd>
          <dt>
            <span id="quantity">
              <Translate contentKey="unipassWebApp.orderItem.quantity">Quantity</Translate>
            </span>
          </dt>
          <dd>{orderItemEntity.quantity}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.orderItem.order">Order</Translate>
          </dt>
          <dd>{orderItemEntity.order ? orderItemEntity.order.id : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.orderItem.product">Product</Translate>
          </dt>
          <dd>{orderItemEntity.product ? orderItemEntity.product.name : ''}</dd>
        </dl>
        <Button as={Link as any} to="/order-item" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/order-item/${orderItemEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderItemDetail;
