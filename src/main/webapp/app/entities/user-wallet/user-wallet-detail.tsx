import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-wallet.reducer';

export const UserWalletDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userWalletEntity = useAppSelector(state => state.userWallet.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userWalletDetailsHeading">
          <Translate contentKey="unipassWebApp.userWallet.detail.title">UserWallet</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userWalletEntity.id}</dd>
          <dt>
            <span id="balance">
              <Translate contentKey="unipassWebApp.userWallet.balance">Balance</Translate>
            </span>
          </dt>
          <dd>{userWalletEntity.balance}</dd>
          <dt>
            <span id="frozenBalance">
              <Translate contentKey="unipassWebApp.userWallet.frozenBalance">Frozen Balance</Translate>
            </span>
          </dt>
          <dd>{userWalletEntity.frozenBalance}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.userWallet.status">Status</Translate>
            </span>
          </dt>
          <dd>{userWalletEntity.status}</dd>
          <dt>
            <span id="isDeleted">
              <Translate contentKey="unipassWebApp.userWallet.isDeleted">Is Deleted</Translate>
            </span>
          </dt>
          <dd>{userWalletEntity.isDeleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.userWallet.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {userWalletEntity.createdAt ? <TextFormat value={userWalletEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.userWallet.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {userWalletEntity.updatedAt ? <TextFormat value={userWalletEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.userWallet.user">User</Translate>
          </dt>
          <dd>{userWalletEntity.user ? userWalletEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-wallet" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-wallet/${userWalletEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserWalletDetail;
