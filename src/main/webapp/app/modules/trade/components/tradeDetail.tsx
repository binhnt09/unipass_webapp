// NEW FEATURE: Trade Detail Page - Full detailed view of a single trade proposal
// Shows side-by-side comparison, requester info, and actions
// Route: /seller/trades/:tradeId

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Home, MessageCircle, CheckCircle, XCircle, AlertCircle, BadgeCheck } from 'lucide-react';
import { TradeComparison } from '../components/tradeComparison';
import type { TradeRequest } from '../../../shared/types/trade';
// import { useNotifications } from '../../../contexts/notificationContext';

// Mock data - same as TradeRequestsPage
const mockTradeRequests: Record<string, TradeRequest> = {
  trade1: {
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
        description: 'Máy mua 6 tháng trước, còn bảo hành 18 tháng. Tình trạng như mới, không trầy xước. Đầy đủ hộp, sạc, cáp.',
        estimatedValue: 8000000,
        images: [
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBpcGFkfGVufDF8fHx8MTc3MzgzMDk2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        ],
        condition: 'Như mới',
        purchaseDate: '2025-12-01',
        warrantyRemaining: '18 tháng',
      },
    ],
    tradeType: 'with_cash',
    cashDifference: 4500000,
    totalOfferedValue: 8000000,
    reason: 'Cần laptop cho học tập và làm việc. iPad không phù hợp với công việc lập trình hiện tại của mình. Mong chủ shop xem xét.',
    requesterId: 'user1',
    requesterName: 'Nguyễn Văn A',
    requesterEmail: 'a.nguyen@student.hust.edu.vn',
    requesterPhone: '0912 345 678',
    requesterUniversity: 'ĐH Bách Khoa Hà Nội',
    proposedMeetingLocation: {
      type: 'public_place',
      publicPlace: 'Thư viện Tầng 2, ĐH Bách Khoa',
      notes: 'Gần cổng B, có chỗ ngồi yên tĩnh. Có thể gặp chiều thứ 3-5.',
    },
    sellerId: 'seller1',
    sellerName: 'Người bán A',
    createdAt: '2026-06-02T10:30:00Z',
    updatedAt: '2026-06-02T10:30:00Z',
  },
};

export function TradeDetailPage() {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  //   const { addNotification } = useNotifications();

  const [trade, setTrade] = useState<TradeRequest | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    const tradeData = mockTradeRequests[tradeId || 'trade1'];
    if (tradeData) {
      setTrade(tradeData);
    }
  }, [tradeId]);

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const handleAccept = () => {
    setTrade({ ...trade, status: 'accepted', acceptedAt: new Date().toISOString() });

    // addNotification({
    //   type: 'success',
    //   title: 'Đã chấp nhận đề xuất đổi đồ!',
    //   message: 'Người đề xuất sẽ nhận được thông báo. Hãy liên hệ để sắp xếp lịch gặp mặt.',
    // });

    setTimeout(() => {
      navigate(`/seller/products/${trade.targetProductId}/trades`);
    }, 2000);
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setTrade({
      ...trade,
      status: 'declined',
      declinedAt: new Date().toISOString(),
      declineReason,
    });

    // addNotification({
    //   type: 'info',
    //   title: 'Đã từ chối đề xuất',
    //   message: 'Người đề xuất sẽ nhận được thông báo về lý do từ chối.',
    // });

    setShowDeclineModal(false);

    setTimeout(() => {
      navigate(`/seller/products/${trade.targetProductId}/trades`);
    }, 2000);
  };

  const getStatusBadge = () => {
    const badges = {
      pending: { text: 'Chờ xử lý', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
      accepted: { text: 'Đã chấp nhận', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle },
    }[trade.status] || { text: trade.status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };

    const Icon = badges.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${badges.color}`}>
        <Icon className="w-4 h-4" />
        {badges.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={`/seller/products/${trade.targetProductId}/trades`}
          className="inline-flex items-center gap-2 text-[#0A2647] dark:text-white hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chi tiết đề xuất đổi đồ</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đề xuất từ: {trade.requesterName} • {new Date(trade.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trade Comparison */}
            <TradeComparison trade={trade} />

            {/* Reason */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Lý do muốn đổi</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{trade.reason}</p>
            </div>

            {/* Meeting Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {trade.proposedMeetingLocation.type === 'buyer_address' ? (
                  <Home className="w-5 h-5 text-purple-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-purple-600" />
                )}
                Địa điểm gặp mặt đề xuất
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {trade.proposedMeetingLocation.type === 'buyer_address' ? 'Địa chỉ người đề xuất:' : 'Địa điểm công cộng:'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {trade.proposedMeetingLocation.type === 'buyer_address'
                        ? trade.proposedMeetingLocation.address
                        : trade.proposedMeetingLocation.publicPlace}
                    </p>
                  </div>
                </div>
                {trade.proposedMeetingLocation.notes && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ghi chú:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{trade.proposedMeetingLocation.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {trade.status === 'pending' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quyết định</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Chấp nhận đổi
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Từ chối
                  </button>
                </div>
              </div>
            )}

            {trade.status === 'accepted' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Đã chấp nhận đề xuất!</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      Hãy liên hệ với người đề xuất để sắp xếp lịch gặp mặt và kiểm tra món đồ.
                    </p>
                    <Link
                      to={`/messages?user=${trade.requesterName}&trade=${trade.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Nhắn tin với {trade.requesterName}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {trade.status === 'declined' && trade.declineReason && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Đã từ chối đề xuất</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Lý do:</span> {trade.declineReason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requester Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Người đề xuất
              </h3>
              <div className="space-y-4">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {trade.requesterName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{trade.requesterName}</span>
                      <BadgeCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{trade.requesterUniversity}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{trade.requesterEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{trade.requesterPhone}</span>
                  </div>
                </div>

                {/* Contact Button */}
                <Link
                  to={`/messages?user=${trade.requesterName}&trade=${trade.id}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin
                </Link>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Lưu ý an toàn
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-2">
                <li>• Gặp mặt tại nơi công cộng, đông người</li>
                <li>• Kiểm tra kỹ món đồ trước khi trao đổi</li>
                <li>• Mang theo bạn bè nếu có thể</li>
                <li>• Không giao dịch qua trung gian</li>
                <li>• Báo với UniMarket nếu có vấn đề</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Từ chối đề xuất đổi đồ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Vui lòng cho biết lý do từ chối để người đề xuất hiểu rõ hơn.</p>
            <textarea
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              placeholder="VD: Món đồ đề xuất không phù hợp với nhu cầu hiện tại..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
