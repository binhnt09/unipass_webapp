import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-profile.reducer';

export const UserProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userProfileDetailsHeading">
          <Translate contentKey="unipassWebApp.userProfile.detail.title">UserProfile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.id}</dd>
          <dt>
            <span id="phoneNumber">
              <Translate contentKey="unipassWebApp.userProfile.phoneNumber">Phone Number</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.phoneNumber}</dd>
          <dt>
            <span id="studentIdNumber">
              <Translate contentKey="unipassWebApp.userProfile.studentIdNumber">Student Id Number</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.studentIdNumber}</dd>
          <dt>
            <span id="reputationScore">
              <Translate contentKey="unipassWebApp.userProfile.reputationScore">Reputation Score</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.reputationScore}</dd>
          <dt>
            <span id="referralCode">
              <Translate contentKey="unipassWebApp.userProfile.referralCode">Referral Code</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.referralCode}</dd>
          <dt>
            <span id="fingerprintId">
              <Translate contentKey="unipassWebApp.userProfile.fingerprintId">Fingerprint Id</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.fingerprintId}</dd>
          <dt>
            <span id="currentPremiumLevel">
              <Translate contentKey="unipassWebApp.userProfile.currentPremiumLevel">Current Premium Level</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.currentPremiumLevel}</dd>
          <dt>
            <span id="isStudentVerified">
              <Translate contentKey="unipassWebApp.userProfile.isStudentVerified">Is Student Verified</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.isStudentVerified ? 'true' : 'false'}</dd>
          <dt>
            <span id="isDeleted">
              <Translate contentKey="unipassWebApp.userProfile.isDeleted">Is Deleted</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.isDeleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="unipassWebApp.userProfile.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {userProfileEntity.createdAt ? <TextFormat value={userProfileEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="unipassWebApp.userProfile.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {userProfileEntity.updatedAt ? <TextFormat value={userProfileEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="unipassWebApp.userProfile.user">User</Translate>
          </dt>
          <dd>{userProfileEntity.user ? userProfileEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.userProfile.campus">Campus</Translate>
          </dt>
          <dd>{userProfileEntity.campus ? userProfileEntity.campus.name : ''}</dd>
          <dt>
            <Translate contentKey="unipassWebApp.userProfile.referredBy">Referred By</Translate>
          </dt>
          <dd>{userProfileEntity.referredBy ? userProfileEntity.referredBy.login : ''}</dd>
        </dl>
        <Button as={Link as any} to="/user-profile" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/user-profile/${userProfileEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserProfileDetail;
