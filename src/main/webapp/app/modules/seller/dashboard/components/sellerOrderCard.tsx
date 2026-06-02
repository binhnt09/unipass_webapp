import React, { useState } from 'react';
import {
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
} from 'lucide-react';
import { ImageWithFallback } from '../../../../shared/figma/ImageWithFallback';
import { Link } from 'react-router';

export type OrderRequestStatus = 'pending' | 'accepted' | 'confirmed' | 'shipping' | 'completed' | 'declined' | 'cancelled';

interface OrderRequest {
  id: string;
  orderId?: string;
  status: OrderRequestStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  university: string;
  requestDate: string;
  acceptedDate?: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  deliveryAddress?: string;
  paymentStatus?: 'unpaid' | 'paid';
  declineReason?: string;
  cancelReason?: string;
}

interface SellerOrderCardProps {
  order: OrderRequest;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onContact: (orderId: string) => void;
  onMarkShipping: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
}

export function SellerOrderCard({
  order,
  onAccept,
  onDecline,
  onCancel,
  onContact,
  onMarkShipping,
  onMarkCompleted,
}: SellerOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    const badges = {
      pending: { text: 'Chờ xử lý', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: Clock },
      accepted: { text: 'Đã chấp nhận', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle },
      confirmed: {
        text: 'Đã thanh toán',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: CheckCircle,
      },
      shipping: { text: 'Đang giao hàng', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300', icon: Truck },
      completed: { text: 'Hoàn thành', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
    }[order.status];

    const Icon = badges.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badges.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badges.text}
      </span>
    );
  };

  const renderActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onAccept(order.id)}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              Chấp nhận
            </button>
            <button
              onClick={() => onDecline(order.id)}
              className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              Từ chối
            </button>
          </div>
        );

      case 'accepted':
        return (
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán - Sẵn sàng giao hàng' : 'Chờ người mua thanh toán (24h)'}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onContact(order.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-[#0A2647] dark:border-blue-500 text-[#0A2647] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Nhắn tin buyer
              </button>
              <button
                onClick={() => onCancel(order.id)}
                className="px-6 py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg font-medium text-sm transition-colors"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        );

      case 'confirmed':
        return (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onMarkShipping(order.id)}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
              >
                Bắt đầu giao hàng
              </button>
              <button
                onClick={() => onContact(order.id)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Nhắn tin
              </button>
            </div>
            <button
              onClick={() => onCancel(order.id)}
              className="w-full px-6 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg font-medium text-sm transition-colors"
            >
              Hủy đơn (đã thanh toán - cần lý do chính đáng)
            </button>
          </div>
        );

      case 'shipping':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onMarkCompleted(order.id)}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              Xác nhận đã giao
            </button>
            <button
              onClick={() => onContact(order.id)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Nhắn tin
            </button>
          </div>
        );

      case 'completed':
        return (
          <button
            onClick={() => onContact(order.id)}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Xem đánh giá / Nhắn tin
          </button>
        );

      case 'declined':
      case 'cancelled':
        return (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Lý do:</span> {order.declineReason || order.cancelReason || 'Không có thông tin'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
      {/* Main content - always visible */}
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Product thumbnail */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <ImageWithFallback src={order.productImage} alt={order.productTitle} className="w-full h-full object-cover" />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">{order.productTitle}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {getStatusBadge()}
                  <span className="text-sm text-gray-500 dark:text-gray-400">{order.requestDate}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-[#FF6B35]">{order.productPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Buyer info - compact */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {order.buyerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{order.buyerName}</span>
                    <BadgeCheck className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.university}</p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Link
              to={`/seller/orders/${order.orderId || order.id}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white rounded-lg font-medium text-sm transition-all border border-gray-300 dark:border-gray-600"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết đơn hàng
            </Link>

            {/* Actions */}
            {renderActions()}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-200 dark:border-gray-700 mt-4">
          <div className="pt-4 space-y-3">
            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-mono">{order.buyerEmail}</span>
              </div>
              {order.buyerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{order.buyerPhone}</span>
                </div>
              )}
            </div>

            {/* Delivery address */}
            {order.deliveryAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{order.deliveryAddress}</span>
              </div>
            )}

            {/* Timeline */}
            {order.acceptedDate && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Đã chấp nhận: {order.acceptedDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
