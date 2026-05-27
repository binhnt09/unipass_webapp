import { ProductCard } from './productCard';
import React from 'react';
import { IProduct } from 'app/shared/model/product.model';

interface ProductGridProps {
  products: IProduct[];
  loading: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-6 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-full w-8" />
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg w-full" />
    </div>
  </div>
);

export function ProductGrid({ products, loading }: ProductGridProps) {
  // Map IProduct to the UI Card format
  const mappedProducts = products.map(prod => {
    const imageUrl =
      (prod as any).imageUrl ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzfGVufDF8fHx8MTczMzg0MzI2MHww&ixlib=rb-4.1.0&q=80&w=1080';

    const conditionDisplay = (() => {
      switch (prod.condition) {
        case 'Brand New':
          return 'Mới tinh (100%)';
        case 'Like New':
          return 'Như mới (99%)';
        case 'Excellent':
          return 'Rất tốt';
        case 'Good':
          return 'Tốt';
        case 'Fair':
          return 'Trung bình';
        default:
          return prod.condition || 'Như mới';
      }
    })();

    return {
      id: prod.id?.toString() || '',
      image: imageUrl,
      title: prod.name || 'Sản phẩm',
      price: prod.price || 0,
      originalPrice: prod.price ? Math.round(prod.price * 1.15) : null,
      seller: prod.seller?.login || 'Sinh viên',
      university: (prod.seller as any)?.university?.name || 'Đại học Quốc gia',
      rating: 4.8,
      reviews: 12,
      condition: conditionDisplay,
    };
  });

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF6B35]">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Không có sản phẩm nào phù hợp với bộ lọc tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mappedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Category Description */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 border border-[#FF6B35]/20">
        <h3 className="font-bold text-[#0A2647] mb-2">Thông tin mua sắm an toàn</h3>
        <p className="text-sm text-gray-700">
          Tìm kiếm sách giáo khoa, đồ điện tử, đồ gia dụng và nhiều thiết bị khác từ các sinh viên đã được xác thực. Tất cả sản phẩm đều
          được kiểm tra kỹ lưỡng để đảm bảo giao dịch an toàn và minh bạch trong cộng đồng học đường.
        </p>
      </div>
    </div>
  );
}
