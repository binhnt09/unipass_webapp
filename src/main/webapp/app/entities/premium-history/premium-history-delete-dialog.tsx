import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { useLocation, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { deleteEntity, getEntity } from './premium-history.reducer';

export const PremiumHistoryDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      setLoadModal(true);
    }
  }, [id, dispatch]);

  const premiumHistoryEntity = useAppSelector(state => state.premiumHistory.entity);
  const updateSuccess = useAppSelector(state => state.premiumHistory.updateSuccess);

  const handleClose = () => {
    navigate(`/premium-history${pageLocation.search}`);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(premiumHistoryEntity.id));
  };

  return (
    <Modal show onHide={handleClose}>
      <ModalHeader data-cy="premiumHistoryDeleteDialogHeading" closeButton>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="unipassWebApp.premiumHistory.delete.question">
        <Translate contentKey="unipassWebApp.premiumHistory.delete.question" interpolate={{ id: premiumHistoryEntity.id }}>
          Are you sure you want to delete this PremiumHistory?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-premiumHistory" data-cy="entityConfirmDeleteButton" variant="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PremiumHistoryDeleteDialog;
