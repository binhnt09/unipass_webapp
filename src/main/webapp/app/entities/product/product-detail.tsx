import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product.reducer';

export const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
    if (id) {
      axios
        .get(`/api/product-images?productId.equals=${id}`)
        .then(res => {
          setImages(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

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
            <span id="latitude">
              <Translate contentKey="unipassWebApp.product.latitude">Latitude</Translate>
            </span>
          </dt>
          <dd>{productEntity.latitude}</dd>
          <dt>
            <span id="longitude">
              <Translate contentKey="unipassWebApp.product.longitude">Longitude</Translate>
            </span>
          </dt>
          <dd>{productEntity.longitude}</dd>
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
        {/* --- Image Gallery --- */}
        <div className="mt-4 mb-4">
          <h4 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>Hình ảnh sản phẩm</h4>
          {images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {images.map((img: any) => (
                <div
                  key={img.id}
                  style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', aspectRatio: '1/1' }}
                >
                  <img
                    src={`http://localhost:8080${img.imageUrl}`}
                    alt="Product"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {img.isPrimary && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                      }}
                    >
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Chưa có hình ảnh nào cho sản phẩm này.</p>
          )}
        </div>
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
