import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './post-reaction.reducer';

export const PostReactionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const postReactionEntity = useAppSelector(state => state.postReaction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="postReactionDetailsHeading">
          <Translate contentKey="unipassWebApp.postReaction.detail.title">PostReaction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{postReactionEntity.id}</dd>
          <dt>
            <span id="reactionType">
              <Translate contentKey="unipassWebApp.postReaction.reactionType">Reaction Type</Translate>
            </span>
          </dt>
          <dd>{postReactionEntity.reactionType}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.postReaction.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {postReactionEntity.createdAt ? <TextFormat value={postReactionEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.postReaction.post">Post</Translate>
          </dt>
          <dd>{postReactionEntity.post ? postReactionEntity.post.title : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.postReaction.user">User</Translate>
          </dt>
          <dd>{postReactionEntity.user ? postReactionEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/post-reaction" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/post-reaction/${postReactionEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PostReactionDetail;
