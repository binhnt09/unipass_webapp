import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Upload, X, Image as ImageIcon, Package, DollarSign, Tag, FileText, Loader2, Link as LinkIcon, MapPin } from 'lucide-react';
import { ICategory } from 'app/shared/model/category.model';
import { useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import { toast } from 'react-toastify';
import { getConditionLabel } from '../../../shared/util/condition-util';
import { LocationPickerMap } from '../../../shared/map/LocationPickerMap';
import { useProductQuota } from 'app/shared/hooks/useProductQuota';
import { Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

type ExistingImage = {
  id: number;
  imageUrl: string;
};

type ImageItem = {
  previewUrl: string;
  file?: File;
};

export function CreateListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const account = useAppSelector(state => state.authentication.account);
  const { user } = useAuth();

  const { activeCount, limit, canPost, level, loading: quotaLoading } = useProductQuota();
  const isAtLimit = !isEditMode && !canPost && !quotaLoading;

  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [productData, setProductData] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    stock: '1',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    address: '',
  });

  // Fetch user default address for pre-filling map on create mode
  useEffect(() => {
    if (!isEditMode) {
      axios
        .get('/api/user-addresses')
        .then(res => {
          if (res.data && res.data.length > 0) {
            const defaultAddr = res.data.find((a: any) => a.isDefault) || res.data[0];
            if (defaultAddr?.latitude && defaultAddr?.longitude) {
              setFormData(prev => ({
                ...prev,
                latitude: defaultAddr.latitude,
                longitude: defaultAddr.longitude,
                address: defaultAddr.address || '',
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, [isEditMode]);

  // Fetch categories dynamically on component mount
  useEffect(() => {
    let isMounted = true;
    axios
      .get<ICategory[]>('/api/categories')
      .then(res => {
        if (isMounted) {
          setCategories(res.data || []);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch product data and images in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      axios
        .get(`/api/products/${id}`)
        .then(res => {
          const product = res.data;
          setProductData(product);
          setFormData({
            title: product.name || '',
            price: product.price !== undefined && product.price !== null ? String(product.price) : '',
            category: product.category?.id ? String(product.category.id) : '',
            condition: product.condition || '',
            description: product.description || '',
            stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '1',
            latitude: product.latitude,
            longitude: product.longitude,
            address: '',
          });
        })
        .catch(err => {
          console.error('Error fetching product details:', err);
          setErrorMessage('Tải chi tiết sản phẩm thất bại.');
        });

      axios
        .get<any[]>(`/api/product-images?productId.equals=${id}`)
        .then(res => {
          const images = res.data.map((img: any) => ({
            id: img.id,
            imageUrl: img.imageUrl,
          }));
          setExistingImages(images);
        })
        .catch(err => {
          console.error('Error fetching product images:', err);
        });
    }
  }, [id, isEditMode]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => {
        if (img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [uploadedImages]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileList = Array.from(files);

    const totalCount = existingImages.length + uploadedImages.length + fileList.length;
    if (totalCount > 5) {
      toast.error('Bạn chỉ có thể tải lên tối đa 5 hình ảnh.');
      return;
    }

    const newItems = fileList.map(file => ({
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setUploadedImages(prev => [...prev, ...newItems]);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() !== '') {
      if (existingImages.length + uploadedImages.length >= 5) {
        toast.error('Bạn chỉ có thể đăng tối đa 5 hình ảnh.');
        return;
      }
      setUploadedImages(prev => [...prev, { previewUrl: imageUrlInput.trim() }]);
      setImageUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    const itemToRemove = uploadedImages[index];
    if (itemToRemove && itemToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validations
    if (!formData.title || formData.title.trim() === '') {
      setErrorMessage('Vui lòng nhập tên sản phẩm');
      toast.error('Vui lòng nhập tên sản phẩm');
      setIsSubmitting(false);
      return;
    }

    if (!formData.price || formData.price.trim() === '' || Number(formData.price) < 0) {
      setErrorMessage('Giá bán không được để trống hoặc âm');
      toast.error('Giá bán không được để trống hoặc âm');
      setIsSubmitting(false);
      return;
    }

    if (!formData.category) {
      setErrorMessage('Vui lòng chọn danh mục sản phẩm');
      toast.error('Vui lòng chọn danh mục sản phẩm');
      setIsSubmitting(false);
      return;
    }

    if (!formData.condition) {
      setErrorMessage('Vui lòng chọn tình trạng sản phẩm');
      toast.error('Vui lòng chọn tình trạng sản phẩm');
      setIsSubmitting(false);
      return;
    }

    let productId = isEditMode ? Number(id) : null;

    // STEP 1: Create or Update Product with standard JSON request
    try {
      const sellerId = isEditMode
        ? productData?.seller?.id || account?.id || (user?.id ? Number(user.id) : undefined)
        : account?.id || (user?.id ? Number(user.id) : undefined);

      const payload = {
        id: isEditMode ? Number(id) : undefined,
        name: formData.title,
        price: Number(formData.price),
        description: formData.description,
        condition: formData.condition,
        category: formData.category ? { id: Number(formData.category) } : null,
        seller: sellerId ? { id: Number(sellerId) } : null,
        status: productData?.status || 'AVAILABLE',
        stock: 1, // Mỗi tin đăng cố định 1 sản phẩm
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (isEditMode) {
        await axios.put(`/api/products/${id}`, payload);
      } else {
        const productResponse = await axios.post('/api/products', payload);
        const createdProduct = productResponse.data;
        productId = createdProduct?.id;
      }

      if (!productId) {
        throw new Error('Không nhận được ID sản phẩm từ server');
      }
    } catch (productError) {
      console.error('Step 1 (Product Creation) failed:', productError);
      setIsSubmitting(false);
      setErrorMessage('Tạo bài đăng thất bại, vui lòng kiểm tra lại thông tin!');
      toast.error('Tạo bài đăng thất bại, vui lòng kiểm tra lại thông tin!');
      return; // HALT IMMEDIATELY
    }

    // Step 2: Handle deletions of removed existing images (only in Edit mode)
    if (isEditMode && deletedImageIds.length > 0) {
      try {
        for (const imageId of deletedImageIds) {
          await axios.delete(`/api/product-images/${imageId}`);
        }
      } catch (deleteError) {
        console.error('Failed to delete existing images:', deleteError);
      }
    }

    // STEP 2: Process Real Image Upload & Association
    try {
      if (uploadedImages.length > 0) {
        const imageRequests = uploadedImages.map(async (item, idx) => {
          let finalImageUrl = item.previewUrl;

          // If the item has a real browser File, upload it directly to Cloudinary
          if (item.file) {
            const imageFormData = new FormData();
            imageFormData.append('file', item.file);
            imageFormData.append('upload_preset', 'unipass_upload');

            // Call Cloudinary API instead of backend
            const uploadRes = await fetch('https://api.cloudinary.com/v1_1/ddczglojv/image/upload', {
              method: 'POST',
              body: imageFormData,
            });

            const data = await uploadRes.json();
            if (data.secure_url) {
              finalImageUrl = data.secure_url;
            } else {
              throw new Error('Upload to Cloudinary failed: ' + JSON.stringify(data));
            }
          }

          // Create the JSON metadata request payload
          // If there are no existing images, the first newly uploaded image is primary.
          const isPrimary = existingImages.length === 0 && idx === 0;
          const imagePayload = {
            imageUrl: finalImageUrl,
            isPrimary,
            product: { id: productId },
          };

          return axios.post('/api/product-images', imagePayload);
        });

        await Promise.all(imageRequests);
      }
    } catch (imageError) {
      console.error('Step 2 (Image Association) failed:', imageError);
      setIsSubmitting(false);
      setErrorMessage('Tải ảnh hoặc liên kết hình ảnh thất bại. Vui lòng thử lại!');
      toast.error('Tải ảnh hoặc liên kết hình ảnh thất bại. Vui lòng thử lại!');
      return; // HALT IMMEDIATELY: prevent success and redirection, keep form intact
    }

    setSuccessMessage(isEditMode ? 'Bài đăng của bạn đã được cập nhật thành công!' : 'Bài đăng của bạn đã được đăng thành công!');
    toast.success(isEditMode ? 'Bài đăng đã được cập nhật!' : 'Bài đăng đã được tạo thành công!');

    // Delay navigation to dashboard so the user gets smooth feedback
    setTimeout(() => {
      navigate('/seller-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">{isEditMode ? 'Chỉnh sửa bài đăng' : 'Đăng tin mới'}</h1>
          <p className="text-gray-600">
            {isEditMode
              ? 'Cập nhật thông tin chi tiết sản phẩm của bạn'
              : 'Đăng bán sản phẩm của bạn và tiếp cận các sinh viên đã được xác thực trên toàn trường.'}
          </p>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 transition-all duration-300">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 font-bold text-sm">!</span>
            <div>
              <h3 className="font-semibold">Lỗi gửi thông tin</h3>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3 transition-all duration-300">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 font-bold text-sm">✓</span>
            <div>
              <h3 className="font-semibold">Thành công</h3>
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Quota Banner - chỉ hiển thị khi tạo mới */}
        {!isEditMode && !quotaLoading && (
          <>
            {/* Đã đạt giới hạn - hiển thị banner đỏ */}
            {isAtLimit && (
              <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-400 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-orange-900 text-base">
                      Bạn đã đạt giới hạn {limit} sản phẩm của {level === 0 ? 'Gói Miễn phí' : 'Gói Tiêu chuẩn'}
                    </h3>
                    <p className="text-sm text-orange-700 mt-0.5">Hãy nâng cấp để đăng thêm sản phẩm không giới hạn.</p>
                  </div>
                </div>
                <Link
                  to="/premium"
                  className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A2647] rounded-lg text-sm font-bold whitespace-nowrap flex items-center gap-1.5 shadow"
                >
                  <Crown className="w-4 h-4" /> Nâng cấp ngay
                </Link>
              </div>
            )}

            {/* Sắp đạt giới hạn (còn 1 slot) - hiển thị banner vàng */}
            {!isAtLimit && limit !== -1 && limit - activeCount <= 1 && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-300 rounded-xl flex items-center gap-3">
                <span className="text-yellow-600 text-sm font-medium">
                  ⚠️ Bạn đã dùng{' '}
                  <strong>
                    {activeCount}/{limit}
                  </strong>{' '}
                  sản phẩm. Còn lại 1 slot!
                </span>
              </div>
            )}

            {/* Indicator nhỏ khi còn nhiều slot */}
            {!isAtLimit && limit !== -1 && limit - activeCount > 1 && (
              <div className="mb-4 text-xs text-gray-500 text-right">
                Đã dùng{' '}
                <strong>
                  {activeCount}/{limit}
                </strong>{' '}
                sản phẩm trong gói hiện tại
              </div>
            )}
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-4">Hình ảnh sản phẩm</label>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={!isSubmitting ? handleDrag : undefined}
              onDragLeave={!isSubmitting ? handleDrag : undefined}
              onDragOver={!isSubmitting ? handleDrag : undefined}
              onDrop={!isSubmitting ? handleDrop : undefined}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-[#FF6B35] hover:bg-orange-50/50'
              } ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-1">Kéo & thả hình ảnh của bạn vào đây</p>
                  <p className="text-sm text-gray-500">hoặc click để duyệt tìm</p>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="fileInput"
                  className={`px-6 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-medium cursor-pointer transition-colors ${
                    isSubmitting ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  Chọn tệp
                </label>
                <p className="text-xs text-gray-500">PNG, JPG tối đa 10MB mỗi hình (tối đa 5 hình)</p>
              </div>
            </div>

            {/* Direct Image URL Input */}
            <div className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#FF6B35]" />
                  Hoặc nhập link ảnh trực tiếp (Cloudinary, Imgur, Unsplash...)
                </div>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  placeholder="Ví dụ: https://res.cloudinary.com/demo/image/upload/sample.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  Thêm URL
                </button>
              </div>
            </div>

            {/* Uploaded Images Preview */}
            {(existingImages.length > 0 || uploadedImages.length > 0) && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                  <div key={`existing-${image.id}`} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">Ảnh chính</div>
                    )}
                  </div>
                ))}

                {/* Newly Uploaded Images */}
                {uploadedImages.map((image, index) => {
                  const displayIndex = existingImages.length + index;
                  return (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={image.previewUrl}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {displayIndex === 0 && (
                        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">Ảnh chính</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-medium text-[#0A2647] mb-4">Chi tiết sản phẩm</h2>

            {/* Product Title */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B35]" />
                  Tên sản phẩm <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Quạt điện, Nồi cơm điện,..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Price, Stock and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Price */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                    Giá bán (VND) <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Nhập giá bán"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Stock - Cố định 1, hiển thị giải thích */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#FF6B35]" />
                    Số lượng
                  </div>
                </label>
                <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#0A2647]">1</span>
                    <span className="text-gray-500 text-sm">sản phẩm</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#FF6B35]" />
                    Danh mục sản phẩm <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Chọn danh mục sản phẩm</option>
                  {categories && categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Sách giáo khoa</option>
                      <option value="2">Đồ điện tử</option>
                      <option value="3">Đồ dùng ký túc xá</option>
                      <option value="4">Phương tiện</option>
                      <option value="5">Đồ nội thất</option>
                      <option value="6">Quần áo</option>
                      <option value="7">Khác</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B35]" />
                  Tình trạng <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'].map(cond => {
                  const condLabel = getConditionLabel(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      disabled={isSubmitting}
                      className={`px-4 py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        formData.condition === cond ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {condLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF6B35]" />
                  Mô tả chi tiết
                </div>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Cung cấp thông tin chi tiết về sản phẩm của bạn (tình trạng, tính năng, lý do bán, v.v.)"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
                disabled={isSubmitting}
              />
              <p className="mt-2 text-sm text-gray-500">{(formData.description || '').length}/500 ký tự</p>
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF6B35]" />
                  Vị trí sản phẩm (Bản đồ)
                </div>
              </label>
              <LocationPickerMap
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                onLocationSelect={(lat, lng, addrText) => {
                  setFormData(prev => ({ ...prev, latitude: lat, longitude: lng, address: addrText }));
                }}
              />
              <p className="mt-2 text-sm text-gray-500">Người mua có thể tìm kiếm sản phẩm theo khoảng cách tới vị trí này.</p>
            </div>
          </div>

          {/* Publish Button */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#0A2647]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{isEditMode ? 'Sẵn sàng lưu thay đổi?' : 'Sẵn sàng đăng tin?'}</h3>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? 'Thông tin sản phẩm sẽ được cập nhật ngay lập tức trên hệ thống'
                    : 'Sản phẩm của bạn sẽ được hiển thị tới tất cả các sinh viên đã được xác thực trong trường.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/seller-dashboard')}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isAtLimit}
                className="px-8 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md whitespace-nowrap disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEditMode ? 'Đang lưu...' : 'Đang tạo bài đăng...'}
                  </>
                ) : isEditMode ? (
                  'Lưu thay đổi'
                ) : (
                  'Tạo bài đăng'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
