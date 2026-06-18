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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { getEntities } from './orders.reducer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Orders = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const ordersList = useAppSelector(state => state.orders.entities);
  const loading = useAppSelector(state => state.orders.loading);
  const totalItems = useAppSelector(state => state.orders.totalItems);

  const [statusStats, setStatusStats] = useState([]);

  useEffect(() => {
    axios
      .get('/api/orders/stats/status')
      .then(res => {
        setStatusStats(res.data);
      })
      .catch(e => console.error('Error fetching order stats', e));
  }, []);

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
      <h2 id="orders-heading" data-cy="OrdersHeading">
        <Translate contentKey="unipassWebApp.orders.home.title">Orders</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.orders.home.refreshListLabel">Refresh List</Translate>
          </Button>
          {/* <Link to="/admin-orders/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="unipassWebApp.orders.home.createLabel">Create new Orders</Translate>
          </Link> */}
        </div>
      </h2>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-title">Tổng số Đơn hàng</span>
          <span className="summary-value" style={{ color: '#0b5fff' }}>
            {statusStats.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Thành công (Completed)</span>
          <span className="summary-value" style={{ color: '#10b981' }}>
            {statusStats.find(s => s.status === 'COMPLETED' || s.status === 'SUCCESS')?.count || 0}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Đang chờ (Pending)</span>
          <span className="summary-value" style={{ color: '#f59e0b' }}>
            {statusStats.find(s => s.status === 'PENDING_CONFIRM' || s.status === 'PENDING')?.count || 0}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-title">Đã hủy (Cancelled)</span>
          <span className="summary-value" style={{ color: '#ef4444' }}>
            {statusStats.find(s => s.status === 'CANCELLED' || s.status === 'REJECTED')?.count || 0}
          </span>
        </div>
      </div>

      <div className="chart-container" style={{ height: '350px' }}>
        <h4 className="text-center mb-4" style={{ color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
          Phân bố trạng thái Đơn hàng
        </h4>
        {statusStats && statusStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={statusStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50} label={{ position: 'top', fill: '#6b7280', fontSize: 12 }}>
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted mt-5">No status data available for chart</div>
        )}
      </div>

      <div className="table-responsive">
        {ordersList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.orders.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('totalAmount')}>
                  <Translate contentKey="unipassWebApp.orders.totalAmount">Total Amount</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('totalAmount')} />
                </th>
                <th className="hand" onClick={sort('platformDiscount')}>
                  <Translate contentKey="unipassWebApp.orders.platformDiscount">Platform Discount</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('platformDiscount')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.orders.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('meetupLocation')}>
                  <Translate contentKey="unipassWebApp.orders.meetupLocation">Meetup Location</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('meetupLocation')} />
                </th>
                <th className="hand" onClick={sort('cancelReason')}>
                  <Translate contentKey="unipassWebApp.orders.cancelReason">Cancel Reason</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('cancelReason')} />
                </th>
                <th className="hand" onClick={sort('buyerNote')}>
                  <Translate contentKey="unipassWebApp.orders.buyerNote">Buyer Note</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('buyerNote')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.orders.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.orders.buyer">Buyer</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.orders.seller">Seller</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ordersList.map(orders => (
                <tr key={`entity-${orders.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/admin-orders/${orders.id}`} variant="link" size="sm">
                      {orders.id}
                    </Button>
                  </td>
                  <td>{orders.totalAmount}</td>
                  <td>{orders.platformDiscount}</td>
                  <td>{orders.status}</td>
                  <td>{orders.meetupLocation}</td>
                  <td>{orders.cancelReason}</td>
                  <td>{orders.buyerNote}</td>
                  <td>{orders.createdAt ? <TextFormat type="date" value={orders.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{orders.buyer ? orders.buyer.login : ''}</td>
                  <td>{orders.seller ? orders.seller.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button as={Link as any} to={`/admin-orders/${orders.id}`} variant="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        as={Link as any}
                        to={`/admin-orders/${orders.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/admin-orders/${orders.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="unipassWebApp.orders.home.notFound">No Orders found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={ordersList && ordersList.length > 0 ? '' : 'd-none'}>
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

export default Orders;
