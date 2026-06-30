import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { TextFormat } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity, partialUpdateEntity } from './community-post.reducer';

export const CommunityPostDetail = () => {
  const dispatch = useAppDispatch();
  const [comments, setComments] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  const fetchComments = () => {
    if (id) {
      axios
        .get(`/api/post-comments?postId.equals=${id}&sort=createdAt,asc`)
        .then(res => setComments(res.data))
        .catch(err => console.error('Error fetching comments:', err));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      fetchComments();
    }
  }, [id, dispatch]);

  const handleHidePost = () => {
    if (window.confirm('Bạn có chắc muốn ẩn bài viết này?')) {
      dispatch(partialUpdateEntity({ id: Number(id), status: 'HIDDEN' }));
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('Xóa bình luận vi phạm này?')) {
      axios
        .delete(`/api/post-comments/${commentId}`)
        .then(() => fetchComments())
        .catch(err => console.error(err));
    }
  };

  const communityPostEntity = useAppSelector(state => state.communityPost.entity);
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Post Header */}
        <div style={{ padding: '32px 40px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{communityPostEntity.title}</h1>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                backgroundColor:
                  communityPostEntity.status === 'ACTIVE' ? '#dcfce7' : communityPostEntity.status === 'HIDDEN' ? '#f3f4f6' : '#fee2e2',
                color:
                  communityPostEntity.status === 'ACTIVE' ? '#166534' : communityPostEntity.status === 'HIDDEN' ? '#4b5563' : '#991b1b',
              }}
            >
              {communityPostEntity.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, color: '#64748b', fontSize: 14 }}>
            <span>
              <strong>Tác giả:</strong> {communityPostEntity.author ? communityPostEntity.author.login : 'Ẩn danh'}
            </span>
            <span>
              <strong>Chuyên mục:</strong> {communityPostEntity.category ? communityPostEntity.category.name : 'Chung'}
            </span>
            <span>
              <strong>Ngày đăng:</strong>{' '}
              {communityPostEntity.createdAt ? (
                <TextFormat value={communityPostEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
              ) : (
                'N/A'
              )}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div
          style={{
            padding: '32px 40px',
            fontSize: 16,
            color: '#1e293b',
            lineHeight: 1.6,
            borderBottom: '1px solid #e5e7eb',
            whiteSpace: 'pre-wrap',
          }}
        >
          {communityPostEntity.content}
        </div>

        {/* Comments Section */}
        <div style={{ padding: '32px 40px', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Bình luận ({comments.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <Card key={comment.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: 'none' }}>
                  <Card.Body style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                        {comment.author ? comment.author.login : 'Ẩn danh'}
                        <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
                          {comment.createdAt ? <TextFormat value={comment.createdAt} type="date" format={APP_DATE_FORMAT} /> : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#dc2626',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Xóa bình luận vi phạm
                      </button>
                    </div>
                    <div style={{ fontSize: 15, color: '#334155', whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Chưa có bình luận nào.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '24px 40px',
            backgroundColor: '#fff',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <Button
            as={Link as any}
            to="/community-post"
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

          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              onClick={handleHidePost}
              disabled={communityPostEntity.status === 'HIDDEN'}
              variant="warning"
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: '#92400e',
                backgroundColor: '#fef3c7',
                border: 'none',
              }}
            >
              <FontAwesomeIcon icon="eye-slash" className="mr-2" /> Ẩn bài viết
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
