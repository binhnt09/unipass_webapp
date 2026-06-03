// NEW FEATURE: Trade Requests Page - List all trade proposals for a specific product
// Seller can view, accept, decline trade requests
// Route: /seller/products/:productId/trades

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Package, Filter, Search, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { TradeRequestCard } from '../trade/components/tradeRequestCard';
import type { TradeRequest } from '../../shared/types/trade';
// import { useNotifications } from '../../contexts/notificationContext';

// Mock product data
const mockProducts: Record<string, { id: string; title: string; image: string; price: number }> = {
  '1': {
    id: '1',
    title: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    image:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 12500000,
  },
};

// Mock trade requests data
const mockTradeRequests: TradeRequest[] = [
  {
    id: 'trade1',
    status: 'pending',
    targetProductId: '1',
    targetProductTitle: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    targetProductPrice: 12500000,
    targetProductImage:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    offeredItems: [
      {
        title: 'iPad Air M1 64GB',
        description: 'Máy mua 6 tháng trước, còn bảo hành 18 tháng. Tình trạng như mới, không trầy xước.',
        estimatedValue: 8000000,
        images: [
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBpcGFkfGVufDF8fHx8MTc3MzgzMDk2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        condition: 'Như mới',
      },
    ],
    tradeType: 'with_cash',
    cashDifference: 4500000,
    totalOfferedValue: 8000000,
    reason: 'Cần laptop cho học tập và làm việc. iPad không phù hợp với công việc lập trình hiện tại của mình.',
    requesterId: 'user1',
    requesterName: 'Nguyễn Văn A',
    requesterEmail: 'a.nguyen@student.hust.edu.vn',
    requesterPhone: '0912 345 678',
    requesterUniversity: 'ĐH Bách Khoa Hà Nội',
    proposedMeetingLocation: {
      type: 'public_place',
      publicPlace: 'Thư viện Tầng 2, ĐH Bách Khoa',
      notes: 'Gần cổng B, có chỗ ngồi yên tĩnh',
    },
    sellerId: 'seller1',
    sellerName: 'Người bán A',
    createdAt: '2026-06-02T10:30:00Z',
    updatedAt: '2026-06-02T10:30:00Z',
  },
  {
    id: 'trade2',
    status: 'pending',
    targetProductId: '1',
    targetProductTitle: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    targetProductPrice: 12500000,
    targetProductImage:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    offeredItems: [
      {
        title: 'iPhone 13 Pro 128GB',
        description: 'Máy đẹp, pin 95%, không va đập.',
        estimatedValue: 10000000,
        images: [
          'https://images.unsplash.com/photo-1632633173522-c4d0ba3e3096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjAxM3xlbnwxfHx8fDE3NzM4OTA3Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        condition: 'Đã qua sử dụng',
      },
      {
        title: 'Apple Watch Series 7',
        description: 'Đồng hồ còn nguyên hộp, ít dùng.',
        estimatedValue: 5000000,
        images: [
          'https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHdhdGNofGVufDF8fHx8MTc3Mzg5MDc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        condition: 'Như mới',
      },
    ],
    tradeType: 'straight',
    cashDifference: 0,
    totalOfferedValue: 15000000,
    reason: 'Đang chuyển sang Android ecosystem nên cần đổi sang laptop để học tập.',
    requesterId: 'user2',
    requesterName: 'Trần Thị B',
    requesterEmail: 'b.tran@student.hust.edu.vn',
    requesterPhone: '0923 456 789',
    requesterUniversity: 'ĐH Kinh tế Quốc dân',
    proposedMeetingLocation: {
      type: 'buyer_address',
      address: 'Ký túc xá B2, Phòng 305, ĐH Kinh tế Quốc dân',
    },
    sellerId: 'seller1',
    sellerName: 'Người bán A',
    createdAt: '2026-06-01T14:20:00Z',
    updatedAt: '2026-06-01T14:20:00Z',
  },
];

export function TradeRequestsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  //   const { addNotification } = useNotifications();

  const [product, setProduct] = useState<(typeof mockProducts)[string] | null>(null);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load product info
    const productData = mockProducts[productId || '1'];
    if (productData) {
      setProduct(productData);
    }

    // Load trade requests for this product
    const requests = mockTradeRequests.filter(tr => tr.targetProductId === (productId || '1'));
    setTradeRequests(requests);
  }, [productId]);

  // Filter trade requests
  const filteredRequests = tradeRequests.filter(trade => {
    // Filter by status
    if (filterStatus !== 'all' && trade.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return trade.requesterName.toLowerCase().includes(query) || trade.offeredItems.some(item => item.title.toLowerCase().includes(query));
    }

    return true;
  });

  // Handle accept trade
  const handleAccept = (tradeId: string) => {
    setTradeRequests(requests =>
      requests.map(r => (r.id === tradeId ? { ...r, status: 'accepted' as const, acceptedAt: new Date().toISOString() } : r)),
    );

    // addNotification({
    //   type: 'success',
    //   title: 'Đã chấp nhận đề xuất đổi đồ',
    //   message: 'Người đề xuất sẽ nhận được thông báo. Hãy liên hệ để sắp xếp lịch gặp.',
    // });
  };

  // Handle decline trade
  const handleDecline = (tradeId: string) => {
    // TODO: Show decline reason modal
    const reason = 'Không phù hợp với nhu cầu hiện tại';

    setTradeRequests(requests =>
      requests.map(r =>
        r.id === tradeId
          ? {
              ...r,
              status: 'declined' as const,
              declinedAt: new Date().toISOString(),
              declineReason: reason,
            }
          : r,
      ),
    );

    // addNotification({
    //   type: 'info',
    //   title: 'Đã từ chối đề xuất',
    //   message: 'Người đề xuất sẽ nhận được thông báo về lý do từ chối.',
    // });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const pendingCount = tradeRequests.filter(t => t.status === 'pending').length;
  const acceptedCount = tradeRequests.filter(t => t.status === 'accepted').length;
  const declinedCount = tradeRequests.filter(t => t.status === 'declined').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-[#0A2647] dark:text-white hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại Dashboard
        </Link>

        {/* Product Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              <ImageWithFallback src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Đề xuất đổi đồ</h1>
              <p className="text-gray-600 dark:text-gray-400">Sản phẩm: {product.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giá bán</p>
              <p className="text-2xl font-bold text-[#FF6B35]">{product.price.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng đề xuất</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tradeRequests.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chờ xử lý</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã chấp nhận</p>
                <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã từ chối</p>
                <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
              </div>
              <Package className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên người đề xuất hoặc món đồ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tất cả ({tradeRequests.length})</option>
                <option value="pending">Chờ xử lý ({pendingCount})</option>
                <option value="accepted">Đã chấp nhận ({acceptedCount})</option>
                <option value="declined">Đã từ chối ({declinedCount})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trade Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có đề xuất đổi đồ</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterStatus !== 'all' ? 'Không có đề xuất nào với bộ lọc này' : 'Người mua có thể đề xuất đổi đồ của họ lấy sản phẩm này'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(trade => (
              <TradeRequestCard
                key={trade.id}
                trade={trade}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onViewDetail={() => navigate(`/seller/trades/${trade.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
