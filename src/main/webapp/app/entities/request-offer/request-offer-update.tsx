import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getItemRequests } from 'app/entities/item-request/item-request.reducer';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './request-offer.reducer';

export const RequestOfferUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const itemRequests = useAppSelector(state => state.itemRequest.entities);
  const products = useAppSelector(state => state.product.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const requestOfferEntity = useAppSelector(state => state.requestOffer.entity);
  const loading = useAppSelector(state => state.requestOffer.loading);
  const updating = useAppSelector(state => state.requestOffer.updating);
  const updateSuccess = useAppSelector(state => state.requestOffer.updateSuccess);

  const handleClose = () => {
    navigate(`/request-offer${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getItemRequests({}));
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
    if (values.offerPrice !== undefined && typeof values.offerPrice !== 'number') {
      values.offerPrice = Number(values.offerPrice);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);

    const entity = {
      ...requestOfferEntity,
      ...values,
      request: itemRequests.find(it => it.id.toString() === values.request?.toString()),
      product: products.find(it => it.id.toString() === values.product?.toString()),
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
        }
      : {
          ...requestOfferEntity,
          createdAt: convertDateTimeFromServer(requestOfferEntity.createdAt),
          request: requestOfferEntity?.request?.id,
          product: requestOfferEntity?.product?.id,
          seller: requestOfferEntity?.seller?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.requestOffer.home.createOrEditLabel" data-cy="RequestOfferCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.requestOffer.home.createOrEditLabel">Create or edit a RequestOffer</Translate>
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
                  id="request-offer-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.requestOffer.offerPrice')}
                id="request-offer-offerPrice"
                name="offerPrice"
                data-cy="offerPrice"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.requestOffer.message')}
                id="request-offer-message"
                name="message"
                data-cy="message"
                type="text"
                validate={{
                  maxLength: { value: 5000, message: translate('entity.validation.maxlength', { max: 5000 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.requestOffer.createdAt')}
                id="request-offer-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="request-offer-request"
                name="request"
                data-cy="request"
                label={translate('unipassWebApp.requestOffer.request')}
                type="select"
              >
                <option value="" key="0" />
                {itemRequests
                  ? itemRequests.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="request-offer-product"
                name="product"
                data-cy="product"
                label={translate('unipassWebApp.requestOffer.product')}
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
                id="request-offer-seller"
                name="seller"
                data-cy="seller"
                label={translate('unipassWebApp.requestOffer.seller')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/request-offer" replace variant="info">
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

export default RequestOfferUpdate;
