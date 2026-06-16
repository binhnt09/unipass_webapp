import { Star, MessageCircle, ShoppingCart, BadgeCheck } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router';
import React, { useState } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice: number | null;
  seller: string;
  sellerId?: string;
  university: string;
  rating: number;
  reviews: number;
  condition: string;
  stock?: number;
  distance?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  //   const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Tránh việc click vô tình kích hoạt thẻ <Link> bên ngoài
    e.stopPropagation();

    setIsAdding(true);
    try {
      // 3. Chuẩn bị Payload theo chuẩn DTO của JHipster (CartItemDTO)
      const payload = {
        quantity: 1, // Mặc định thêm 1 sản phẩm
        product: {
          id: product.id,
        },
        // Lưu ý: Tùy vào BE của bạn có tự động bắt User đang login không.
        // Thường JHipster custom API sẽ tự lấy user từ Token.
      };

      await axios.post('/api/cart-items', payload);
      window.dispatchEvent(new Event('cartUpdated'));
      showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      showToast('Có lỗi xảy ra khi thêm vào giỏ hàng hoặc bạn chưa đăng nhập!', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleContactSeller = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.sellerId) {
      showToast('Không tìm thấy thông tin người bán', 'error');
      return;
    }

    try {
      const response = await axios.post(`/api/chat-rooms/initiate?sellerId=${product.sellerId}`);
      if (response.status === 200 || response.status === 201) {
        const roomId = response.data.id;
        navigate('/messages', { state: { selectedRoomId: roomId } });
      }
    } catch (err) {
      console.error('Error initiating chat room:', err);
      showToast('Không thể mở cửa sổ chat. Vui lòng thử lại sau.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm tracking-wider z-10">
              HẾT HÀNG
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 z-10">
            {product.condition}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] hover:text-[#FF6B35] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price & Distance */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <span className="text-2xl font-bold text-[#0A2647]">{product.price.toLocaleString('vi-VN')}đ</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-xs font-medium">
            {product.seller.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900 truncate">{product.seller}</span>
              <BadgeCheck className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
            </div>
            <span className="text-xs text-gray-600">{product.university}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
          {product.distance !== undefined && product.distance !== null && (
            <span className="text-xs font-medium text-[#4855b9] bg-[#FF6B35]/10 px-2 py-1 rounded-md">
              Cách {product.distance < 1 ? Math.round(product.distance * 1000) + 'm' : product.distance.toFixed(1) + 'km'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-[#090418]
              ${isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            style={
              isAdding
                ? { background: '#94a3b8', fontFamily: "'Space Grotesk', sans-serif" }
                : {
                    background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
                    boxShadow: '0 0 15px rgba(0,245,255,0.3)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }
            }
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </button>
          <button
            onClick={handleContactSeller}
            className="p-2 border border-gray-300 hover:border-[#0A2647] hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-slideUp">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <BadgeCheck className="w-5 h-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
