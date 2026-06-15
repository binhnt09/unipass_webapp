import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './post-comment.reducer';

export const PostCommentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const postCommentEntity = useAppSelector(state => state.postComment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="postCommentDetailsHeading">
          <Translate contentKey="unipassWebApp.postComment.detail.title">PostComment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{postCommentEntity.id}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="unipassWebApp.postComment.content">Content</Translate>
            </span>
          </dt>
          <dd>{postCommentEntity.content}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.postComment.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {postCommentEntity.createdAt ? <TextFormat value={postCommentEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.postComment.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {postCommentEntity.updatedAt ? <TextFormat value={postCommentEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.postComment.post">Post</Translate>
          </dt>
          <dd>{postCommentEntity.post ? postCommentEntity.post.title : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.postComment.author">Author</Translate>
          </dt>
          <dd>{postCommentEntity.author ? postCommentEntity.author.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/post-comment" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/post-comment/${postCommentEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PostCommentDetail;
