import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getEntities as getTradeRequests } from 'app/entities/trade-request/trade-request.reducer';

import { createEntity, getEntity, reset, updateEntity } from './trade-offered-item.reducer';

export const TradeOfferedItemUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const products = useAppSelector(state => state.product.entities);
  const tradeRequests = useAppSelector(state => state.tradeRequest.entities);
  const tradeOfferedItemEntity = useAppSelector(state => state.tradeOfferedItem.entity);
  const loading = useAppSelector(state => state.tradeOfferedItem.loading);
  const updating = useAppSelector(state => state.tradeOfferedItem.updating);
  const updateSuccess = useAppSelector(state => state.tradeOfferedItem.updateSuccess);

  const handleClose = () => {
    navigate(`/trade-offered-item${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getProducts({}));
    dispatch(getTradeRequests({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...tradeOfferedItemEntity,
      ...values,
      offeredProduct: products.find(it => it.id.toString() === values.offeredProduct?.toString()),
      tradeRequest: tradeRequests.find(it => it.id.toString() === values.tradeRequest?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...tradeOfferedItemEntity,
          offeredProduct: tradeOfferedItemEntity?.offeredProduct?.id,
          tradeRequest: tradeOfferedItemEntity?.tradeRequest?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.tradeOfferedItem.home.createOrEditLabel" data-cy="TradeOfferedItemCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.tradeOfferedItem.home.createOrEditLabel">Create or edit a TradeOfferedItem</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew && (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="trade-offered-item-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                id="trade-offered-item-offeredProduct"
                name="offeredProduct"
                data-cy="offeredProduct"
                label={translate('unipassWebApp.tradeOfferedItem.offeredProduct')}
                type="select"
              >
                <option value="" key="0" />
                {products
                  ? products.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="trade-offered-item-tradeRequest"
                name="tradeRequest"
                data-cy="tradeRequest"
                label={translate('unipassWebApp.tradeOfferedItem.tradeRequest')}
                type="select"
              >
                <option value="" key="0" />
                {tradeRequests
                  ? tradeRequests.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/trade-offered-item" replace variant="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button variant="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TradeOfferedItemUpdate;
