import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';
import { LocationPickerMap } from 'app/shared/map/LocationPickerMap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './product.reducer';

export const ProductUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const categories = useAppSelector(state => state.category.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const productEntity = useAppSelector(state => state.product.entity);
  const loading = useAppSelector(state => state.product.loading);
  const updating = useAppSelector(state => state.product.updating);
  const updateSuccess = useAppSelector(state => state.product.updateSuccess);

  const handleClose = () => {
    navigate(`/product${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCategories({}));
    dispatch(getUsers({}));
  }, []);

  const [mapLat, setMapLat] = useState<number | undefined>(undefined);
  const [mapLng, setMapLng] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isNew) {
      axios
        .get('/api/user-addresses')
        .then(res => {
          if (res.data) {
            const defaultAddr = res.data.find((a: any) => a.isDefault) || res.data[0];
            if (defaultAddr && defaultAddr.latitude && defaultAddr.longitude) {
              setMapLat(defaultAddr.latitude);
              setMapLng(defaultAddr.longitude);
            }
          }
        })
        .catch(e => console.error(e));
    }
  }, [isNew]);

  useEffect(() => {
    if (!isNew && productEntity && productEntity.id === Number(id)) {
      if (productEntity.latitude) setMapLat(productEntity.latitude);
      if (productEntity.longitude) setMapLng(productEntity.longitude);
    }
  }, [productEntity, isNew, id]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const [images, setImages] = useState<any[]>([]);

  const fetchImages = () => {
    if (!isNew && id) {
      axios
        .get(`/api/product-images?productId.equals=${id}`)
        .then(res => setImages(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id, isNew]);

  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // First upload the file to get the URL
    axios
      .post('/api/product-images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        const imageUrl = res.data;
        // Then create the ProductImage record
        return axios.post('/api/product-images', {
          imageUrl,
          isPrimary: images.length === 0, // make primary if first image
          product: { id: Number(id) },
        });
      })
      .then(() => fetchImages())
      .catch(err => console.error('Error uploading image:', err));
  };

  const deleteImage = (imageId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      axios
        .delete(`/api/product-images/${imageId}`)
        .then(() => fetchImages())
        .catch(err => console.error('Error deleting image:', err));
    }
  };

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.price !== undefined && typeof values.price !== 'number') {
      values.price = Number(values.price);
    }
    if (values.stock !== undefined && typeof values.stock !== 'number') {
      values.stock = Number(values.stock);
    }
    if (mapLat !== undefined) {
      values.latitude = Number(mapLat);
    }
    if (mapLng !== undefined) {
      values.longitude = Number(mapLng);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...productEntity,
      ...values,
      category: categories.find(it => it.id.toString() === values.category?.toString()),
      seller: users.find(it => it.id.toString() === values.seller?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          ...productEntity,
          createdAt: convertDateTimeFromServer(productEntity.createdAt),
          updatedAt: convertDateTimeFromServer(productEntity.updatedAt),
          category: productEntity?.category?.id,
          seller: productEntity?.seller?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="unipassWebApp.product.home.createOrEditLabel" data-cy="ProductCreateUpdateHeading">
            <Translate contentKey="unipassWebApp.product.home.createOrEditLabel">Create or edit a Product</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew && (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="product-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('unipassWebApp.product.name')}
                id="product-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.product.description')}
                id="product-description"
                name="description"
                data-cy="description"
                type="text"
                validate={{
                  maxLength: { value: 5000, message: translate('entity.validation.maxlength', { max: 5000 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.product.price')}
                id="product-price"
                name="price"
                data-cy="price"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.product.status')}
                id="product-status"
                name="status"
                data-cy="status"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.product.condition')}
                id="product-condition"
                name="condition"
                data-cy="condition"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('unipassWebApp.product.stock')}
                id="product-stock"
                name="stock"
                data-cy="stock"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <div className="mb-3">
                <label className="form-label">Vị trí Sản phẩm (Giao hàng)</label>
                <LocationPickerMap
                  initialLat={mapLat}
                  initialLng={mapLng}
                  onLocationSelect={(lat, lng) => {
                    setMapLat(lat);
                    setMapLng(lng);
                  }}
                />
              </div>
              <ValidatedField
                label={translate('unipassWebApp.product.createdAt')}
                id="product-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('unipassWebApp.product.updatedAt')}
                id="product-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="product-category"
                name="category"
                data-cy="category"
                label={translate('unipassWebApp.product.category')}
                type="select"
              >
                <option value="" key="0" />
                {categories
                  ? categories.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="product-seller"
                name="seller"
                data-cy="seller"
                label={translate('unipassWebApp.product.seller')}
                type="select"
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              {/* --- Image Upload Section --- */}
              {!isNew && (
                <div
                  className="mb-4 mt-4"
                  style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                >
                  <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Quản lý hình ảnh</h4>

                  {/* Drag and drop zone */}
                  <div
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '32px',
                      textAlign: 'center',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      marginBottom: '20px',
                    }}
                    onDragOver={e => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onDragLeave={e => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        Array.from(e.dataTransfer.files).forEach(file => handleImageUpload(file));
                      }
                    }}
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                  >
                    <input
                      id="image-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files) {
                          Array.from(e.target.files).forEach(file => handleImageUpload(file));
                        }
                      }}
                    />
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                      <FontAwesomeIcon icon="cloud-upload-alt" size="2x" style={{ marginBottom: '12px', color: '#94a3b8' }} />
                      <br />
                      Kéo thả ảnh vào đây hoặc click để chọn file
                    </div>
                  </div>

                  {/* Image grid */}
                  {images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                      {images.map((img: any) => (
                        <div
                          key={img.id}
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            aspectRatio: '1/1',
                            backgroundColor: '#fff',
                          }}
                        >
                          <img
                            src={`http://localhost:8080${img.imageUrl}`}
                            alt="Product"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              deleteImage(img.id);
                            }}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(220, 38, 38, 0.9)',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            title="Xóa ảnh"
                          >
                            ×
                          </button>
                          {img.isPrimary && (
                            <span
                              style={{
                                position: 'absolute',
                                bottom: 4,
                                left: 4,
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                              }}
                            >
                              Ảnh chính
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Chưa có hình ảnh nào.</p>
                  )}
                </div>
              )}
              {isNew && (
                <div
                  className="mb-4 mt-4"
                  style={{
                    backgroundColor: '#fef2f2',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: '14px',
                  }}
                >
                  <FontAwesomeIcon icon="info-circle" className="mr-2" />
                  Vui lòng lưu sản phẩm trước, sau đó bạn có thể tải hình ảnh lên ở màn hình chỉnh sửa.
                </div>
              )}
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/product" replace variant="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button variant="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductUpdate;
