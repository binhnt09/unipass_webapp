import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './system-payment-transaction.reducer';

export const SystemPaymentTransactionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const systemPaymentTransactionEntity = useAppSelector(state => state.systemPaymentTransaction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="systemPaymentTransactionDetailsHeading">
          <Translate contentKey="unipassWebApp.systemPaymentTransaction.detail.title">SystemPaymentTransaction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.id}</dd>
          <dt>
            <span id="paymentMethod">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentMethod">Payment Method</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.paymentMethod}</dd>
          <dt>
            <span id="paymentChannel">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentChannel">Payment Channel</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.paymentChannel}</dd>
          <dt>
            <span id="amountVnd">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.amountVnd">Amount Vnd</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.amountVnd}</dd>
          <dt>
            <span id="coinReceived">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.coinReceived">Coin Received</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.coinReceived}</dd>
          <dt>
            <span id="gatewayReference">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.gatewayReference">Gateway Reference</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.gatewayReference}</dd>
          <dt>
            <span id="appOrderId">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.appOrderId">App Order Id</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.appOrderId}</dd>
          <dt>
            <span id="bankCode">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.bankCode">Bank Code</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.bankCode}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.status">Status</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.status}</dd>
          <dt>
            <span id="rawResponse">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.rawResponse">Raw Response</Translate>
            </span>
          </dt>
          <dd>{systemPaymentTransactionEntity.rawResponse}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {systemPaymentTransactionEntity.createdAt ? (
              <TextFormat value={systemPaymentTransactionEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {systemPaymentTransactionEntity.updatedAt ? (
              <TextFormat value={systemPaymentTransactionEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.user">User</Translate>
          </dt>
          <dd>{systemPaymentTransactionEntity.user ? systemPaymentTransactionEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/system-payment-transaction" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/system-payment-transaction/${systemPaymentTransactionEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SystemPaymentTransactionDetail;
