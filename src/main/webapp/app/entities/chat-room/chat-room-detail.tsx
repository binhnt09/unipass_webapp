import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './chat-room.reducer';

export const ChatRoomDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const chatRoomEntity = useAppSelector(state => state.chatRoom.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="chatRoomDetailsHeading">
          <Translate contentKey="unipassWebApp.chatRoom.detail.title">ChatRoom</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{chatRoomEntity.id}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.chatRoom.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{chatRoomEntity.createdAt ? <TextFormat value={chatRoomEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.chatRoom.product">Product</Translate>
          </dt>
          <dd>{chatRoomEntity.product ? chatRoomEntity.product.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.chatRoom.buyer">Buyer</Translate>
          </dt>
          <dd>{chatRoomEntity.buyer ? chatRoomEntity.buyer.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.chatRoom.seller">Seller</Translate>
          </dt>
          <dd>{chatRoomEntity.seller ? chatRoomEntity.seller.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/chat-room" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/chat-room/${chatRoomEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChatRoomDetail;
