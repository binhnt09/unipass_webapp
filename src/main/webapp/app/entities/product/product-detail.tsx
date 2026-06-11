import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product.reducer';

export const ProductDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const productEntity = useAppSelector(state => state.product.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productDetailsHeading">
          <Translate contentKey="unipassWebApp.product.detail.title">Product</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.product.name">Name</Translate>
            </span>
          </dt>
          <dd>{productEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="unipassWebApp.product.description">Description</Translate>
            </span>
          </dt>
          <dd>{productEntity.description}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="unipassWebApp.product.price">Price</Translate>
            </span>
          </dt>
          <dd>{productEntity.price}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.product.status">Status</Translate>
            </span>
          </dt>
          <dd>{productEntity.status}</dd>
          <dt>
            <span id="condition">
              <Translate contentKey="unipassWebApp.product.condition">Condition</Translate>
            </span>
          </dt>
          <dd>{productEntity.condition}</dd>
          <dt>
            <span id="stock">
              <Translate contentKey="unipassWebApp.product.stock">Stock</Translate>
            </span>
          </dt>
          <dd>{productEntity.stock}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.product.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{productEntity.createdAt ? <TextFormat value={productEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.product.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{productEntity.updatedAt ? <TextFormat value={productEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.product.category">Category</Translate>
          </dt>
          <dd>{productEntity.category ? productEntity.category.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.product.seller">Seller</Translate>
          </dt>
          <dd>{productEntity.seller ? productEntity.seller.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/product" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/product/${productEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductDetail;
