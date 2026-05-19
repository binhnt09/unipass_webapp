import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './invoice.reducer';

export const InvoiceDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const invoiceEntity = useAppSelector(state => state.invoice.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="invoiceDetailsHeading">
          <Translate contentKey="unipassWebApp.invoice.detail.title">Invoice</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.id}</dd>
          <dt>
            <span id="invoiceNumber">
              <Translate contentKey="unipassWebApp.invoice.invoiceNumber">Invoice Number</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.invoiceNumber}</dd>
          <dt>
            <span id="sourceType">
              <Translate contentKey="unipassWebApp.invoice.sourceType">Source Type</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.sourceType}</dd>
          <dt>
            <span id="sourceId">
              <Translate contentKey="unipassWebApp.invoice.sourceId">Source Id</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.sourceId}</dd>
          <dt>
            <span id="amountPaid">
              <Translate contentKey="unipassWebApp.invoice.amountPaid">Amount Paid</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.amountPaid}</dd>
          <dt>
            <span id="currency">
              <Translate contentKey="unipassWebApp.invoice.currency">Currency</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.currency}</dd>
          <dt>
            <span id="emailSentStatus">
              <Translate contentKey="unipassWebApp.invoice.emailSentStatus">Email Sent Status</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.emailSentStatus}</dd>
          <dt>
            <span id="sentAt">
              <Translate contentKey="unipassWebApp.invoice.sentAt">Sent At</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.sentAt ? <TextFormat value={invoiceEntity.sentAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.invoice.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.createdAt ? <TextFormat value={invoiceEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.invoice.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{invoiceEntity.updatedAt ? <TextFormat value={invoiceEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.invoice.user">User</Translate>
          </dt>
          <dd>{invoiceEntity.user ? invoiceEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/invoice" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/invoice/${invoiceEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default InvoiceDetail;
