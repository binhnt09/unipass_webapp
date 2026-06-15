import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './comment-reaction.reducer';

export const CommentReactionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const commentReactionEntity = useAppSelector(state => state.commentReaction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="commentReactionDetailsHeading">
          <Translate contentKey="unipassWebApp.commentReaction.detail.title">CommentReaction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{commentReactionEntity.id}</dd>
          <dt>
            <span id="reactionType">
              <Translate contentKey="unipassWebApp.commentReaction.reactionType">Reaction Type</Translate>
            </span>
          </dt>
          <dd>{commentReactionEntity.reactionType}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.commentReaction.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {commentReactionEntity.createdAt ? (
              <TextFormat value={commentReactionEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.commentReaction.comment">Comment</Translate>
          </dt>
          <dd>{commentReactionEntity.comment ? commentReactionEntity.comment.id : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.commentReaction.user">User</Translate>
          </dt>
          <dd>{commentReactionEntity.user ? commentReactionEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/comment-reaction" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/comment-reaction/${commentReactionEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CommentReactionDetail;
