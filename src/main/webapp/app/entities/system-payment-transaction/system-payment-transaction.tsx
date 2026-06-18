import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getEntities } from './system-payment-transaction.reducer';

export const SystemPaymentTransaction = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const systemPaymentTransactionList = useAppSelector(state => state.systemPaymentTransaction.entities);
  const loading = useAppSelector(state => state.systemPaymentTransaction.loading);
  const totalItems = useAppSelector(state => state.systemPaymentTransaction.totalItems);

  const [revenueStats, setRevenueStats] = useState([]);

  useEffect(() => {
    axios
      .get('/api/system-payment-transactions/stats/revenue')
      .then(res => {
        setRevenueStats(res.data);
      })
      .catch(e => console.error('Error fetching revenue stats', e));
  }, []);

  const totalRevenue = revenueStats.reduce((sum, item) => sum + item.total, 0);
  const avgRevenue = revenueStats.length > 0 ? (totalRevenue / revenueStats.length).toFixed(0) : 0;

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
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
      <h2 id="system-payment-transaction-heading" data-cy="SystemPaymentTransactionHeading">
        <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.title">System Payment Transactions</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/system-payment-transaction/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.createLabel">
              Create new System Payment Transaction
            </Translate>
          </Link>
        </div>
      </h2>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-title">Tổng Doanh thu</span>
          <span className="summary-value" style={{ color: '#0b5fff' }}>
            {totalRevenue.toLocaleString()} VNĐ
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Trung bình / Ngày</span>
          <span className="summary-value" style={{ color: '#10b981' }}>
            {Number(avgRevenue).toLocaleString()} VNĐ
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Số ngày có giao dịch</span>
          <span className="summary-value" style={{ color: '#f59e0b' }}>
            {revenueStats.length}
          </span>
        </div>
      </div>

      <div className="chart-container" style={{ height: '350px' }}>
        <h4 className="text-center mb-4" style={{ color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
          Biến động Doanh thu theo thời gian
        </h4>
        {revenueStats && revenueStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={revenueStats} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0b5fff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0b5fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={value => new Intl.NumberFormat('vi-VN').format(value)}
              />
              <Tooltip
                formatter={value => [new Intl.NumberFormat('vi-VN').format(Number(value) / 1000) + ' VNĐ', 'Doanh thu']}
                cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#0b5fff" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted mt-5">No revenue data available for chart</div>
        )}
      </div>

      <div className="table-responsive">
        {systemPaymentTransactionList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('paymentMethod')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentMethod">Payment Method</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('paymentMethod')} />
                </th>
                <th className="hand" onClick={sort('paymentChannel')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentChannel">Payment Channel</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('paymentChannel')} />
                </th>
                <th className="hand" onClick={sort('amountVnd')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.amountVnd">Amount Vnd</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('amountVnd')} />
                </th>
                <th className="hand" onClick={sort('coinReceived')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.coinReceived">Coin Received</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('coinReceived')} />
                </th>
                <th className="hand" onClick={sort('gatewayReference')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.gatewayReference">Gateway Reference</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('gatewayReference')} />
                </th>
                <th className="hand" onClick={sort('appOrderId')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.appOrderId">App Order Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('appOrderId')} />
                </th>
                <th className="hand" onClick={sort('bankCode')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.bankCode">Bank Code</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('bankCode')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('rawResponse')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.rawResponse">Raw Response</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('rawResponse')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.systemPaymentTransaction.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {systemPaymentTransactionList.map(systemPaymentTransaction => (
                <tr key={`entity-${systemPaymentTransaction.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/system-payment-transaction/${systemPaymentTransaction.id}`} variant="link" size="sm">
                      {systemPaymentTransaction.id}
                    </Button>
                  </td>
                  <td>{systemPaymentTransaction.paymentMethod}</td>
                  <td>{systemPaymentTransaction.paymentChannel}</td>
                  <td>{systemPaymentTransaction.amountVnd}</td>
                  <td>{systemPaymentTransaction.coinReceived}</td>
                  <td>{systemPaymentTransaction.gatewayReference}</td>
                  <td>{systemPaymentTransaction.appOrderId}</td>
                  <td>{systemPaymentTransaction.bankCode}</td>
                  <td>{systemPaymentTransaction.status}</td>
                  <td>{systemPaymentTransaction.rawResponse}</td>
                  <td>
                    {systemPaymentTransaction.createdAt ? (
                      <TextFormat type="date" value={systemPaymentTransaction.createdAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {systemPaymentTransaction.updatedAt ? (
                      <TextFormat type="date" value={systemPaymentTransaction.updatedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{systemPaymentTransaction.user ? systemPaymentTransaction.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        as={Link as any}
                        to={`/system-payment-transaction/${systemPaymentTransaction.id}`}
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
                        to={`/system-payment-transaction/${systemPaymentTransaction.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        onClick={() =>
                          (window.location.href = `/system-payment-transaction/${systemPaymentTransaction.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
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
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.notFound">No System Payment Transactions found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={systemPaymentTransactionList && systemPaymentTransactionList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SystemPaymentTransaction;
