import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, User, MapPin, MessageCircle, CheckCircle, XCircle, AlertCircle, BadgeCheck, Star } from 'lucide-react';
import { TradeComparison } from '../components/tradeComparison';
import type { TradeRequest } from '../../../shared/types/trade';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';

export function TradeDetailPage() {
  const { tradeId } = useParams<{ tradeId: string }>();
  // const navigate = useNavigate();
  const { user } = useAuth();

  const [trade, setTrade] = useState<TradeRequest | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  // const [declineReason, setDeclineReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTradeData = async () => {
    try {
      setIsLoading(true);
      const [tradeRes, offeredRes] = await Promise.all([
        axios.get(`/api/trade-requests/${tradeId}`),
        axios.get(`/api/trade-offered-items?tradeRequestId.equals=${tradeId}`),
      ]);

      const t = tradeRes.data;
      const offeredItemsDTO = offeredRes.data;

      // Fetch details of offered products
      const offeredProducts = await Promise.all(
        offeredItemsDTO.map((item: any) => axios.get(`/api/products/${item.offeredProduct.id}`).then(r => r.data)),
      );

      const getImageUrl = (url: string) => {
        if (!url) return '';
        return url.startsWith('uploads/') ? `/${url}` : url;
      };

      const mappedTrade: TradeRequest = {
        id: t.id.toString(),
        status: t.status.toLowerCase(),
        targetProductId: t.targetProduct.id.toString(),
        targetProductTitle: t.targetProduct.name,
        targetProductPrice: t.targetProduct.price,
        targetProductImage: getImageUrl(t.targetProduct.productImages?.[0]?.imageUrl),

        offeredItems: offeredProducts.map(p => ({
          title: p.name,
          description: p.description || '',
          estimatedValue: p.price || 0,
          images: p.productImages?.map((img: any) => getImageUrl(img.imageUrl)) || [],
          condition: p.condition || '',
        })),

        tradeType: t.topUpAmount > 0 ? 'with_cash' : 'straight',
        cashDifference: t.topUpAmount || 0,
        totalOfferedValue: offeredProducts.reduce((sum: number, p: any) => sum + (p.price || 0), 0),
        reason: 'Trao đổi đồ trên hệ thống',

        requesterId: t.buyer?.id?.toString() || '',
        requesterName: t.buyer?.login || '',
        requesterEmail: t.buyer?.email || '',
        requesterPhone: '',
        requesterUniversity: 'Đại học FPT',

        proposedMeetingLocation: {
          type: 'public_place',
          publicPlace: t.meetupLocation,
        },

        sellerId: t.seller?.id?.toString() || '',
        sellerName: t.seller?.login || '',

        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        isBuyerConfirmed: t.isBuyerConfirmed,
        isSellerConfirmed: t.isSellerConfirmed,
      };

      setTrade(mappedTrade);
    } catch (err) {
      console.error('Error fetching trade details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tradeId) {
      fetchTradeData();
    }
  }, [tradeId]);

  if (isLoading || !trade) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const isBuyer = user?.id?.toString() === trade.requesterId;
  const isSeller = user?.id?.toString() === trade.sellerId;

  const handleAccept = async () => {
    try {
      await axios.put(`/api/trade-requests/${tradeId}/accept`);
      fetchTradeData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi chấp nhận.');
    }
  };

  const handleDecline = async () => {
    try {
      await axios.put(`/api/trade-requests/${tradeId}/decline`);
      setShowDeclineModal(false);
      fetchTradeData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi từ chối.');
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`/api/trade-requests/${tradeId}/confirm`);
      fetchTradeData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi xác nhận.');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.put(`/api/trade-requests/${tradeId}/cancel`);
      fetchTradeData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi hủy.');
    }
  };

  const getStatusBadge = () => {
    const badges: any = {
      pending: { text: 'Chờ xử lý', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
      accepted: { text: 'Đã chấp nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'bg-gray-100 text-gray-700', icon: XCircle },
    };
    const badge = badges[trade.status] || { text: trade.status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/seller/products/${trade.targetProductId}/trades`}
          className="inline-flex items-center gap-2 text-[#0A2647] dark:text-white hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>

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
          <div className="lg:col-span-2 space-y-6">
            <TradeComparison trade={trade} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Địa điểm gặp mặt đề xuất
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">Địa điểm công cộng:</p>
                    <p className="text-gray-700 dark:text-gray-300">{trade.proposedMeetingLocation.publicPlace}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for Seller */}
            {trade.status === 'pending' && isSeller && (
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

            {/* Actions for Buyer */}
            {trade.status === 'pending' && isBuyer && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hành động</h3>
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Hủy đề xuất
                </button>
              </div>
            )}

            {/* Double Confirm UI */}
            {trade.status === 'accepted' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Xác nhận giao dịch</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  Vui lòng kiểm tra kỹ món đồ khi gặp mặt. Sau khi trao đổi thành công, hãy nhấn xác nhận. Giao dịch sẽ hoàn tất khi cả hai
                  bên xác nhận.
                </p>

                <div className="flex flex-col gap-4">
                  {/* Status indicator */}
                  <div className="flex gap-4 mb-2">
                    <div
                      className={`flex-1 p-3 rounded-lg border ${trade.isBuyerConfirmed ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        {trade.isBuyerConfirmed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="font-medium text-sm">Người mua: {trade.isBuyerConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
                      </div>
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-lg border ${trade.isSellerConfirmed ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        {trade.isSellerConfirmed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="font-medium text-sm">Người bán: {trade.isSellerConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Action */}
                  {(isBuyer && !trade.isBuyerConfirmed) || (isSeller && !trade.isSellerConfirmed) ? (
                    <button
                      onClick={handleConfirm}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all shadow-md text-lg"
                    >
                      Xác nhận đã trao đổi đồ thành công
                    </button>
                  ) : (
                    <div className="text-center py-3 text-blue-700 font-medium">Bạn đã xác nhận. Đang chờ đối tác xác nhận...</div>
                  )}
                </div>
              </div>
            )}

            {/* Completed & Review UI */}
            {trade.status === 'completed' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-xl">Giao dịch đã hoàn tất!</h4>
                  <p className="text-gray-700 mt-2">Cả hai bên đã xác nhận trao đổi thành công.</p>
                </div>

                <div className="border-t border-green-200 pt-6">
                  <h5 className="font-bold mb-4 text-center">Đánh giá đối tác của bạn</h5>
                  <div className="flex justify-center">
                    <Link
                      to={`/reviews/create?orderId=${trade.id}&type=trade`}
                      className="px-6 py-3 bg-white border-2 border-green-500 text-green-600 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <Star className="w-5 h-5 fill-current" />
                      Viết đánh giá
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Đối tác giao dịch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(isSeller ? trade.requesterName : trade.sellerName)[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{isSeller ? trade.requesterName : trade.sellerName}</span>
                      <BadgeCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{trade.requesterUniversity}</p>
                  </div>
                </div>

                <Link
                  to={`/messages?user=${isSeller ? trade.requesterName : trade.sellerName}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Lưu ý an toàn
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-2">
                <li>• Gặp mặt tại nơi công cộng, đông người</li>
                <li>• Kiểm tra kỹ món đồ trước khi trao đổi</li>
                <li>• Báo với hệ thống nếu có vấn đề</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Từ chối đề xuất</h3>
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
