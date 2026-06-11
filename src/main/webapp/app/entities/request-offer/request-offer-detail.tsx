import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './request-offer.reducer';

export const RequestOfferDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const requestOfferEntity = useAppSelector(state => state.requestOffer.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="requestOfferDetailsHeading">
          <Translate contentKey="unipassWebApp.requestOffer.detail.title">RequestOffer</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{requestOfferEntity.id}</dd>
          <dt>
            <span id="offerPrice">
              <Translate contentKey="unipassWebApp.requestOffer.offerPrice">Offer Price</Translate>
            </span>
          </dt>
          <dd>{requestOfferEntity.offerPrice}</dd>
          <dt>
            <span id="message">
              <Translate contentKey="unipassWebApp.requestOffer.message">Message</Translate>
            </span>
          </dt>
          <dd>{requestOfferEntity.message}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.requestOffer.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {requestOfferEntity.createdAt ? <TextFormat value={requestOfferEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.requestOffer.request">Request</Translate>
          </dt>
          <dd>{requestOfferEntity.request ? requestOfferEntity.request.title : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.requestOffer.product">Product</Translate>
          </dt>
          <dd>{requestOfferEntity.product ? requestOfferEntity.product.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.requestOffer.seller">Seller</Translate>
          </dt>
          <dd>{requestOfferEntity.seller ? requestOfferEntity.seller.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/request-offer" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/request-offer/${requestOfferEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default RequestOfferDetail;
