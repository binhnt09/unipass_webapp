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

import { getEntities } from './trade-request.reducer';
// import { StatusBadge, TruncatedText, DeleteConfirmModal } from 'app/shared/entity-ui-helpers';
// import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const TradeRequest = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const tradeRequestList = useAppSelector(state => state.tradeRequest.entities);
  const loading = useAppSelector(state => state.tradeRequest.loading);
  const totalItems = useAppSelector(state => state.tradeRequest.totalItems);

  const [statusStats, setStatusStats] = useState([]);

  useEffect(() => {
    axios
      .get('/api/trade-requests/stats/status')
      .then(res => {
        setStatusStats(res.data);
      })
      .catch(e => console.error('Error fetching trade request stats', e));
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
      <h2 id="trade-request-heading" data-cy="TradeRequestHeading">
        <Translate contentKey="unipassWebApp.tradeRequest.home.title">Trade Requests</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.tradeRequest.home.refreshListLabel">Refresh List</Translate>
          </Button>
        </div>
      </h2>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-title">Tổng số Đổi đồ</span>
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
          <span className="summary-title">Đã từ chối (Rejected/Cancelled)</span>
          <span className="summary-value" style={{ color: '#ef4444' }}>
            {statusStats.find(s => s.status === 'REJECTED' || s.status === 'CANCELLED')?.count || 0}
          </span>
        </div>
      </div>

      <div className="chart-container" style={{ height: '350px' }}>
        <h4 className="text-center mb-4" style={{ color: '#374151', fontSize: '1.1rem', fontWeight: 600 }}>
          Phân bố trạng thái Đổi đồ
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
        {tradeRequestList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('topUpAmount')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.topUpAmount">Top Up Amount</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('topUpAmount')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('meetupLocation')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.meetupLocation">Meetup Location</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('meetupLocation')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th className="hand" onClick={sort('isBuyerConfirmed')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.isBuyerConfirmed">Is Buyer Confirmed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isBuyerConfirmed')} />
                </th>
                <th className="hand" onClick={sort('isSellerConfirmed')}>
                  <Translate contentKey="unipassWebApp.tradeRequest.isSellerConfirmed">Is Seller Confirmed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('isSellerConfirmed')} />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.tradeRequest.targetProduct">Target Product</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.tradeRequest.buyer">Buyer</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="unipassWebApp.tradeRequest.seller">Seller</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tradeRequestList.map(tradeRequest => (
                <tr key={`entity-${tradeRequest.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/trade-request/${tradeRequest.id}`} variant="link" size="sm">
                      {tradeRequest.id}
                    </Button>
                  </td>
                  <td>{tradeRequest.topUpAmount}</td>
                  <td>{tradeRequest.status}</td>
                  <td>{tradeRequest.meetupLocation}</td>
                  <td>
                    {tradeRequest.createdAt ? <TextFormat type="date" value={tradeRequest.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {tradeRequest.updatedAt ? <TextFormat type="date" value={tradeRequest.updatedAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{tradeRequest.isBuyerConfirmed ? 'true' : 'false'}</td>
                  <td>{tradeRequest.isSellerConfirmed ? 'true' : 'false'}</td>
                  <td>
                    {tradeRequest.targetProduct ? (
                      <Link to={`/product/${tradeRequest.targetProduct.id}`}>{tradeRequest.targetProduct.name}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{tradeRequest.buyer ? tradeRequest.buyer.login : ''}</td>
                  <td>{tradeRequest.seller ? tradeRequest.seller.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        as={Link as any}
                        to={`/trade-request/${tradeRequest.id}`}
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
              <Translate contentKey="unipassWebApp.tradeRequest.home.notFound">No Trade Requests found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={tradeRequestList && tradeRequestList.length > 0 ? '' : 'd-none'}>
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

export default TradeRequest;
