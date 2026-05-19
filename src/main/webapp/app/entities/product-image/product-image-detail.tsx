import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product-image.reducer';

export const ProductImageDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productImageEntity = useAppSelector(state => state.productImage.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productImageDetailsHeading">
          <Translate contentKey="unipassWebApp.productImage.detail.title">ProductImage</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.id}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="unipassWebApp.productImage.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.imageUrl}</dd>
          <dt>
            <span id="isPrimary">
              <Translate contentKey="unipassWebApp.productImage.isPrimary">Is Primary</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.isPrimary ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.productImage.product">Product</Translate>
          </dt>
          <dd>{productImageEntity.product ? productImageEntity.product.name : ''}</dd>
        </dl>
        <Button as={Link as any} to="/product-image" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/product-image/${productImageEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductImageDetail;
