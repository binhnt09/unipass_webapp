import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-address.reducer';

export const UserAddressDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userAddressEntity = useAppSelector(state => state.userAddress.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userAddressDetailsHeading">
          <Translate contentKey="unipassWebApp.userAddress.detail.title">UserAddress</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.userAddress.name">Name</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.name}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="unipassWebApp.userAddress.address">Address</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.address}</dd>
          <dt>
            <span id="latitude">
              <Translate contentKey="unipassWebApp.userAddress.latitude">Latitude</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.latitude}</dd>
          <dt>
            <span id="longitude">
              <Translate contentKey="unipassWebApp.userAddress.longitude">Longitude</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.longitude}</dd>
          <dt>
            <span id="isDefault">
              <Translate contentKey="unipassWebApp.userAddress.isDefault">Is Default</Translate>
            </span>
          </dt>
          <dd>{userAddressEntity.isDefault ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.userAddress.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {userAddressEntity.createdAt ? <TextFormat value={userAddressEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.userAddress.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {userAddressEntity.updatedAt ? <TextFormat value={userAddressEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.userAddress.user">User</Translate>
          </dt>
          <dd>{userAddressEntity.user ? userAddressEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-address" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-address/${userAddressEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserAddressDetail;
