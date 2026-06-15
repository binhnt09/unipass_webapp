import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getAiChatSessions } from 'app/entities/ai-chat-session/ai-chat-session.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, updateEntity } from './ai-chat-message.reducer';

export const AiChatMessageUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const aiChatSessions = useAppSelector(state => state.aiChatSession.entities);
  const aiChatMessageEntity = useAppSelector(state => state.aiChatMessage.entity);
  const loading = useAppSelector(state => state.aiChatMessage.loading);
  const updating = useAppSelector(state => state.aiChatMessage.updating);
  const updateSuccess = useAppSelector(state => state.aiChatMessage.updateSuccess);

  const handleClose = () => {
    navigate('/ai-chat-message');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

    dispatch(getAiChatSessions({}));
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
    if (values.tokensUsed !== undefined && typeof values.tokensUsed !== 'number') {
      values.tokensUsed = Number(values.tokensUsed);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);

    const entity = {
      ...aiChatMessageEntity,
      ...values,
      session: aiChatSessions.find(it => it.id.toString() === values.session?.toString()),
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
          ...aiChatMessageEntity,
          createdAt: convertDateTimeFromServer(aiChatMessageEntity.createdAt),
          session: aiChatMessageEntity?.session?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.aiChatMessage.home.createOrEditLabel" data-cy="AiChatMessageCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.aiChatMessage.home.createOrEditLabel">Create or edit a AiChatMessage</Translate>
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
                  id="ai-chat-message-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.aiChatMessage.role')}
                id="ai-chat-message-role"
                name="role"
                data-cy="role"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.aiChatMessage.content')}
                id="ai-chat-message-content"
                name="content"
                data-cy="content"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 5000, message: translate('entity.validation.maxlength', { max: 5000 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.aiChatMessage.recommendedProductIds')}
                id="ai-chat-message-recommendedProductIds"
                name="recommendedProductIds"
                data-cy="recommendedProductIds"
                type="text"
                validate={{
                  maxLength: { value: 5000, message: translate('entity.validation.maxlength', { max: 5000 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.aiChatMessage.tokensUsed')}
                id="ai-chat-message-tokensUsed"
                name="tokensUsed"
                data-cy="tokensUsed"
                type="text"
              />
              <ValidatedField
                label={translate('unipassWebApp.aiChatMessage.createdAt')}
                id="ai-chat-message-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="ai-chat-message-session"
                name="session"
                data-cy="session"
                label={translate('unipassWebApp.aiChatMessage.session')}
                type="select"
              >
                <option value="" key="0" />
                {aiChatSessions
                  ? aiChatSessions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/ai-chat-message" replace variant="info">
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

export default AiChatMessageUpdate;
