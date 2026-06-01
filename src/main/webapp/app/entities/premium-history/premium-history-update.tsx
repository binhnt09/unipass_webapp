import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getPremiumPackages } from 'app/entities/premium-package/premium-package.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './premium-history.reducer';

export const PremiumHistoryUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const premiumPackages = useAppSelector(state => state.premiumPackage.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const premiumHistoryEntity = useAppSelector(state => state.premiumHistory.entity);
  const loading = useAppSelector(state => state.premiumHistory.loading);
  const updating = useAppSelector(state => state.premiumHistory.updating);
  const updateSuccess = useAppSelector(state => state.premiumHistory.updateSuccess);

  const handleClose = () => {
    navigate(`/premium-history${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getPremiumPackages({}));
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
    if (values.coinSpent !== undefined && typeof values.coinSpent !== 'number') {
      values.coinSpent = Number(values.coinSpent);
    }
    if (values.durationDays !== undefined && typeof values.durationDays !== 'number') {
      values.durationDays = Number(values.durationDays);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);

    const entity = {
      ...premiumHistoryEntity,
      ...values,
      premiumPackage: premiumPackages.find(it => it.id.toString() === values.premiumPackage?.toString()),
      user: users.find(it => it.id.toString() === values.user?.toString()),
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
          ...premiumHistoryEntity,
          createdAt: convertDateTimeFromServer(premiumHistoryEntity.createdAt),
          premiumPackage: premiumHistoryEntity?.premiumPackage?.id,
          user: premiumHistoryEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.premiumHistory.home.createOrEditLabel" data-cy="PremiumHistoryCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.premiumHistory.home.createOrEditLabel">Create or edit a PremiumHistory</Translate>
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
                  id="premium-history-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.premiumHistory.coinSpent')}
                id="premium-history-coinSpent"
                name="coinSpent"
                data-cy="coinSpent"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.premiumHistory.durationDays')}
                id="premium-history-durationDays"
                name="durationDays"
                data-cy="durationDays"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.premiumHistory.createdAt')}
                id="premium-history-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="premium-history-premiumPackage"
                name="premiumPackage"
                data-cy="premiumPackage"
                label={translate('unipassWebApp.premiumHistory.premiumPackage')}
                type="select"
              >
                <option value="" key="0" />
                {premiumPackages
                  ? premiumPackages.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="premium-history-user"
                name="user"
                data-cy="user"
                label={translate('unipassWebApp.premiumHistory.user')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/premium-history" replace variant="info">
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

export default PremiumHistoryUpdate;
