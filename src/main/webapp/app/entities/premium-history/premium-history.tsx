import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { TextFormat, Translate, getSortState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC } from 'app/shared/util/pagination.constants';

import { getEntities } from './premium-history.reducer';

export const PremiumHistory = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const premiumHistoryList = useAppSelector(state => state.premiumHistory.entities);
  const loading = useAppSelector(state => state.premiumHistory.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="premium-history-heading" data-cy="PremiumHistoryHeading">
        <Translate contentKey="unipassWebApp.premiumHistory.home.title">Premium Histories</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.premiumHistory.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/premium-history/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.premiumHistory.home.createLabel">Create new Premium History</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {premiumHistoryList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.premiumHistory.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('coinSpent')}>
                  <Translate contentKey="unipassWebApp.premiumHistory.coinSpent">Coin Spent</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('coinSpent')} />
                </th>
                <th className="hand" onClick={sort('durationDays')}>
                  <Translate contentKey="unipassWebApp.premiumHistory.durationDays">Duration Days</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('durationDays')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.premiumHistory.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.premiumHistory.premiumPackage">Premium Package</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.premiumHistory.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {premiumHistoryList.map(premiumHistory => (
                <tr key={`entity-${premiumHistory.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/premium-history/${premiumHistory.id}`} variant="link" size="sm">
                      {premiumHistory.id}
                    </Button>
                  </td>
                  <td>{premiumHistory.coinSpent}</td>
                  <td>{premiumHistory.durationDays}</td>
                  <td>
                    {premiumHistory.createdAt ? <TextFormat type="date" value={premiumHistory.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {premiumHistory.premiumPackage ? (
                      <Link to={`/premium-package/${premiumHistory.premiumPackage.id}`}>{premiumHistory.premiumPackage.name}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{premiumHistory.user ? premiumHistory.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        as={Link as any}
                        to={`/premium-history/${premiumHistory.id}`}
                        variant="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        as={Link as any}
                        to={`/premium-history/${premiumHistory.id}/edit`}
                        variant="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/premium-history/${premiumHistory.id}/delete`)}
                        variant="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="unipassWebApp.premiumHistory.home.notFound">No Premium Histories found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PremiumHistory;
