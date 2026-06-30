import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import { getEntities, reset } from './wallet-transaction.reducer';

export const WalletTransaction = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [sorting, setSorting] = useState(false);

  const walletTransactionList = useAppSelector(state => state.walletTransaction.entities);
  const loading = useAppSelector(state => state.walletTransaction.loading);
  const links = useAppSelector(state => state.walletTransaction.links);
  const updateSuccess = useAppSelector(state => state.walletTransaction.updateSuccess);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const resetAll = () => {
    dispatch(reset());
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
    dispatch(getEntities({}));
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      resetAll();
    }
  }, [updateSuccess]);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if ((globalThis as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const sort = p => () => {
    dispatch(reset());
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
    setSorting(true);
  };

  const handleSyncList = () => {
    resetAll();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="wallet-transaction-heading" data-cy="WalletTransactionHeading">
        <Translate contentKey="unipassWebApp.walletTransaction.home.title">Wallet Transactions</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.walletTransaction.home.refreshListLabel">Refresh List</Translate>
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          dataLength={walletTransactionList ? walletTransactionList.length : 0}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className="loader">Loading ...</div>}
        >
          {walletTransactionList?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                  </th>
                  <th className="hand" onClick={sort('amount')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.amount">Amount</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('amount')} />
                  </th>
                  <th className="hand" onClick={sort('transactionType')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.transactionType">Transaction Type</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('transactionType')} />
                  </th>
                  <th className="hand" onClick={sort('referenceType')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.referenceType">Reference Type</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('referenceType')} />
                  </th>
                  <th className="hand" onClick={sort('referenceId')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.referenceId">Reference Id</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('referenceId')} />
                  </th>
                  <th className="hand" onClick={sort('description')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.description">Description</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                  </th>
                  <th className="hand" onClick={sort('createdAt')}>
                    <Translate contentKey="unipassWebApp.walletTransaction.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                  </th>
                  <th>
                    <Translate contentKey="unipassWebApp.walletTransaction.wallet">Wallet</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {walletTransactionList.map(walletTransaction => (
                  <tr key={`entity-${walletTransaction.id}`} data-cy="entityTable">
                    <td>
                      <Button as={Link as any} to={`/wallet-transaction/${walletTransaction.id}`} variant="link" size="sm">
                        {walletTransaction.id}
                      </Button>
                    </td>
                    <td>{walletTransaction.amount}</td>
                    <td>{walletTransaction.transactionType}</td>
                    <td>{walletTransaction.referenceType}</td>
                    <td>{walletTransaction.referenceId}</td>
                    <td>{walletTransaction.description}</td>
                    <td>
                      {walletTransaction.createdAt ? (
                        <TextFormat type="date" value={walletTransaction.createdAt} format={APP_DATE_FORMAT} />
                      ) : null}
                    </td>
                    <td>
                      {walletTransaction.wallet ? (
                        <Link to={`/user-wallet/${walletTransaction.wallet.id}`}>{walletTransaction.wallet.id}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link as any}
                          to={`/wallet-transaction/${walletTransaction.id}`}
                          variant="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
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
                <Translate contentKey="unipassWebApp.walletTransaction.home.notFound">No Wallet Transactions found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default WalletTransaction;
