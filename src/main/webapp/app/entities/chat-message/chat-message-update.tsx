import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getChatRooms } from 'app/entities/chat-room/chat-room.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, updateEntity } from './chat-message.reducer';

export const ChatMessageUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const chatRooms = useAppSelector(state => state.chatRoom.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const chatMessageEntity = useAppSelector(state => state.chatMessage.entity);
  const loading = useAppSelector(state => state.chatMessage.loading);
  const updating = useAppSelector(state => state.chatMessage.updating);
  const updateSuccess = useAppSelector(state => state.chatMessage.updateSuccess);

  const handleClose = () => {
    navigate('/chat-message');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

    dispatch(getChatRooms({}));
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
    values.createdAt = convertDateTimeToServer(values.createdAt);

    const entity = {
      ...chatMessageEntity,
      ...values,
      room: chatRooms.find(it => it.id.toString() === values.room?.toString()),
      sender: users.find(it => it.id.toString() === values.sender?.toString()),
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
          ...chatMessageEntity,
          createdAt: convertDateTimeFromServer(chatMessageEntity.createdAt),
          room: chatMessageEntity?.room?.id,
          sender: chatMessageEntity?.sender?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.chatMessage.home.createOrEditLabel" data-cy="ChatMessageCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.chatMessage.home.createOrEditLabel">Create or edit a ChatMessage</Translate>
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
                  id="chat-message-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.chatMessage.content')}
                id="chat-message-content"
                name="content"
                data-cy="content"
                type="textarea"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.chatMessage.isRead')}
                id="chat-message-isRead"
                name="isRead"
                data-cy="isRead"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('unipassWebApp.chatMessage.createdAt')}
                id="chat-message-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="chat-message-room"
                name="room"
                data-cy="room"
                label={translate('unipassWebApp.chatMessage.room')}
                type="select"
              >
                <option value="" key="0" />
                {chatRooms
                  ? chatRooms.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="chat-message-sender"
                name="sender"
                data-cy="sender"
                label={translate('unipassWebApp.chatMessage.sender')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/chat-message" replace variant="info">
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

export default ChatMessageUpdate;
