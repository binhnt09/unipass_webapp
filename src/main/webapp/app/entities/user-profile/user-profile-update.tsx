import React, { useEffect } from 'react';
import { Button, Col, FormText, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCampuses } from 'app/entities/campus/campus.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './user-profile.reducer';

export const UserProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const campuses = useAppSelector(state => state.campus.entities);
  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  const loading = useAppSelector(state => state.userProfile.loading);
  const updating = useAppSelector(state => state.userProfile.updating);
  const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);

  const handleClose = () => {
    navigate(`/user-profile${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getCampuses({}));
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
    if (values.reputationScore !== undefined && typeof values.reputationScore !== 'number') {
      values.reputationScore = Number(values.reputationScore);
    }
    if (values.currentPremiumLevel !== undefined && typeof values.currentPremiumLevel !== 'number') {
      values.currentPremiumLevel = Number(values.currentPremiumLevel);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...userProfileEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user?.toString()),
      campus: campuses.find(it => it.id.toString() === values.campus?.toString()),
      referredBy: users.find(it => it.id.toString() === values.referredBy?.toString()),
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
          ...userProfileEntity,
          createdAt: convertDateTimeFromServer(userProfileEntity.createdAt),
          updatedAt: convertDateTimeFromServer(userProfileEntity.updatedAt),
          user: userProfileEntity?.user?.id,
          campus: userProfileEntity?.campus?.id,
          referredBy: userProfileEntity?.referredBy?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.userProfile.home.createOrEditLabel" data-cy="UserProfileCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.userProfile.home.createOrEditLabel">Create or edit a UserProfile</Translate>
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
                  id="user-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.userProfile.phoneNumber')}
                id="user-profile-phoneNumber"
                name="phoneNumber"
                data-cy="phoneNumber"
                type="text"
                validate={{
                  maxLength: { value: 20, message: translate('entity.validation.maxlength', { max: 20 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.studentIdNumber')}
                id="user-profile-studentIdNumber"
                name="studentIdNumber"
                data-cy="studentIdNumber"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.reputationScore')}
                id="user-profile-reputationScore"
                name="reputationScore"
                data-cy="reputationScore"
                type="text"
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.referralCode')}
                id="user-profile-referralCode"
                name="referralCode"
                data-cy="referralCode"
                type="text"
                validate={{
                  maxLength: { value: 20, message: translate('entity.validation.maxlength', { max: 20 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.fingerprintId')}
                id="user-profile-fingerprintId"
                name="fingerprintId"
                data-cy="fingerprintId"
                type="text"
                validate={{
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.currentPremiumLevel')}
                id="user-profile-currentPremiumLevel"
                name="currentPremiumLevel"
                data-cy="currentPremiumLevel"
                type="text"
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.isStudentVerified')}
                id="user-profile-isStudentVerified"
                name="isStudentVerified"
                data-cy="isStudentVerified"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.isDeleted')}
                id="user-profile-isDeleted"
                name="isDeleted"
                data-cy="isDeleted"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.createdAt')}
                id="user-profile-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('unipassWebApp.userProfile.updatedAt')}
                id="user-profile-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="user-profile-user"
                name="user"
                data-cy="user"
                label={translate('unipassWebApp.userProfile.user')}
                type="select"
                required
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
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <ValidatedField
                id="user-profile-campus"
                name="campus"
                data-cy="campus"
                label={translate('unipassWebApp.userProfile.campus')}
                type="select"
              >
                <option value="" key="0" />
                {campuses
                  ? campuses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="user-profile-referredBy"
                name="referredBy"
                data-cy="referredBy"
                label={translate('unipassWebApp.userProfile.referredBy')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-profile" replace variant="info">
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

export default UserProfileUpdate;
