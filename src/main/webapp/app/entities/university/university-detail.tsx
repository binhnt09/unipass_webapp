import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './university.reducer';

export const UniversityDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const universityEntity = useAppSelector(state => state.university.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="universityDetailsHeading">
          <Translate contentKey="unipassWebApp.university.detail.title">University</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{universityEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="unipassWebApp.university.code">Code</Translate>
            </span>
          </dt>
          <dd>{universityEntity.code}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.university.name">Name</Translate>
            </span>
          </dt>
          <dd>{universityEntity.name}</dd>
          <dt>
            <span id="logoUrl">
              <Translate contentKey="unipassWebApp.university.logoUrl">Logo Url</Translate>
            </span>
          </dt>
          <dd>{universityEntity.logoUrl}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.university.status">Status</Translate>
            </span>
          </dt>
          <dd>{universityEntity.status}</dd>
        </dl>
        <Button as={Link as any} to="/university" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/university/${universityEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UniversityDetail;
