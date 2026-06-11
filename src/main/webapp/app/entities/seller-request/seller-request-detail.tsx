import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './seller-request.reducer';

export const SellerRequestDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id, dispatch]);

  const sellerRequestEntity = useAppSelector(state => state.sellerRequest.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sellerRequestDetailsHeading">
          <Translate contentKey="unipassWebApp.sellerRequest.detail.title">SellerRequest</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.id}</dd>
          <dt>
            <span id="phoneNumber">
              <Translate contentKey="unipassWebApp.sellerRequest.phoneNumber">Phone Number</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.phoneNumber}</dd>
          <dt>
            <span id="hostelLocation">
              <Translate contentKey="unipassWebApp.sellerRequest.hostelLocation">Hostel Location</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.hostelLocation}</dd>
          <dt>
            <span id="bio">
              <Translate contentKey="unipassWebApp.sellerRequest.bio">Bio</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.bio}</dd>
          <dt>
            <span id="idCardUrl">
              <Translate contentKey="unipassWebApp.sellerRequest.idCardUrl">Id Card Url</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.idCardUrl}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="unipassWebApp.sellerRequest.status">Status</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.status}</dd>
          <dt>
            <span id="rejectionReason">
              <Translate contentKey="unipassWebApp.sellerRequest.rejectionReason">Rejection Reason</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.rejectionReason}</dd>
          <dt>
            <span id="submittedAt">
              <Translate contentKey="unipassWebApp.sellerRequest.submittedAt">Submitted At</Translate>
            </span>
          </dt>
          <dd>
            {sellerRequestEntity.submittedAt ? (
              <TextFormat value={sellerRequestEntity.submittedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="reviewedAt">
              <Translate contentKey="unipassWebApp.sellerRequest.reviewedAt">Reviewed At</Translate>
            </span>
          </dt>
          <dd>
            {sellerRequestEntity.reviewedAt ? (
              <TextFormat value={sellerRequestEntity.reviewedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="reviewedBy">
              <Translate contentKey="unipassWebApp.sellerRequest.reviewedBy">Reviewed By</Translate>
            </span>
          </dt>
          <dd>{sellerRequestEntity.reviewedBy}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.sellerRequest.user">User</Translate>
          </dt>
          <dd>{sellerRequestEntity.user ? sellerRequestEntity.user.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/seller-request" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/seller-request/${sellerRequestEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SellerRequestDetail;
