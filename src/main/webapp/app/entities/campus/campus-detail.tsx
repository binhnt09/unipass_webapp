import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './campus.reducer';

export const CampusDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const campusEntity = useAppSelector(state => state.campus.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="campusDetailsHeading">
          <Translate contentKey="unipassWebApp.campus.detail.title">Campus</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{campusEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.campus.name">Name</Translate>
            </span>
          </dt>
          <dd>{campusEntity.name}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="unipassWebApp.campus.address">Address</Translate>
            </span>
          </dt>
          <dd>{campusEntity.address}</dd>
          <dt>
            <span id="latitude">
              <Translate contentKey="unipassWebApp.campus.latitude">Latitude</Translate>
            </span>
          </dt>
          <dd>{campusEntity.latitude}</dd>
          <dt>
            <span id="longitude">
              <Translate contentKey="unipassWebApp.campus.longitude">Longitude</Translate>
            </span>
          </dt>
          <dd>{campusEntity.longitude}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.campus.university">University</Translate>
          </dt>
          <dd>{campusEntity.university ? campusEntity.university.name : ''}</dd>
        </dl>
        <Button as={Link as any} to="/campus" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/campus/${campusEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CampusDetail;
