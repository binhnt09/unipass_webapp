import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-bank-account.reducer';

export const UserBankAccountDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userBankAccountEntity = useAppSelector(state => state.userBankAccount.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userBankAccountDetailsHeading">
          <Translate contentKey="unipassWebApp.userBankAccount.detail.title">UserBankAccount</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userBankAccountEntity.id}</dd>
          <dt>
            <span id="bankName">
              <Translate contentKey="unipassWebApp.userBankAccount.bankName">Bank Name</Translate>
            </span>
          </dt>
          <dd>{userBankAccountEntity.bankName}</dd>
          <dt>
            <span id="accountNumber">
              <Translate contentKey="unipassWebApp.userBankAccount.accountNumber">Account Number</Translate>
            </span>
          </dt>
          <dd>{userBankAccountEntity.accountNumber}</dd>
          <dt>
            <span id="accountName">
              <Translate contentKey="unipassWebApp.userBankAccount.accountName">Account Name</Translate>
            </span>
          </dt>
          <dd>{userBankAccountEntity.accountName}</dd>
          <dt>
            <span id="isDefault">
              <Translate contentKey="unipassWebApp.userBankAccount.isDefault">Is Default</Translate>
            </span>
          </dt>
          <dd>{userBankAccountEntity.isDefault ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.userBankAccount.user">User</Translate>
          </dt>
          <dd>{userBankAccountEntity.user ? userBankAccountEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-bank-account" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-bank-account/${userBankAccountEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserBankAccountDetail;
