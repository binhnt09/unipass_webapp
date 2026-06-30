import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './orders.reducer';

export const OrdersDetail = () => {
  const dispatch = useAppDispatch();
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/order-items?orderId.equals=${id}`)
        .then(res => setOrderItems(res.data))
        .catch(err => console.error('Error fetching order items:', err));
    }
  }, [id, dispatch]);

  const ordersEntity = useAppSelector(state => state.orders.entity);
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Invoice Header */}
        <div
          style={{
            padding: '32px 40px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>Hóa Đơn #{ordersEntity.id}</h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              Ngày tạo:{' '}
              {ordersEntity.createdAt ? <TextFormat value={ordersEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : 'N/A'}
            </p>
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor:
                    ordersEntity.status === 'COMPLETED' ? '#dcfce7' : ordersEntity.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                  color: ordersEntity.status === 'COMPLETED' ? '#166534' : ordersEntity.status === 'CANCELLED' ? '#991b1b' : '#92400e',
                }}
              >
                {ordersEntity.status || 'PENDING'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3
              style={{
                margin: '0 0 4px',
                fontSize: 14,
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Người mua
            </h3>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#0f172a' }}>
              {ordersEntity.buyer ? ordersEntity.buyer.login : 'N/A'}
            </p>

            <h3
              style={{
                margin: '16px 0 4px',
                fontSize: 14,
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Người bán
            </h3>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: '#0f172a' }}>
              {ordersEntity.seller ? ordersEntity.seller.login : 'N/A'}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Địa điểm giao dịch
            </h4>
            <p style={{ margin: 0, fontSize: 15, color: '#1e293b' }}>{ordersEntity.meetupLocation || 'Không có'}</p>
          </div>
          {ordersEntity.cancelReason && (
            <div>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#dc2626', textTransform: 'uppercase', fontWeight: 600 }}>Lý do hủy</h4>
              <p style={{ margin: 0, fontSize: 15, color: '#1e293b' }}>{ordersEntity.cancelReason}</p>
            </div>
          )}
          {ordersEntity.buyerNote && (
            <div style={{ gridColumn: '1 / -1' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                Ghi chú của người mua
              </h4>
              <p style={{ margin: 0, fontSize: 15, color: '#1e293b', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: 8 }}>
                {ordersEntity.buyerNote}
              </p>
            </div>
          )}
        </div>

        {/* Order Items Table */}
        <div style={{ padding: '32px 40px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Chi tiết Sản phẩm</h3>
          <Table responsive style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    color: '#64748b',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    borderTop: 'none',
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    color: '#64748b',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    borderTop: 'none',
                  }}
                >
                  Sản phẩm
                </th>
                <th
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    color: '#64748b',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    borderTop: 'none',
                    textAlign: 'right',
                  }}
                >
                  Đơn giá
                </th>
                <th
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    color: '#64748b',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    borderTop: 'none',
                    textAlign: 'right',
                  }}
                >
                  Số lượng
                </th>
                <th
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    color: '#64748b',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #e2e8f0',
                    borderTop: 'none',
                    textAlign: 'right',
                  }}
                >
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {orderItems.length > 0 ? (
                orderItems.map((item, i) => (
                  <tr key={item.id}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#475569', fontSize: 14 }}>{i + 1}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#0f172a', fontSize: 15, fontWeight: 500 }}>
                      {item.product ? item.product.name : `Sản phẩm #${item.id}`}
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#475569', fontSize: 14, textAlign: 'right' }}>
                      {item.price?.toLocaleString()}đ
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', color: '#475569', fontSize: 14, textAlign: 'right' }}>
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid #f1f5f9',
                        color: '#0f172a',
                        fontSize: 15,
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {((item.price || 0) * (item.quantity || 0)).toLocaleString()}đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    Không tìm thấy sản phẩm nào trong đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Totals */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 300 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  fontSize: 14,
                }}
              >
                <span>Khuyến mãi (Nền tảng):</span>
                <span>-{ordersEntity.platformDiscount?.toLocaleString() || 0}đ</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px 0 0',
                  color: '#0f172a',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                <span>Tổng cộng:</span>
                <span style={{ color: '#2563eb' }}>{ordersEntity.totalAmount?.toLocaleString() || 0}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '24px 40px', backgroundColor: '#f8fafc', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
          <Button
            as={Link as any}
            to="/admin-orders"
            replace
            variant="light"
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              color: '#475569',
            }}
          >
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại
          </Button>
          <Button
            as={Link as any}
            to={`/admin-orders/${ordersEntity.id}/edit`}
            replace
            variant="primary"
            style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}
          >
            <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Chỉnh sửa trạng thái
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetail;
