// NEW FEATURE: Trade Requests Page - List all trade proposals for a specific product
// Seller can view, accept, decline trade requests
// Route: /seller/products/:productId/trades

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Package, Filter, Search, TrendingUp, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { TradeRequestCard } from '../trade/components/tradeRequestCard';
import type { TradeRequest } from '../../shared/types/trade';
import { mapTradeRequestDtoToFe } from '../../shared/types/trade';
import axios from 'axios';
import { toast } from 'react-toastify';

export function TradeRequestsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!productId) return;

        // Load product info
        const productRes = await axios.get(`/api/products/${productId}`);
        const p = productRes.data;
        setProduct({
          id: String(p.id),
          title: p.name,
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300',
          price: p.price,
        });

        // Load trade requests for this product
        const accountRes = await axios.get('/api/account');
        const userId = accountRes.data.id;

        const requestsRes = await axios.get(`/api/trade-requests?sellerId.equals=${userId}&targetProductId.equals=${productId}`);
        const requests = requestsRes.data.map(mapTradeRequestDtoToFe);
        setTradeRequests(requests);
      } catch (error) {
        console.error('Error fetching trade requests:', error);
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
  const handleAccept = async (tradeId: string) => {
    try {
      await axios.post(`/api/trade-requests/${tradeId}/accept`);
      setTradeRequests(requests =>
        requests.map(r => (r.id === tradeId ? { ...r, status: 'accepted' as const, acceptedAt: new Date().toISOString() } : r)),
      );
      toast.success('Đã chấp nhận đề xuất đổi đồ');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra');
    }
  };

  // Handle decline trade
  const handleDecline = async (tradeId: string) => {
    try {
      await axios.post(`/api/trade-requests/${tradeId}/decline`);
      setTradeRequests(requests =>
        requests.map(r => (r.id === tradeId ? { ...r, status: 'declined' as const, declinedAt: new Date().toISOString() } : r)),
      );
      toast.success('Đã từ chối đề xuất đổi đồ');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
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
