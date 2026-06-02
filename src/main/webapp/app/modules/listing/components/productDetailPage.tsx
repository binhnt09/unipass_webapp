import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  MessageCircle,
  BadgeCheck,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Shield,
  Clock,
  Flag,
  Edit,
} from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { IProduct } from 'app/shared/model/product.model';
import { IProductImage } from 'app/shared/model/product-image.model';
import { ReportModal } from './reportModal';
import { useAuth } from '../../../contexts/AuthContext';

interface ProductActionButtonsProps {
  isOwner: boolean;
  stock?: number;
  productId?: number;
}

function ProductActionButtons({ isOwner, stock, productId }: ProductActionButtonsProps) {
  if (isOwner) {
    return (
      <Link
        to={`/listings/edit/${productId}`}
        className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-bold transition-colors shadow-md"
      >
        <Edit className="w-5 h-5" />
        Chỉnh sửa bài đăng
      </Link>
    );
  }

  if (stock === 0) {
    return (
      <>
        <button
          disabled
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-300 text-gray-500 rounded-lg font-bold cursor-not-allowed shadow-none"
        >
          <ShoppingCart className="w-5 h-5" />
          Hết hàng
        </button>
        <button
          disabled
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-400 rounded-lg font-bold cursor-not-allowed shadow-none"
        >
          <MessageCircle className="w-5 h-5" />
          Liên hệ người bán
        </button>
      </>
    );
  }

  return (
    <>
      <Link
        to="/cart"
        className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors shadow-md"
      >
        <ShoppingCart className="w-5 h-5" />
        Đặt mua ngay
      </Link>
      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-bold transition-colors shadow-md">
        <MessageCircle className="w-5 h-5" />
        Liên hệ người bán
      </button>
    </>
  );
}

// eslint-disable-next-line complexity
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [images, setImages] = useState<IProductImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [productRes, imagesRes] = await Promise.all([
          axios.get<IProduct>(`/api/products/${id}`),
          axios.get<IProductImage[]>(`/api/product-images?productId.equals=${id}`),
        ]);

        if (isMounted) {
          setProduct(productRes.data);
          setImages(imagesRes.data || []);
        }
      } catch (err: any) {
        console.error('Error loading product details:', err);
        if (isMounted) {
          setError(err.response?.data?.title || err.message || 'Không thể tải chi tiết sản phẩm.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const imageUrls =
    product && (product as any).productImages && (product as any).productImages.length > 0
      ? (product as any).productImages
          .map((img: any) => {
            let url = img.imageUrl;
            if (url && url.startsWith('uploads/')) {
              url = '/' + url;
            }
            return url;
          })
          .filter(Boolean)
      : images.length > 0
        ? images
            .map(img => {
              let url = img.imageUrl;
              if (url && url.startsWith('uploads/')) {
                url = '/' + url;
              }
              return url;
            })
            .filter(Boolean)
        : [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzfGVufDF8fHx8MTczMzg0MzI2MHww&ixlib=rb-4.1.0&q=80&w=1080',
          ];

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const getConditionLabel = (cond: string | null | undefined): string => {
    if (!cond) return 'Như mới (99%)';
    const upper = cond.toUpperCase().replace(/\s+/g, '_');
    switch (upper) {
      case 'NEW':
      case 'BRAND_NEW':
        return 'Mới tinh (100%)';
      case 'LIKE_NEW':
        return 'Như mới (99%)';
      case 'EXCELLENT':
        return 'Rất tốt';
      case 'GOOD':
        return 'Tốt';
      case 'FAIR':
        return 'Trung bình';
      default:
        return cond;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-medium">Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-[#FF6B35]">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 text-sm mb-6">{error || 'Sản phẩm này có thể không tồn tại hoặc đã bị gỡ bỏ.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-[#FF5722] transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const discountPrice = product.price ? Math.round(product.price * 1.15) : null;
  const rawLogin = product.seller?.login || 'Thành viên';
  const sellerName = rawLogin.includes('@') ? rawLogin.split('@')[0] : rawLogin;
  const sellerImageUrl = (product?.seller as any)?.imageUrl;
  const universityName = (product.seller as any)?.university?.name || 'Đại học Quốc gia';
  const studentId = (product?.seller as any)?.studentIdNumber || product?.seller?.login || '';
  const postedDate = product.createdAt ? new Date(product.createdAt as any).toLocaleDateString('vi-VN') : 'Mới đăng';
  const isOwner = !!(
    user &&
    product?.seller &&
    (String(user.id) === String(product.seller.id) ||
      user.email?.toLowerCase() === product.seller.email?.toLowerCase() ||
      (user as any).login?.toLowerCase() === product.seller.login?.toLowerCase() ||
      user.name?.toLowerCase() === product.seller.login?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="hover:text-[#FF6B35]">{product.category?.name || 'Danh mục'}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square group">
              <ImageWithFallback
                src={imageUrls[currentImageIndex]}
                alt={product.name || 'Sản phẩm'}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Share2 className="w-5 h-5 text-gray-900" />
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                  title="Báo cáo bài viết này"
                >
                  <Flag className="w-5 h-5 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-[#FF6B35] shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ImageWithFallback src={image} alt={`Ảnh minh họa ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-[#0A2647] mb-4 leading-snug">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Đăng ngày: {postedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Khuôn viên trường</span>
                </div>
                <span>• 88 lượt xem</span>
              </div>

              {/* Price and Condition */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-[#FF6B35] mb-1">{(product.price || 0).toLocaleString('vi-VN')} đ</div>
                  {discountPrice && (
                    <p className="text-sm text-gray-500 line-through">Giá gốc: {discountPrice.toLocaleString('vi-VN')} đ</p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold">{getConditionLabel(product.condition)}</span>
                  </div>
                  {product.stock !== undefined &&
                    (product.stock === 0 ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded px-2.5 py-1">
                        Hết hàng (Out of Stock)
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        Kho: <strong className="text-[#0A2647]">{product.stock}</strong> sản phẩm
                      </span>
                    ))}
                </div>
              </div>

              {/* Seller Notification Banner */}
              {isOwner && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
                  💡 Bạn là người bán sản phẩm này. Bạn có thể chỉnh sửa tin đăng từ bảng điều khiển của người bán.
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <ProductActionButtons isOwner={isOwner} stock={product.stock} productId={product.id} />
              </div>

              {/* Trust Badge */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0A2647] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0A2647] mb-1">Bảo vệ người mua an toàn</h4>
                    <p className="text-xs text-gray-600">Giao dịch an toàn tại khuôn viên trường • Người bán đã xác thực email trường</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#0A2647] mb-4">Thông tin người bán</h3>

              <Link
                to={`/profile/${(product?.seller as any)?.studentIdNumber || studentId}`}
                className="flex items-start gap-4 mb-4 group hover:text-[#FF6B35] cursor-pointer transition-colors duration-200"
              >
                {sellerImageUrl ? (
                  <img
                    src={sellerImageUrl.startsWith('uploads/') ? `/${sellerImageUrl}` : sellerImageUrl}
                    alt={sellerName}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-150 group-hover:border-[#FF6B35] transition-colors"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 group-hover:from-[#FF6B35] group-hover:to-[#FF5722] transition-colors">
                    {sellerName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">{sellerName}</h4>
                    <BadgeCheck className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-[#0A2647]">{universityName}</span>
                    <span>•</span>
                    <span>Sinh viên đã xác thực</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-1">4.8</span>
                    <span className="text-sm text-gray-500">(15 giao dịch)</span>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Thời gian phản hồi</p>
                  <p className="text-sm font-bold text-gray-900">Nhanh (dưới 1 giờ)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Thành viên từ</p>
                  <p className="text-sm font-bold text-gray-900">Năm 2026</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Thường phản hồi trong vòng 1 giờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-4">Chi tiết sản phẩm</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {product.description || 'Chưa có thông tin mô tả chi tiết từ người bán.'}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} itemTitle={product.name} />}
    </div>
  );
}
