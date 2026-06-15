import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './post-category.reducer';

export const PostCategoryDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const postCategoryEntity = useAppSelector(state => state.postCategory.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="postCategoryDetailsHeading">
          <Translate contentKey="unipassWebApp.postCategory.detail.title">PostCategory</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{postCategoryEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="unipassWebApp.postCategory.name">Name</Translate>
            </span>
          </dt>
          <dd>{postCategoryEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="unipassWebApp.postCategory.description">Description</Translate>
            </span>
          </dt>
          <dd>{postCategoryEntity.description}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.postCategory.status">Status</Translate>
            </span>
          </dt>
          <dd>{postCategoryEntity.status}</dd>
        </dl>
        <Button as={Link as any} to="/post-category" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/post-category/${postCategoryEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PostCategoryDetail;
