import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-premium.reducer';

export const UserPremiumDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userPremiumEntity = useAppSelector(state => state.userPremium.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userPremiumDetailsHeading">
          <Translate contentKey="unipassWebApp.userPremium.detail.title">UserPremium</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userPremiumEntity.id}</dd>
          <dt>
            <span id="startDate">
              <Translate contentKey="unipassWebApp.userPremium.startDate">Start Date</Translate>
            </span>
          </dt>
          <dd>
            {userPremiumEntity.startDate ? <TextFormat value={userPremiumEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endDate">
              <Translate contentKey="unipassWebApp.userPremium.endDate">End Date</Translate>
            </span>
          </dt>
          <dd>
            {userPremiumEntity.endDate ? <TextFormat value={userPremiumEntity.endDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.userPremium.status">Status</Translate>
            </span>
          </dt>
          <dd>{userPremiumEntity.status}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.userPremium.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {userPremiumEntity.updatedAt ? <TextFormat value={userPremiumEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.userPremium.premiumPackage">Premium Package</Translate>
          </dt>
          <dd>{userPremiumEntity.premiumPackage ? userPremiumEntity.premiumPackage.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.userPremium.user">User</Translate>
          </dt>
          <dd>{userPremiumEntity.user ? userPremiumEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-premium" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-premium/${userPremiumEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserPremiumDetail;
