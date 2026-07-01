import React, { useEffect, useState } from 'react';
import { TextFormat, Translate, getPaginationState, translate } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faEye, faSort, faSortDown, faSortUp, faSync, faFileExcel } from '@fortawesome/free-solid-svg-icons';
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

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  useEffect(() => {
    // This is needed to force component re-render when language changes
    // and also suppresses the ESLint unused variable warning
  }, [currentLocale]);

  const systemPaymentTransactionList = useAppSelector(state => state.systemPaymentTransaction.entities);
  const loading = useAppSelector(state => state.systemPaymentTransaction.loading);
  const totalItems = useAppSelector(state => state.systemPaymentTransaction.totalItems);

  // Filter States
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
    status: '',
    customerId: '',
    paymentMethod: '',
  });

  const filteredList = systemPaymentTransactionList?.filter(item => {
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase();
      if (!item.appOrderId?.toLowerCase().includes(kw) && !item.gatewayReference?.toLowerCase().includes(kw)) {
        return false;
      }
    }
    if (appliedFilters.fromDate && item.createdAt) {
      if (item.createdAt.substring(0, 10) < appliedFilters.fromDate) return false;
    }
    if (appliedFilters.toDate && item.createdAt) {
      if (item.createdAt.substring(0, 10) > appliedFilters.toDate) return false;
    }
    if (appliedFilters.minAmount && item.amountVnd < Number(appliedFilters.minAmount)) return false;
    if (appliedFilters.maxAmount && item.amountVnd > Number(appliedFilters.maxAmount)) return false;
    if (appliedFilters.status && item.status !== appliedFilters.status) return false;
    if (appliedFilters.customerId && item.user?.login !== appliedFilters.customerId) return false;
    if (appliedFilters.paymentMethod && item.paymentMethod !== appliedFilters.paymentMethod) return false;
    return true;
  });

  const exportToExcel = () => {
    const dataToExport = isFilterApplied ? allFilteredTransactions : filteredList;
    if (!dataToExport || dataToExport.length === 0) return;

    const headers = [
      'ID',
      'Payment Method',
      'Payment Channel',
      'Amount (VND)',
      'Status',
      'Created At',
      'User',
      'App Order ID',
      'Gateway Reference',
    ];
    const rows = dataToExport.map((item: any) => [
      item.id,
      item.paymentMethod || '',
      item.paymentChannel || '',
      item.amountVnd || 0,
      item.status || '',
      item.createdAt || '',
      item.user?.login || '',
      item.appOrderId || '',
      item.gatewayReference || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_transactions_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [revenueStats, setRevenueStats] = useState([]);
  const [allFilteredTransactions, setAllFilteredTransactions] = useState([]);
  const [loadingAllFiltered, setLoadingAllFiltered] = useState(false);

  useEffect(() => {
    axios
      .get('/api/system-payment-transactions/stats/revenue')
      .then(res => {
        setRevenueStats(res.data);
      })
      .catch(e => console.error('Error fetching revenue stats', e));
  }, []);

  const isFilterApplied =
    appliedFilters.keyword ||
    appliedFilters.fromDate ||
    appliedFilters.toDate ||
    appliedFilters.minAmount ||
    appliedFilters.maxAmount ||
    appliedFilters.status ||
    appliedFilters.customerId ||
    appliedFilters.paymentMethod;

  useEffect(() => {
    if (isFilterApplied) {
      setLoadingAllFiltered(true);
      // Fetch a large number of records to get all data across pages for stats calculation
      axios
        .get('/api/system-payment-transactions?page=0&size=100000&sort=id,desc')
        .then(res => {
          const allItems = res.data || [];
          const filtered = allItems.filter((item: any) => {
            if (appliedFilters.keyword) {
              const kw = appliedFilters.keyword.toLowerCase();
              if (!item.appOrderId?.toLowerCase().includes(kw) && !item.gatewayReference?.toLowerCase().includes(kw)) {
                return false;
              }
            }
            if (appliedFilters.fromDate && item.createdAt) {
              if (item.createdAt.substring(0, 10) < appliedFilters.fromDate) return false;
            }
            if (appliedFilters.toDate && item.createdAt) {
              if (item.createdAt.substring(0, 10) > appliedFilters.toDate) return false;
            }
            if (appliedFilters.minAmount && item.amountVnd < Number(appliedFilters.minAmount)) return false;
            if (appliedFilters.maxAmount && item.amountVnd > Number(appliedFilters.maxAmount)) return false;
            if (appliedFilters.status && item.status !== appliedFilters.status) return false;
            if (appliedFilters.customerId && item.user?.login !== appliedFilters.customerId) return false;
            if (appliedFilters.paymentMethod && item.paymentMethod !== appliedFilters.paymentMethod) return false;
            return true;
          });
          setAllFilteredTransactions(filtered);
        })
        .catch(e => console.error('Error fetching all filtered items', e))
        .finally(() => {
          setLoadingAllFiltered(false);
        });
    } else {
      setAllFilteredTransactions([]);
    }
  }, [appliedFilters, isFilterApplied]);

  const computedRevenueStats = Object.values(
    (allFilteredTransactions || []).reduce((acc: any, item: any) => {
      if (item.amountVnd != null && item.createdAt) {
        const date = item.createdAt.substring(0, 10);
        if (!acc[date]) {
          acc[date] = { date, total: 0 };
        }
        acc[date].total += item.amountVnd;
      }
      return acc;
    }, {}),
  ).sort((a: any, b: any) => a.date.localeCompare(b.date));

  const displayRevenueStats = isFilterApplied ? computedRevenueStats : revenueStats;
  const totalRevenue = displayRevenueStats.reduce((sum, item: any) => sum + item.total, 0);
  const avgRevenue = displayRevenueStats.length > 0 ? (totalRevenue / displayRevenueStats.length).toFixed(0) : 0;

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

  const sort = (p: string) => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = (currentPage: number) =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  // ─── Pagination logic ───────────────────────────────────────────────────
  const pageCount = totalItems ? Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage)) : 0;
  const startIndex = totalItems ? (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 : 0;
  const endIndex = totalItems ? Math.min(totalItems, paginationState.activePage * paginationState.itemsPerPage) : 0;
  const pageRange = 2;
  const pageStart = Math.max(1, paginationState.activePage - pageRange);
  const pageEnd = Math.min(pageCount, paginationState.activePage + pageRange);

  // ─── Styles ─────────────────────────────────────────────────────────────
  const thStyle: React.CSSProperties = {
    padding: '11px 14px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
  };
  const tdStyle: React.CSSProperties = {
    padding: '12px 14px',
    fontSize: 13.5,
    color: '#374151',
    verticalAlign: 'middle',
    borderBottom: '1px solid #f3f4f6',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px' }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: '20px 24px',
        }}
      >
        <div>
          <h2
            id="system-payment-transaction-heading"
            data-cy="SystemPaymentTransactionHeading"
            style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}
          >
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.title">System Payment Transactions</Translate>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            {totalItems} <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.title">total transactions</Translate>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={exportToExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #10b981',
              background: '#ecfdf5',
              color: '#059669',
              cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faFileExcel} />{' '}
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.exportExcel">Export Excel</Translate>
          </button>
          <button
            type="button"
            onClick={() => sortEntities()}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <FontAwesomeIcon icon={faSync} spin={loading} />{' '}
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.refreshListLabel">Refresh List</Translate>
          </button>
        </div>
      </div>

      {/* ── Filter Panel ────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '20px 24px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.keyword">Từ khóa</Translate>
            </label>
            <input
              type="text"
              placeholder={translate('unipassWebApp.systemPaymentTransaction.filter.keywordPlaceholder')}
              value={filterKeyword}
              onChange={e => setFilterKeyword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.fromDate">Từ ngày</Translate>
            </label>
            <input
              type="date"
              value={filterFromDate}
              onChange={e => setFilterFromDate(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.toDate">Đến ngày</Translate>
            </label>
            <input
              type="date"
              value={filterToDate}
              onChange={e => setFilterToDate(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.minAmount">Số tiền tối thiểu</Translate>
            </label>
            <input
              type="number"
              placeholder="0"
              value={filterMinAmount}
              onChange={e => setFilterMinAmount(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.maxAmount">Số tiền tối đa</Translate>
            </label>
            <input
              type="number"
              placeholder="0"
              value={filterMaxAmount}
              onChange={e => setFilterMaxAmount(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.status">Trạng thái</Translate>
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                backgroundColor: '#fff',
              }}
            >
              <option value="">{translate('unipassWebApp.systemPaymentTransaction.filter.statusSelect')}</option>
              <option value="SUCCESS">{translate('unipassWebApp.systemPaymentTransaction.filter.statusSuccess')}</option>
              <option value="PENDING">{translate('unipassWebApp.systemPaymentTransaction.filter.statusPending')}</option>
              <option value="FAILED">{translate('unipassWebApp.systemPaymentTransaction.filter.statusFailed')}</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.customerId">ID Khách hàng</Translate>
            </label>
            <input
              type="text"
              placeholder={translate('unipassWebApp.systemPaymentTransaction.filter.customerIdPlaceholder')}
              value={filterCustomerId}
              onChange={e => setFilterCustomerId(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.paymentMethod">Phương thức thanh toán</Translate>
            </label>
            <select
              value={filterPaymentMethod}
              onChange={e => setFilterPaymentMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 13,
                backgroundColor: '#fff',
              }}
            >
              <option value="">{translate('unipassWebApp.systemPaymentTransaction.filter.paymentMethodAll')}</option>
              <option value="BANK_TRANSFER">{translate('unipassWebApp.systemPaymentTransaction.filter.paymentMethodBank')}</option>
              <option value="MOMO">{translate('unipassWebApp.systemPaymentTransaction.filter.paymentMethodMomo')}</option>
              <option value="VNPAY">{translate('unipassWebApp.systemPaymentTransaction.filter.paymentMethodVNPay')}</option>
            </select>
          </div>
          <div style={{ flex: '2 1 300px', display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setAppliedFilters({
                  keyword: filterKeyword,
                  fromDate: filterFromDate,
                  toDate: filterToDate,
                  minAmount: filterMinAmount,
                  maxAmount: filterMaxAmount,
                  status: filterStatus,
                  customerId: filterCustomerId,
                  paymentMethod: filterPaymentMethod,
                });
              }}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '8px 24px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
            >
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.apply">Áp dụng</Translate>
            </button>
            <button
              onClick={() => {
                setFilterKeyword('');
                setFilterFromDate('');
                setFilterToDate('');
                setFilterMinAmount('');
                setFilterMaxAmount('');
                setFilterStatus('');
                setFilterCustomerId('');
                setFilterPaymentMethod('');
                setAppliedFilters({
                  keyword: '',
                  fromDate: '',
                  toDate: '',
                  minAmount: '',
                  maxAmount: '',
                  status: '',
                  customerId: '',
                  paymentMethod: '',
                });
              }}
              style={{
                background: '#fff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                padding: '8px 24px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.filter.clear">Xóa bộ lọc</Translate>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            position: 'relative',
          }}
        >
          {loadingAllFiltered && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <FontAwesomeIcon icon={faSync} spin color="#e5e7eb" />
            </div>
          )}
          <div style={{ fontSize: 28, flexShrink: 0 }}>💰</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.stats.totalRevenue">Tổng Doanh thu</Translate>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#0b5fff', lineHeight: 1.2 }}>{totalRevenue.toLocaleString()} VNĐ</div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            position: 'relative',
          }}
        >
          {loadingAllFiltered && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <FontAwesomeIcon icon={faSync} spin color="#e5e7eb" />
            </div>
          )}
          <div style={{ fontSize: 28, flexShrink: 0 }}>📊</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.stats.avgRevenue">Trung bình / Ngày</Translate>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#10b981', lineHeight: 1.2 }}>
              {Number(avgRevenue).toLocaleString()} VNĐ
            </div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            position: 'relative',
          }}
        >
          {loadingAllFiltered && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <FontAwesomeIcon icon={faSync} spin color="#e5e7eb" />
            </div>
          )}
          <div style={{ fontSize: 28, flexShrink: 0 }}>📅</div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.stats.daysWithTransactions">Số ngày có giao dịch</Translate>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#f59e0b', lineHeight: 1.2 }}>{displayRevenueStats.length}</div>
          </div>
        </div>
      </div>

      {/* ── Growth Chart ────────────────────────────────────────────── */}
      <div
        className="chart-container"
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '20px 24px',
          marginBottom: 20,
          height: 350,
        }}
      >
        <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Translate contentKey="unipassWebApp.systemPaymentTransaction.chart.title">📈 Biến động Doanh thu theo thời gian</Translate>
          {loadingAllFiltered && <FontAwesomeIcon icon={faSync} spin style={{ fontSize: 13, color: '#6b7280' }} />}
        </h4>
        {displayRevenueStats && displayRevenueStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={displayRevenueStats} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
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
                formatter={value => [new Intl.NumberFormat('vi-VN').format(Number(value)) + ' VNĐ', 'Doanh thu']}
                cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#0b5fff" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted mt-5" style={{ fontSize: 14 }}>
            <Translate contentKey="unipassWebApp.systemPaymentTransaction.chart.noData">No revenue data available for chart</Translate>
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('id')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.id">ID</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('id')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('paymentMethod')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentMethod">Payment Method</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('paymentMethod')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('paymentChannel')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.paymentChannel">Payment Channel</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('paymentChannel')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('amountVnd')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.amountVnd">Amount Vnd</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('amountVnd')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('status')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.status">Status</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('status')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('createdAt')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.createdAt">Created At</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('user.login')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.user">User</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('user.login')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'default' }}>Actions</th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('appOrderId')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.appOrderId">App Order Id</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('appOrderId')} size="xs" />
                  </span>
                </th>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={sort('gatewayReference')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Translate contentKey="unipassWebApp.systemPaymentTransaction.gatewayReference">Gateway Reference</Translate>{' '}
                    <FontAwesomeIcon icon={getSortIconByFieldName('gatewayReference')} size="xs" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList?.length > 0 ? (
                filteredList.map(systemPaymentTransaction => (
                  <tr
                    key={`entity-${systemPaymentTransaction.id}`}
                    data-cy="entityTable"
                    style={{ transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#9ca3af', fontSize: 12 }}>
                      <Link
                        to={`/system-payment-transaction/${systemPaymentTransaction.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        #{systemPaymentTransaction.id}
                      </Link>
                    </td>
                    <td style={tdStyle}>{systemPaymentTransaction.paymentMethod}</td>
                    <td style={tdStyle}>{systemPaymentTransaction.paymentChannel}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0b5fff' }}>
                      {systemPaymentTransaction.amountVnd ? `${systemPaymentTransaction.amountVnd.toLocaleString()} VNĐ` : '0 VNĐ'}
                    </td>
                    <td style={tdStyle}>
                      {systemPaymentTransaction.status === 'SUCCESS' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#166534',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /> SUCCESS
                        </span>
                      ) : systemPaymentTransaction.status === 'PENDING' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#fef3c7',
                            color: '#92400e',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706' }} /> PENDING
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#fee2e2',
                            color: '#991b1b',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />{' '}
                          {systemPaymentTransaction.status}
                        </span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#6b7280' }}>
                      {systemPaymentTransaction.createdAt ? (
                        <TextFormat type="date" value={systemPaymentTransaction.createdAt} format={APP_DATE_FORMAT} />
                      ) : null}
                    </td>
                    <td style={{ ...tdStyle, color: '#2563eb', fontWeight: 500 }}>
                      {systemPaymentTransaction.user ? systemPaymentTransaction.user.login : ''}
                    </td>

                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <Link
                          to={`/system-payment-transaction/${systemPaymentTransaction.id}`}
                          title="View details"
                          data-cy="entityDetailsButton"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 7,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: 14,
                            transition: 'all 0.12s',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#f3f4f6';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fff';
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, fontFamily: 'monospace' }}>{systemPaymentTransaction.appOrderId}</td>
                    <td style={{ ...tdStyle, fontSize: 12, fontFamily: 'monospace', color: '#6b7280' }}>
                      {systemPaymentTransaction.gatewayReference}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                    {loading ? (
                      <span style={{ fontSize: 14 }}>
                        <Translate contentKey="unipassWebApp.systemPaymentTransaction.loading">Loading transactions...</Translate>
                      </span>
                    ) : (
                      <div>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>💳</div>
                        <div style={{ fontSize: 14 }}>
                          <Translate contentKey="unipassWebApp.systemPaymentTransaction.home.notFound">
                            No System Payment Transactions found
                          </Translate>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────── */}
        {totalItems > 0 && filteredList.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              padding: '14px 20px',
              borderTop: '1px solid #f3f4f6',
              background: '#fafafa',
            }}
          >
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.pagination.showing">Showing</Translate>{' '}
              <strong>{startIndex}</strong>–<strong>{endIndex}</strong>{' '}
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.pagination.of">of</Translate> <strong>{totalItems}</strong>{' '}
              <Translate contentKey="unipassWebApp.systemPaymentTransaction.pagination.transactions">transactions</Translate>
            </span>
            <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <PaginationButton
                label="← Prev"
                onClick={() => handlePagination(Math.max(1, paginationState.activePage - 1))}
                disabled={paginationState.activePage === 1}
                active={false}
              />
              {pageStart > 1 && (
                <>
                  <PaginationButton label="1" onClick={() => handlePagination(1)} active={false} />
                  {pageStart > 2 && <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>}
                </>
              )}
              {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i).map(page => (
                <PaginationButton
                  key={page}
                  label={String(page)}
                  onClick={() => handlePagination(page)}
                  active={page === paginationState.activePage}
                />
              ))}
              {pageEnd < pageCount && (
                <>
                  {pageEnd < pageCount - 1 && <span style={{ padding: '0 4px', color: '#9ca3af' }}>…</span>}
                  <PaginationButton label={String(pageCount)} onClick={() => handlePagination(pageCount)} active={false} />
                </>
              )}
              <PaginationButton
                label="Next →"
                onClick={() => handlePagination(Math.min(pageCount, paginationState.activePage + 1))}
                disabled={paginationState.activePage === pageCount}
                active={false}
              />
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pagination Button helper ─────────────────────────────────────────────
const PaginationButton = ({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '5px 11px',
      borderRadius: 7,
      border: active ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
      background: active ? '#2563eb' : '#fff',
      color: active ? '#fff' : '#374151',
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'all 0.12s',
      minWidth: 34,
    }}
  >
    {label}
  </button>
);

export default SystemPaymentTransaction;
