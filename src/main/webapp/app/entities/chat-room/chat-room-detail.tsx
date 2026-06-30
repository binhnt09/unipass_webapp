import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
// import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './chat-room.reducer';

export const ChatRoomDetail = () => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/chat-messages?roomId.equals=${id}&sort=createdAt,asc`)
        .then(res => setMessages(res.data))
        .catch(err => console.error('Error fetching chat messages:', err));
    }
  }, [id, dispatch]);

  const chatRoomEntity = useAppSelector(state => state.chatRoom.entity);
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 32px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Phòng Chat #{chatRoomEntity.id}</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Người mua: <strong>{chatRoomEntity.buyer?.login || 'N/A'}</strong> • Người bán:{' '}
              <strong>{chatRoomEntity.seller?.login || 'N/A'}</strong>
            </p>
          </div>
          <Button as={Link as any} to="/chat-room" replace variant="outline-secondary" style={{ borderRadius: 8, fontSize: 14 }}>
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại
          </Button>
        </div>

        {/* Product Info */}
        {chatRoomEntity.product && (
          <div
            style={{
              padding: '16px 32px',
              backgroundColor: '#f0fdf4',
              borderBottom: '1px solid #dcfce7',
              fontSize: 14,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FontAwesomeIcon icon="box" />
            <strong>Sản phẩm quan tâm:</strong> <Link to={`/product/${chatRoomEntity.product.id}`}>{chatRoomEntity.product.name}</Link>
          </div>
        )}

        {/* Chat History */}
        <div
          style={{
            padding: '24px 32px',
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isBuyer = msg.sender?.id === chatRoomEntity.buyer?.id;
              return (
                <div key={msg.id || index} style={{ display: 'flex', justifyContent: isBuyer ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: isBuyer ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isBuyer ? '#2563eb' : '#ffffff',
                      color: isBuyer ? '#ffffff' : '#1e293b',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      border: isBuyer ? 'none' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: 12, marginBottom: 4, color: isBuyer ? '#bfdbfe' : '#94a3b8', fontWeight: 600 }}>
                      {msg.sender?.login || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40, fontStyle: 'italic' }}>
              Không có tin nhắn nào trong phòng này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
