import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getPremiumPackages } from 'app/entities/premium-package/premium-package.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './user-premium.reducer';

export const UserPremiumUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const premiumPackages = useAppSelector(state => state.premiumPackage.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const userPremiumEntity = useAppSelector(state => state.userPremium.entity);
  const loading = useAppSelector(state => state.userPremium.loading);
  const updating = useAppSelector(state => state.userPremium.updating);
  const updateSuccess = useAppSelector(state => state.userPremium.updateSuccess);

  const handleClose = () => {
    navigate(`/user-premium${location.search}`);
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
    values.startDate = convertDateTimeToServer(values.startDate);
    values.endDate = convertDateTimeToServer(values.endDate);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...userPremiumEntity,
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
          startDate: displayDefaultDateTime(),
          endDate: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          ...userPremiumEntity,
          startDate: convertDateTimeFromServer(userPremiumEntity.startDate),
          endDate: convertDateTimeFromServer(userPremiumEntity.endDate),
          updatedAt: convertDateTimeFromServer(userPremiumEntity.updatedAt),
          premiumPackage: userPremiumEntity?.premiumPackage?.id,
          user: userPremiumEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.userPremium.home.createOrEditLabel" data-cy="UserPremiumCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.userPremium.home.createOrEditLabel">Create or edit a UserPremium</Translate>
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
                  id="user-premium-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.userPremium.startDate')}
                id="user-premium-startDate"
                name="startDate"
                data-cy="startDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userPremium.endDate')}
                id="user-premium-endDate"
                name="endDate"
                data-cy="endDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userPremium.status')}
                id="user-premium-status"
                name="status"
                data-cy="status"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userPremium.updatedAt')}
                id="user-premium-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="user-premium-premiumPackage"
                name="premiumPackage"
                data-cy="premiumPackage"
                label={translate('unipassWebApp.userPremium.premiumPackage')}
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
                id="user-premium-user"
                name="user"
                data-cy="user"
                label={translate('unipassWebApp.userPremium.user')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-premium" replace variant="info">
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

export default UserPremiumUpdate;
