import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row, Card, Table } from 'react-bootstrap';
// import { Translate } from 'react-jhipster';
import { Link, useParams, useNavigate } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './university.reducer';

export const UniversityDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [campuses, setCampuses] = useState<any[]>([]);

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
      axios
        .get(`/api/campuses?universityId.equals=${id}&sort=name,asc`)
        .then(res => setCampuses(res.data))
        .catch(err => console.error('Error fetching campuses:', err));
    }
  }, [id, dispatch]);

  const universityEntity = useAppSelector(state => state.university.entity);
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>Chi tiết Trường Đại học</h2>
        <Button as={Link as any} to="/university" replace variant="outline-secondary" style={{ borderRadius: 8 }}>
          <FontAwesomeIcon icon="arrow-left" className="mr-2" /> Quay lại
        </Button>
      </div>

      <Row>
        <Col md="4">
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            {universityEntity.logoUrl ? (
              <div style={{ padding: 24, textAlign: 'center', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <img src={universityEntity.logoUrl} alt="Logo" style={{ maxWidth: 160, maxHeight: 160, objectFit: 'contain' }} />
              </div>
            ) : (
              <div
                style={{
                  padding: 48,
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e5e7eb',
                  color: '#94a3b8',
                }}
              >
                <FontAwesomeIcon icon="building-columns" size="4x" />
              </div>
            )}
            <Card.Body style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{universityEntity.name}</h3>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                  Mã Trường
                </div>
                <div style={{ fontSize: 15, color: '#1e293b' }}>{universityEntity.code || 'N/A'}</div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                  Trạng thái
                </div>
                <div style={{ fontSize: 15 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 600,
                      backgroundColor: universityEntity.status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
                      color: universityEntity.status === 'ACTIVE' ? '#166534' : '#475569',
                    }}
                  >
                    {universityEntity.status || 'N/A'}
                  </span>
                </div>
              </div>

              <Button
                as={Link as any}
                to={`/university/${universityEntity.id}/edit`}
                variant="primary"
                style={{ width: '100%', borderRadius: 8, fontWeight: 600 }}
              >
                <FontAwesomeIcon icon="pencil-alt" className="mr-2" /> Chỉnh sửa
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md="8">
          <Card style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div
              style={{
                padding: '20px 24px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0f172a' }}>Danh sách Cơ sở ({campuses.length})</h3>
              <Button as={Link as any} to="/campus/new" variant="outline-primary" size="sm" style={{ borderRadius: 6, fontWeight: 600 }}>
                <FontAwesomeIcon icon="plus" className="mr-1" /> Thêm Cơ sở
              </Button>
            </div>

            <div style={{ backgroundColor: '#f8fafc' }}>
              {campuses.length > 0 ? (
                <Table responsive hover style={{ margin: 0 }}>
                  <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 24px', fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                        Tên Cơ sở
                      </th>
                      <th style={{ padding: '12px 24px', fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                        Địa chỉ
                      </th>
                      <th
                        style={{
                          padding: '12px 24px',
                          fontSize: 13,
                          color: '#64748b',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          width: 100,
                        }}
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campuses.map(campus => (
                      <tr key={campus.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 24px', fontSize: 15, fontWeight: 500, color: '#0f172a' }}>{campus.name}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <FontAwesomeIcon icon="map-marker-alt" style={{ marginTop: 4, color: '#94a3b8' }} />
                            <span>{campus.address || 'Chưa cập nhật địa chỉ'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button
                              onClick={() => navigate(`/campus/${campus.id}`)}
                              variant="light"
                              size="sm"
                              style={{ border: '1px solid #e2e8f0', color: '#475569' }}
                            >
                              <FontAwesomeIcon icon="eye" />
                            </Button>
                            <Button
                              onClick={() => navigate(`/campus/${campus.id}/edit`)}
                              variant="light"
                              size="sm"
                              style={{ border: '1px solid #e2e8f0', color: '#2563eb' }}
                            >
                              <FontAwesomeIcon icon="pencil-alt" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
                  <FontAwesomeIcon icon="building" size="3x" style={{ marginBottom: 16, opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: 15 }}>Trường đại học này chưa có cơ sở nào được lưu trữ.</p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UniversityDetail;
