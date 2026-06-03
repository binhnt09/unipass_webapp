// NEW FEATURE: My Trades Page - User view of their trade proposals
// Shows all trade requests user has made with status tracking
// Route: /trades/mine

import React, { useState } from 'react';
import { Link } from 'react-router';
import { Package, ArrowRight, Clock, CheckCircle, XCircle, MessageCircle, Eye, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import type { TradeRequest } from '../../shared/types/trade';

// Mock data - user's trade proposals
const mockMyTrades: TradeRequest[] = [
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
        description: 'Máy mua 6 tháng trước, còn bảo hành 18 tháng.',
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
    reason: 'Cần laptop cho học tập và làm việc.',
    requesterId: 'currentUser',
    requesterName: 'Bạn',
    requesterEmail: 'you@student.hust.edu.vn',
    requesterPhone: '0912 345 678',
    requesterUniversity: 'ĐH Bách Khoa Hà Nội',
    proposedMeetingLocation: {
      type: 'public_place',
      publicPlace: 'Thư viện Tầng 2, ĐH Bách Khoa',
    },
    sellerId: 'seller1',
    sellerName: 'Nguyễn Văn A',
    createdAt: '2026-06-02T10:30:00Z',
    updatedAt: '2026-06-02T10:30:00Z',
  },
  {
    id: 'trade3',
    status: 'accepted',
    targetProductId: '2',
    targetProductTitle: 'Tai nghe Sony WH-1000XM4',
    targetProductPrice: 4500000,
    targetProductImage:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzczODkwMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    offeredItems: [
      {
        title: 'AirPods Pro Gen 2',
        description: 'Còn mới, dùng 2 tháng.',
        estimatedValue: 4500000,
        images: [
          'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb2RzfGVufDF8fHx8MTc3Mzg5MDg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        condition: 'Như mới',
      },
    ],
    tradeType: 'straight',
    cashDifference: 0,
    totalOfferedValue: 4500000,
    reason: 'Muốn đổi sang tai nghe over-ear.',
    requesterId: 'currentUser',
    requesterName: 'Bạn',
    requesterEmail: 'you@student.hust.edu.vn',
    requesterPhone: '0912 345 678',
    requesterUniversity: 'ĐH Bách Khoa Hà Nội',
    proposedMeetingLocation: {
      type: 'buyer_address',
      address: 'KTX A, Phòng 305',
    },
    sellerId: 'seller2',
    sellerName: 'Trần Thị B',
    createdAt: '2026-06-01T14:00:00Z',
    updatedAt: '2026-06-01T16:00:00Z',
    acceptedAt: '2026-06-01T16:00:00Z',
  },
];

export function MyTradesPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredTrades = mockMyTrades.filter(trade => {
    if (filterStatus === 'all') return true;
    return trade.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: 'Chờ xử lý', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: Clock },
      accepted: { text: 'Đã chấp nhận', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300', icon: XCircle },
    }[status] || { text: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };

    const Icon = badges.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badges.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badges.text}
      </span>
    );
  };

  const pendingCount = mockMyTrades.filter(t => t.status === 'pending').length;
  const acceptedCount = mockMyTrades.filter(t => t.status === 'accepted').length;
  const declinedCount = mockMyTrades.filter(t => t.status === 'declined').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Đề xuất đổi đồ của tôi</h1>
          <p className="text-gray-600 dark:text-gray-400">Theo dõi các đề xuất trao đổi bạn đã gửi đến người bán</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng đề xuất</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockMyTrades.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chờ xử lý</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã chấp nhận</p>
            <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã từ chối</p>
            <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Tất cả ({mockMyTrades.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Chờ xử lý ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'accepted'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Đã chấp nhận ({acceptedCount})
            </button>
            <button
              onClick={() => setFilterStatus('declined')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'declined'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Đã từ chối ({declinedCount})
            </button>
          </div>
        </div>

        {/* Trades List */}
        {filteredTrades.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có đề xuất nào</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Bạn chưa gửi đề xuất đổi đồ nào</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrades.map(trade => (
              <div
                key={trade.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(trade.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(trade.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                {/* Trade Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                  {/* Your Items */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Món bạn đề xuất:</p>
                    <div className="space-y-2">
                      {trade.offeredItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <ImageWithFallback src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">~{item.estimatedValue.toLocaleString('vi-VN')}đ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow & Info */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <ArrowRight className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {trade.tradeType === 'with_cash' ? 'Đổi + bù tiền' : 'Đổi thẳng'}
                    </p>
                    {trade.tradeType === 'with_cash' && (
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        + {trade.cashDifference.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>

                  {/* Target Item */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Đổi lấy:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <ImageWithFallback
                          src={trade.targetProductImage}
                          alt={trade.targetProductTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{trade.targetProductTitle}</h4>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {trade.targetProductPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {trade.sellerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Người bán: {trade.sellerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {trade.status === 'accepted' && (
                      <Link
                        to={`/messages?user=${trade.sellerName}&trade=${trade.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Nhắn tin
                      </Link>
                    )}
                    <Link
                      to={`/product/${trade.targetProductId}`}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Xem sản phẩm
                    </Link>
                  </div>
                </div>

                {/* Status Messages */}
                {trade.status === 'pending' && (
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <p className="text-sm text-orange-800 dark:text-orange-300">
                        Đề xuất của bạn đang chờ người bán xem xét. Bạn sẽ nhận được thông báo khi có phản hồi.
                      </p>
                    </div>
                  </div>
                )}

                {trade.status === 'accepted' && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Người bán đã chấp nhận đề xuất! Hãy liên hệ để sắp xếp lịch gặp mặt và trao đổi.
                      </p>
                    </div>
                  </div>
                )}

                {trade.status === 'declined' && trade.declineReason && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800 dark:text-red-300 mb-1">Đề xuất đã bị từ chối.</p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          <span className="font-medium">Lý do:</span> {trade.declineReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
