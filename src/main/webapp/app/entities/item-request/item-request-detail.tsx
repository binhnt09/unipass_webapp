import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './item-request.reducer';

export const ItemRequestDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const itemRequestEntity = useAppSelector(state => state.itemRequest.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="itemRequestDetailsHeading">
          <Translate contentKey="unipassWebApp.itemRequest.detail.title">ItemRequest</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{itemRequestEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="unipassWebApp.itemRequest.title">Title</Translate>
            </span>
          </dt>
          <dd>{itemRequestEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="unipassWebApp.itemRequest.description">Description</Translate>
            </span>
          </dt>
          <dd>{itemRequestEntity.description}</dd>
          <dt>
            <span id="expectedPrice">
              <Translate contentKey="unipassWebApp.itemRequest.expectedPrice">Expected Price</Translate>
            </span>
          </dt>
          <dd>{itemRequestEntity.expectedPrice}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.itemRequest.status">Status</Translate>
            </span>
          </dt>
          <dd>{itemRequestEntity.status}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.itemRequest.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {itemRequestEntity.createdAt ? <TextFormat value={itemRequestEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.itemRequest.category">Category</Translate>
          </dt>
          <dd>{itemRequestEntity.category ? itemRequestEntity.category.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.itemRequest.buyer">Buyer</Translate>
          </dt>
          <dd>{itemRequestEntity.buyer ? itemRequestEntity.buyer.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/item-request" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/item-request/${itemRequestEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ItemRequestDetail;
