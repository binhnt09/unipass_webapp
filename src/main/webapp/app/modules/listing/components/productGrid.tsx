import { ProductCard } from './productCard';
import React from 'react';

const featuredProducts = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3MzM4NDMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'MacBook Pro M2 16GB',
    price: 16000000,
    originalPrice: 18000000,
    seller: 'Nguyễn Văn A',
    university: 'ĐH FPT',
    rating: 4.9,
    reviews: 23,
    condition: 'Like New',
    verified: true,
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBzbWFydHBob25lfGVufDF8fHx8MTczMzg0MzI1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'iPhone 14 Pro Max 256GB',
    price: 20000000,
    originalPrice: 22000000,
    seller: 'Trần Thị B',
    university: 'ĐH FPT',
    rating: 5.0,
    reviews: 18,
    condition: 'Excellent',
    verified: true,
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzfGVufDF8fHx8MTczMzg0MzI2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Sony WH-1000XM5',
    price: 6500000,
    originalPrice: 7500000,
    seller: 'Lê Minh C',
    university: 'ĐH FPT',
    rating: 4.8,
    reviews: 31,
    condition: 'Good',
    verified: true,
  },
];

const homeAppliancesProducts = [
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwZnJpZGdlfGVufDB8fHx8MTczMzg0MzM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Tủ lạnh mini Aqua 90L',
    price: 2500000,
    originalPrice: 3000000,
    seller: 'Phạm Thị D',
    university: 'ĐH FPT',
    rating: 4.7,
    reviews: 15,
    condition: 'Good',
    verified: true,
  },
  {
    id: '5',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcHxlbnwwfHx8fDE3MzM4NDMzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Đèn bàn học LED Philips',
    price: 450000,
    originalPrice: 600000,
    seller: 'Hoàng Văn E',
    university: 'ĐH FPT',
    rating: 4.9,
    reviews: 28,
    condition: 'Like New',
    verified: true,
  },
  {
    id: '6',
    image:
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGtldHRsZXxlbnwwfHx8fDE3MzM4NDMzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Ấm đun nước siêu tốc',
    price: 250000,
    originalPrice: 350000,
    seller: 'Mai Ngọc F',
    university: 'ĐH FPT',
    rating: 4.6,
    reviews: 12,
    condition: 'Good',
    verified: true,
  },
];

interface ProductGridProps {
  activeCategory: string;
}

export function ProductGrid({ activeCategory }: ProductGridProps) {
  const currentProducts = activeCategory === 'electronics' ? featuredProducts : homeAppliancesProducts;

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Category Description */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 border border-[#FF6B35]/20">
        <h3 className="font-bold text-[#0A2647] mb-2">{activeCategory === 'electronics' ? 'Đồ điện tử' : 'Đồ gia dụng'}</h3>
        <p className="text-sm text-gray-700">
          {activeCategory === 'electronics'
            ? 'Tìm kiếm laptop, điện thoại, tai nghe và thiết bị điện tử khác từ các sinh viên đã xác thực. Tất cả sản phẩm đều được kiểm tra kỹ lưỡng.'
            : 'Mua đồ gia dụng chất lượng cho ký túc xá và phòng trọ. Từ tủ lạnh mini đến đèn bàn, tìm mọi thứ bạn cần cho không gian sống.'}
        </p>
      </div>
    </div>
  );
}
