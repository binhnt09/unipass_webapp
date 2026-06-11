import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './cart-item.reducer';

export const CartItemDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const cartItemEntity = useAppSelector(state => state.cartItem.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cartItemDetailsHeading">
          <Translate contentKey="unipassWebApp.cartItem.detail.title">CartItem</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{cartItemEntity.id}</dd>
          <dt>
            <span id="quantity">
              <Translate contentKey="unipassWebApp.cartItem.quantity">Quantity</Translate>
            </span>
          </dt>
          <dd>{cartItemEntity.quantity}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.cartItem.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{cartItemEntity.createdAt ? <TextFormat value={cartItemEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.cartItem.product">Product</Translate>
          </dt>
          <dd>{cartItemEntity.product ? cartItemEntity.product.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.cartItem.user">User</Translate>
          </dt>
          <dd>{cartItemEntity.user ? cartItemEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/cart-item" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/cart-item/${cartItemEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CartItemDetail;
