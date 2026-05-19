import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './wallet-transaction.reducer';

export const WalletTransactionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const walletTransactionEntity = useAppSelector(state => state.walletTransaction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="walletTransactionDetailsHeading">
          <Translate contentKey="unipassWebApp.walletTransaction.detail.title">WalletTransaction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.id}</dd>
          <dt>
            <span id="amount">
              <Translate contentKey="unipassWebApp.walletTransaction.amount">Amount</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.amount}</dd>
          <dt>
            <span id="transactionType">
              <Translate contentKey="unipassWebApp.walletTransaction.transactionType">Transaction Type</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.transactionType}</dd>
          <dt>
            <span id="referenceType">
              <Translate contentKey="unipassWebApp.walletTransaction.referenceType">Reference Type</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.referenceType}</dd>
          <dt>
            <span id="referenceId">
              <Translate contentKey="unipassWebApp.walletTransaction.referenceId">Reference Id</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.referenceId}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="unipassWebApp.walletTransaction.description">Description</Translate>
            </span>
          </dt>
          <dd>{walletTransactionEntity.description}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.walletTransaction.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {walletTransactionEntity.createdAt ? (
              <TextFormat value={walletTransactionEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.walletTransaction.wallet">Wallet</Translate>
          </dt>
          <dd>{walletTransactionEntity.wallet ? walletTransactionEntity.wallet.id : ''}</dd>
        </dl>
        <Button as={Link as any} to="/wallet-transaction" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/wallet-transaction/${walletTransactionEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default WalletTransactionDetail;
