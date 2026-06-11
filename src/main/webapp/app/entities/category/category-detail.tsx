import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './category.reducer';

export const CategoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const categoryEntity = useAppSelector(state => state.category.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="categoryDetailsHeading">
          <Translate contentKey="unipassWebApp.category.detail.title">Category</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{categoryEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.category.name">Name</Translate>
            </span>
          </dt>
          <dd>{categoryEntity.name}</dd>
          <dt>
            <span id="iconUrl">
              <Translate contentKey="unipassWebApp.category.iconUrl">Icon Url</Translate>
            </span>
          </dt>
          <dd>{categoryEntity.iconUrl}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.category.status">Status</Translate>
            </span>
          </dt>
          <dd>{categoryEntity.status}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.category.parent">Parent</Translate>
          </dt>
          <dd>{categoryEntity.parent ? categoryEntity.parent.name : ''}</dd>
        </dl>
        <Button as={Link as any} to="/category" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/category/${categoryEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CategoryDetail;
