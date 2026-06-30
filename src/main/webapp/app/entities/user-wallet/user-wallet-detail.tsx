import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-wallet.reducer';

export const UserWalletDetail = () => {
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/wallet-transactions?walletId.equals=${id}&sort=createdAt,desc`)
        .then(res => setTransactions(res.data))
        .catch(err => console.error('Error fetching transactions:', err));
    }
  }, [id, dispatch]);

  const userWalletEntity = useAppSelector(state => state.userWallet.entity);
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px 40px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
              Ví Của {userWalletEntity.user?.login || 'Người dùng'} #{userWalletEntity.id}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              Trạng thái:{' '}
              <strong style={{ color: userWalletEntity.status === 'ACTIVE' ? '#166534' : '#b91c1c' }}>
                {userWalletEntity.status || 'N/A'}
              </strong>
            </p>
          </div>
          <Button as={Link as any} to="/user-wallet" replace variant="outline-secondary" style={{ borderRadius: 8, fontSize: 14 }}>
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại
          </Button>
        </div>

        {/* Balance Overview */}
        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ padding: '24px', backgroundColor: '#ecfdf5', borderRadius: 16, border: '1px solid #a7f3d0' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#065f46' }}>Số dư khả dụng</h3>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#047857' }}>{userWalletEntity.balance?.toLocaleString() || 0} đ</div>
          </div>
          <div style={{ padding: '24px', backgroundColor: '#fff1f2', borderRadius: 16, border: '1px solid #fecdd3' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#9f1239' }}>Số dư đang đóng băng (Frozen)</h3>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#be123c' }}>{userWalletEntity.frozenBalance?.toLocaleString() || 0} đ</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ padding: '32px 40px' }}>
          <h3
            style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FontAwesomeIcon icon="history" className="text-muted" /> Lịch sử Giao dịch
          </h3>

          <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {transactions.length > 0 ? (
              <Table responsive hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                      ID
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                      Ngày tạo
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                      Loại giao dịch
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        fontSize: 13,
                        color: '#64748b',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        textAlign: 'right',
                      }}
                    >
                      Số tiền (đ)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#334155' }}>#{tx.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#334155' }}>
                        {tx.createdAt ? <TextFormat value={tx.createdAt} type="date" format={APP_DATE_FORMAT} /> : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#334155' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: tx.transactionType === 'DEPOSIT' || tx.transactionType === 'REFUND' ? '#dcfce7' : '#fee2e2',
                            color: tx.transactionType === 'DEPOSIT' || tx.transactionType === 'REFUND' ? '#166534' : '#991b1b',
                          }}
                        >
                          {tx.transactionType}
                        </span>
                        {tx.referenceType && <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>({tx.referenceType})</span>}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          fontSize: 14,
                          fontWeight: 600,
                          textAlign: 'right',
                          color: tx.amount > 0 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>Chưa có giao dịch nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDetail;
