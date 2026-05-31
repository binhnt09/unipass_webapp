import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Upload, X, Image as ImageIcon, Package, DollarSign, Tag, FileText, Loader2 } from 'lucide-react';
import { ICategory } from 'app/shared/model/category.model';

type ExistingImage = {
  id: number;
  imageUrl: string;
};

export function CreateListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
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
  });

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
          });
        })
        .catch(err => {
          console.error('Error fetching product details:', err);
          setErrorMessage('Failed to load product details.');
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

  // Cleanup object URLs on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      uploadedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
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

    // Check if adding files exceeds max 5 images limit
    const totalCount = existingImages.length + uploadedImages.length + fileList.length;
    if (totalCount > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    const newImages = fileList.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
    setRawFiles(prev => [...prev, ...fileList]);
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    const urlToRemove = uploadedImages[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setRawFiles(prev => prev.filter((_, i) => i !== index));
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

    if (Number(formData.stock) < 0) {
      setErrorMessage('Số lượng trong kho không được âm.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create or Update Product with standard JSON request
      const payload = {
        id: isEditMode ? Number(id) : undefined,
        name: formData.title,
        price: Number(formData.price),
        description: formData.description,
        condition: formData.condition,
        category: formData.category ? { id: Number(formData.category) } : null,
        status: productData?.status || 'AVAILABLE',
        stock: Number(formData.stock),
      };

      let productId = isEditMode ? Number(id) : null;

      if (isEditMode) {
        await axios.put(`/api/products/${id}`, payload);
      } else {
        const productResponse = await axios.post('/api/products', payload);
        const createdProduct = productResponse.data;
        productId = createdProduct?.id;
      }

      if (!productId) {
        throw new Error('Product operation completed, but no Product ID was resolved.');
      }

      // Step 2: Handle deletions of removed existing images (only in Edit mode)
      if (isEditMode && deletedImageIds.length > 0) {
        for (const imageId of deletedImageIds) {
          await axios.delete(`/api/product-images/${imageId}`);
        }
      }

      // Step 3: Upload Associated NEW Images sequentially
      if (rawFiles.length > 0) {
        for (const file of rawFiles) {
          const imageFormData = new FormData();
          imageFormData.append('file', file);

          await axios.post(`/api/products/${productId}/images`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }

      setSuccessMessage(isEditMode ? 'Your listing has been successfully updated!' : 'Your listing has been successfully published!');

      // Delay navigation to dashboard so the user gets smooth feedback
      setTimeout(() => {
        navigate('/seller-dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error during listing submission flow:', error);
      const detail =
        error.response?.data?.detail || error.response?.data?.title || error.message || 'An unexpected error occurred during submission.';
      setErrorMessage(`Failed to submit listing: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">{isEditMode ? 'Chỉnh sửa bài đăng' : 'Đăng tin mới'}</h1>
          <p className="text-gray-600">
            {isEditMode ? 'Cập nhật thông tin chi tiết sản phẩm của bạn' : 'List your item and reach verified students across your campus'}
          </p>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 transition-all duration-300">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 font-bold text-sm">!</span>
            <div>
              <h3 className="font-semibold">Submission Error</h3>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3 transition-all duration-300">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 font-bold text-sm">✓</span>
            <div>
              <h3 className="font-semibold">Success</h3>
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-4">Product Images</label>

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
                  <p className="text-gray-900 font-medium mb-1">Drag & drop your images here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
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
                  Select Files
                </label>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB each (max 5 images)</p>
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
                    {index === 0 && <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">Primary</div>}
                  </div>
                ))}

                {/* Newly Uploaded Images */}
                {uploadedImages.map((image, index) => {
                  const displayIndex = existingImages.length + index;
                  return (
                    <div key={`new-${index}`} className="relative group">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {displayIndex === 0 && (
                        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">Primary</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-medium text-[#0A2647] mb-4">Product Details</h2>

            {/* Product Title */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B35]" />
                  Product Title
                </div>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Calculus Textbook 8th Edition"
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
                    Price (USD)
                  </div>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#FF6B35]" />
                    Stock
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#FF6B35]" />
                    Category
                  </div>
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories && categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Textbooks</option>
                      <option value="2">Electronics</option>
                      <option value="3">Dorm Essentials</option>
                      <option value="4">Vehicles</option>
                      <option value="5">Furniture</option>
                      <option value="6">Clothing</option>
                      <option value="7">Other</option>
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
                  Condition
                </div>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'].map(cond => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    disabled={isSubmitting}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.condition === cond ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF6B35]" />
                  Description
                </div>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about your item (condition, features, reason for selling, etc.)"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
                required
                disabled={isSubmitting}
              />
              <p className="mt-2 text-sm text-gray-500">{formData.description.length}/500 characters</p>
            </div>
          </div>

          {/* Publish Button */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#0A2647]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{isEditMode ? 'Sẵn sàng lưu thay đổi?' : 'Ready to publish?'}</h3>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? 'Thông tin sản phẩm sẽ được cập nhật ngay lập tức trên hệ thống'
                    : 'Your listing will be visible to all verified students on your campus'}
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md whitespace-nowrap disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Đang lưu...' : 'Publishing...'}
                </>
              ) : isEditMode ? (
                'Lưu thay đổi'
              ) : (
                'Publish Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
