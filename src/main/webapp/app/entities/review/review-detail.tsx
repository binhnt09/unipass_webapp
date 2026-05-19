import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './review.reducer';

export const ReviewDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const reviewEntity = useAppSelector(state => state.review.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reviewDetailsHeading">
          <Translate contentKey="unipassWebApp.review.detail.title">Review</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.id}</dd>
          <dt>
            <span id="rating">
              <Translate contentKey="unipassWebApp.review.rating">Rating</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.rating}</dd>
          <dt>
            <span id="comment">
              <Translate contentKey="unipassWebApp.review.comment">Comment</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.comment}</dd>
          <dt>
            <span id="isDeleted">
              <Translate contentKey="unipassWebApp.review.isDeleted">Is Deleted</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.isDeleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.review.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.createdAt ? <TextFormat value={reviewEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.review.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{reviewEntity.updatedAt ? <TextFormat value={reviewEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.review.order">Order</Translate>
          </dt>
          <dd>{reviewEntity.order ? reviewEntity.order.id : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.review.reviewer">Reviewer</Translate>
          </dt>
          <dd>{reviewEntity.reviewer ? reviewEntity.reviewer.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.review.reviewee">Reviewee</Translate>
          </dt>
          <dd>{reviewEntity.reviewee ? reviewEntity.reviewee.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/review" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/review/${reviewEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReviewDetail;
