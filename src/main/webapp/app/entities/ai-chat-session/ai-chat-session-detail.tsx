import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './ai-chat-session.reducer';

export const AiChatSessionDetail = () => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/ai-chat-messages?sessionId.equals=${id}&sort=createdAt,asc`)
        .then(res => setMessages(res.data))
        .catch(err => console.error('Error fetching chat messages:', err));
    }
  }, [id, dispatch]);

  const aiChatSessionEntity = useAppSelector(state => state.aiChatSession.entity);
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
            <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Phiên Chat AI #{aiChatSessionEntity.id}</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Người dùng: <strong>{aiChatSessionEntity.user?.login || 'Ẩn danh'}</strong> • Bắt đầu:{' '}
              {aiChatSessionEntity.createdAt ? (
                <TextFormat value={aiChatSessionEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
              ) : (
                'N/A'
              )}
            </p>
          </div>
          <Button as={Link as any} to="/ai-chat-session" replace variant="outline-secondary" style={{ borderRadius: 8, fontSize: 14 }}>
            <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại
          </Button>
        </div>

        {/* Context Summary */}
        {aiChatSessionEntity.contextSummary && (
          <div
            style={{ padding: '16px 32px', backgroundColor: '#fdf8f6', borderBottom: '1px solid #fce7f3', fontSize: 14, color: '#9d174d' }}
          >
            <FontAwesomeIcon icon="info-circle" className="mr-2" />
            <strong>Tóm tắt Context:</strong> {aiChatSessionEntity.contextSummary}
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
              const isUser = msg.role === 'USER';
              return (
                <div key={msg.id || index} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isUser ? '#2563eb' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1e293b',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: 12, marginBottom: 4, color: isUser ? '#bfdbfe' : '#94a3b8', fontWeight: 600 }}>
                      {isUser ? 'Người dùng' : 'AI Assistant'}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40, fontStyle: 'italic' }}>
              Không có tin nhắn nào trong phiên này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChatSessionDetail;
