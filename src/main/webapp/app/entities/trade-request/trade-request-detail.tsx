import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './trade-request.reducer';

export const TradeRequestDetail = () => {
  const dispatch = useAppDispatch();
  const [offeredItems, setOfferedItems] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/trade-offered-items?tradeRequestId.equals=${id}`)
        .then(res => setOfferedItems(res.data))
        .catch(err => console.error('Error fetching trade items:', err));
    }
  }, [dispatch, id]);

  const tradeRequestEntity = useAppSelector(state => state.tradeRequest.entity);
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
              Chi tiết Giao dịch (Audit) #{tradeRequestEntity.id}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              Ngày tạo:{' '}
              {tradeRequestEntity.createdAt ? (
                <TextFormat value={tradeRequestEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
              ) : (
                'N/A'
              )}
            </p>
          </div>
          <span
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 600,
              backgroundColor:
                tradeRequestEntity.status === 'COMPLETED' ? '#dcfce7' : tradeRequestEntity.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
              color:
                tradeRequestEntity.status === 'COMPLETED' ? '#166534' : tradeRequestEntity.status === 'CANCELLED' ? '#991b1b' : '#92400e',
            }}
          >
            {tradeRequestEntity.status || 'PENDING'}
          </span>
        </div>

        {/* Info Blocks */}
        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, borderBottom: '1px solid #e5e7eb' }}>
          {/* Party A: Buyer (Initiator) */}
          <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h3
              style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ padding: '4px 8px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: 6, fontSize: 12 }}>
                Bên yêu cầu (Buyer)
              </span>
              {tradeRequestEntity.buyer?.login || 'N/A'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Trạng thái xác nhận:</span>
                <span style={{ fontWeight: 600, color: tradeRequestEntity.isBuyerConfirmed ? '#166534' : '#94a3b8' }}>
                  {tradeRequestEntity.isBuyerConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Số tiền bù thêm (Top up):</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{tradeRequestEntity.topUpAmount?.toLocaleString() || 0}đ</span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Vật phẩm đưa ra trao đổi:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {offeredItems.length > 0 ? (
                  offeredItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {item.offeredProduct?.name || `Sản phẩm #${item.offeredProduct?.id}`}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#fff',
                      border: '1px dashed #cbd5e1',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#94a3b8',
                      textAlign: 'center',
                    }}
                  >
                    Không có vật phẩm nào
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Party B: Seller (Target) */}
          <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h3
              style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ padding: '4px 8px', backgroundColor: '#ffedd5', color: '#c2410c', borderRadius: 6, fontSize: 12 }}>
                Bên đích (Seller)
              </span>
              {tradeRequestEntity.seller?.login || 'N/A'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Trạng thái xác nhận:</span>
                <span style={{ fontWeight: 600, color: tradeRequestEntity.isSellerConfirmed ? '#166534' : '#94a3b8' }}>
                  {tradeRequestEntity.isSellerConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Vật phẩm đích muốn nhận:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tradeRequestEntity.targetProduct ? (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      borderLeft: '4px solid #f97316',
                    }}
                  >
                    {tradeRequestEntity.targetProduct.name}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#fff',
                      border: '1px dashed #cbd5e1',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#94a3b8',
                      textAlign: 'center',
                    }}
                  >
                    Chưa rõ vật phẩm
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* General details */}
        <div style={{ padding: '32px 40px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Thông tin chung</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div style={{ display: 'flex', padding: '12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <strong style={{ width: 200, color: '#475569' }}>Địa điểm giao dịch:</strong>
              <span style={{ color: '#0f172a' }}>{tradeRequestEntity.meetupLocation || 'Không có'}</span>
            </div>
            <div style={{ display: 'flex', padding: '12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <strong style={{ width: 200, color: '#475569' }}>Cập nhật lần cuối:</strong>
              <span style={{ color: '#0f172a' }}>
                {tradeRequestEntity.updatedAt ? (
                  <TextFormat value={tradeRequestEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '24px 40px', backgroundColor: '#f8fafc', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
          <Button
            as={Link as any}
            to="/trade-request"
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
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại danh sách
          </Button>
          {/* Edit button is removed as requested: "Tuyệt đối xóa các nút Add/Edit/Delete đối với Admin" */}
        </div>
      </div>
    </div>
  );
};

export default TradeRequestDetail;
