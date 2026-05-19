import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, updateEntity } from './user-search-history.reducer';

export const UserSearchHistoryUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const userSearchHistoryEntity = useAppSelector(state => state.userSearchHistory.entity);
  const loading = useAppSelector(state => state.userSearchHistory.loading);
  const updating = useAppSelector(state => state.userSearchHistory.updating);
  const updateSuccess = useAppSelector(state => state.userSearchHistory.updateSuccess);

  const handleClose = () => {
    navigate('/user-search-history');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

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
    if (values.searchCount !== undefined && typeof values.searchCount !== 'number') {
      values.searchCount = Number(values.searchCount);
    }
    values.lastSearchedAt = convertDateTimeToServer(values.lastSearchedAt);

    const entity = {
      ...userSearchHistoryEntity,
      ...values,
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
          lastSearchedAt: displayDefaultDateTime(),
        }
      : {
          ...userSearchHistoryEntity,
          lastSearchedAt: convertDateTimeFromServer(userSearchHistoryEntity.lastSearchedAt),
          user: userSearchHistoryEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.userSearchHistory.home.createOrEditLabel" data-cy="UserSearchHistoryCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.userSearchHistory.home.createOrEditLabel">Create or edit a UserSearchHistory</Translate>
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
                  id="user-search-history-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.userSearchHistory.keyword')}
                id="user-search-history-keyword"
                name="keyword"
                data-cy="keyword"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.userSearchHistory.searchCount')}
                id="user-search-history-searchCount"
                name="searchCount"
                data-cy="searchCount"
                type="text"
              />
              <ValidatedField
                label={translate('unipassWebApp.userSearchHistory.lastSearchedAt')}
                id="user-search-history-lastSearchedAt"
                name="lastSearchedAt"
                data-cy="lastSearchedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="user-search-history-user"
                name="user"
                data-cy="user"
                label={translate('unipassWebApp.userSearchHistory.user')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-search-history" replace variant="info">
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

export default UserSearchHistoryUpdate;
