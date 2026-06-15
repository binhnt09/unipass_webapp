import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './community-post.reducer';

export const CommunityPostDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const communityPostEntity = useAppSelector(state => state.communityPost.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="communityPostDetailsHeading">
          <Translate contentKey="unipassWebApp.communityPost.detail.title">CommunityPost</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{communityPostEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="unipassWebApp.communityPost.title">Title</Translate>
            </span>
          </dt>
          <dd>{communityPostEntity.title}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="unipassWebApp.communityPost.content">Content</Translate>
            </span>
          </dt>
          <dd>{communityPostEntity.content}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.communityPost.status">Status</Translate>
            </span>
          </dt>
          <dd>{communityPostEntity.status}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.communityPost.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {communityPostEntity.createdAt ? (
              <TextFormat value={communityPostEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.communityPost.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {communityPostEntity.updatedAt ? (
              <TextFormat value={communityPostEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.communityPost.category">Category</Translate>
          </dt>
          <dd>{communityPostEntity.category ? communityPostEntity.category.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.communityPost.author">Author</Translate>
          </dt>
          <dd>{communityPostEntity.author ? communityPostEntity.author.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/community-post" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/community-post/${communityPostEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CommunityPostDetail;
