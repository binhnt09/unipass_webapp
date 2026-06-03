import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './trade-offered-item.reducer';

export const TradeOfferedItemDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const tradeOfferedItemEntity = useAppSelector(state => state.tradeOfferedItem.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="tradeOfferedItemDetailsHeading">
          <Translate contentKey="unipassWebApp.tradeOfferedItem.detail.title">TradeOfferedItem</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{tradeOfferedItemEntity.id}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.tradeOfferedItem.tradeRequest">Trade Request</Translate>
          </dt>
          <dd>{tradeOfferedItemEntity.tradeRequest ? tradeOfferedItemEntity.tradeRequest.id : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.tradeOfferedItem.offeredProduct">Offered Product</Translate>
          </dt>
          <dd>{tradeOfferedItemEntity.offeredProduct ? tradeOfferedItemEntity.offeredProduct.name : ''}</dd>
        </dl>
        <Button as={Link as any} to="/trade-offered-item" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/trade-offered-item/${tradeOfferedItemEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TradeOfferedItemDetail;
