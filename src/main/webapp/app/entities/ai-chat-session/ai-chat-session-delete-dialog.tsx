import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { deleteEntity, getEntity } from './ai-chat-session.reducer';

export const AiChatSessionDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      setLoadModal(true);
    }
  }, [id, dispatch]);

  const aiChatSessionEntity = useAppSelector(state => state.aiChatSession.entity);
  const updateSuccess = useAppSelector(state => state.aiChatSession.updateSuccess);

  const handleClose = () => {
    navigate('/ai-chat-session');
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(aiChatSessionEntity.id));
  };

  return (
    <Modal show onHide={handleClose}>
      <ModalHeader data-cy="aiChatSessionDeleteDialogHeading" closeButton>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="unipassWebApp.aiChatSession.delete.question">
        <Translate contentKey="unipassWebApp.aiChatSession.delete.question" interpolate={{ id: aiChatSessionEntity.id }}>
          Are you sure you want to delete this AiChatSession?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-aiChatSession" data-cy="entityConfirmDeleteButton" variant="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AiChatSessionDeleteDialog;
