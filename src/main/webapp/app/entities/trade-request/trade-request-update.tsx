import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './trade-request.reducer';

export const TradeRequestUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const products = useAppSelector(state => state.product.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const tradeRequestEntity = useAppSelector(state => state.tradeRequest.entity);
  const loading = useAppSelector(state => state.tradeRequest.loading);
  const updating = useAppSelector(state => state.tradeRequest.updating);
  const updateSuccess = useAppSelector(state => state.tradeRequest.updateSuccess);

  const handleClose = () => {
    navigate(`/trade-request${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getProducts({}));
    dispatch(getUsers({}));
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
    if (values.topUpAmount !== undefined && typeof values.topUpAmount !== 'number') {
      values.topUpAmount = Number(values.topUpAmount);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...tradeRequestEntity,
      ...values,
      targetProduct: products.find(it => it.id.toString() === values.targetProduct?.toString()),
      buyer: users.find(it => it.id.toString() === values.buyer?.toString()),
      seller: users.find(it => it.id.toString() === values.seller?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          ...tradeRequestEntity,
          createdAt: convertDateTimeFromServer(tradeRequestEntity.createdAt),
          updatedAt: convertDateTimeFromServer(tradeRequestEntity.updatedAt),
          targetProduct: tradeRequestEntity?.targetProduct?.id,
          buyer: tradeRequestEntity?.buyer?.id,
          seller: tradeRequestEntity?.seller?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.tradeRequest.home.createOrEditLabel" data-cy="TradeRequestCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.tradeRequest.home.createOrEditLabel">Create or edit a TradeRequest</Translate>
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
                  id="trade-request-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.topUpAmount')}
                id="trade-request-topUpAmount"
                name="topUpAmount"
                data-cy="topUpAmount"
                type="text"
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.status')}
                id="trade-request-status"
                name="status"
                data-cy="status"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.meetupLocation')}
                id="trade-request-meetupLocation"
                name="meetupLocation"
                data-cy="meetupLocation"
                type="text"
                validate={{
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.createdAt')}
                id="trade-request-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.updatedAt')}
                id="trade-request-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.isBuyerConfirmed')}
                id="trade-request-isBuyerConfirmed"
                name="isBuyerConfirmed"
                data-cy="isBuyerConfirmed"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('unipassWebApp.tradeRequest.isSellerConfirmed')}
                id="trade-request-isSellerConfirmed"
                name="isSellerConfirmed"
                data-cy="isSellerConfirmed"
                check
                type="checkbox"
              />
              <ValidatedField
                id="trade-request-targetProduct"
                name="targetProduct"
                data-cy="targetProduct"
                label={translate('unipassWebApp.tradeRequest.targetProduct')}
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
                id="trade-request-buyer"
                name="buyer"
                data-cy="buyer"
                label={translate('unipassWebApp.tradeRequest.buyer')}
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="trade-request-seller"
                name="seller"
                data-cy="seller"
                label={translate('unipassWebApp.tradeRequest.seller')}
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/trade-request" replace variant="info">
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

export default TradeRequestUpdate;
