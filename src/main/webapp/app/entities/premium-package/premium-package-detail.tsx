import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './premium-package.reducer';

export const PremiumPackageDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const premiumPackageEntity = useAppSelector(state => state.premiumPackage.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="premiumPackageDetailsHeading">
          <Translate contentKey="unipassWebApp.premiumPackage.detail.title">PremiumPackage</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.premiumPackage.name">Name</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.name}</dd>
          <dt>
            <span id="priceCoin">
              <Translate contentKey="unipassWebApp.premiumPackage.priceCoin">Price Coin</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.priceCoin}</dd>
          <dt>
            <span id="durationDays">
              <Translate contentKey="unipassWebApp.premiumPackage.durationDays">Duration Days</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.durationDays}</dd>
          <dt>
            <span id="features">
              <Translate contentKey="unipassWebApp.premiumPackage.features">Features</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.features}</dd>
          <dt>
            <span id="isDeleted">
              <Translate contentKey="unipassWebApp.premiumPackage.isDeleted">Is Deleted</Translate>
            </span>
          </dt>
          <dd>{premiumPackageEntity.isDeleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.premiumPackage.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {premiumPackageEntity.createdAt ? (
              <TextFormat value={premiumPackageEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.premiumPackage.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {premiumPackageEntity.updatedAt ? (
              <TextFormat value={premiumPackageEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button as={Link as any} to="/premium-package" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/premium-package/${premiumPackageEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PremiumPackageDetail;
