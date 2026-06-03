import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Eye,
  BadgeCheck,
} from 'lucide-react';
import { ImageWithFallback } from '../../../../shared/figma/ImageWithFallback';

export type OrderRequestStatus = 'pending' | 'accepted' | 'confirmed' | 'shipping' | 'completed' | 'declined' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

export interface OrderRequest {
  id: string;
  orderId?: string;
  status: OrderRequestStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  university: string;
  requestDate: string;
  acceptedDate?: string;
  items?: OrderItem[];
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
      pending: { text: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-700', icon: Clock },
      accepted: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      shipping: { text: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
      completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 text-red-700', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
    }[order.status] || { text: 'Chờ xử lý', color: 'bg-gray-100 text-gray-700', icon: Clock };

    const Icon = badges.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badges.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badges.text}
      </span>
    );
  };

  const renderRightActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <button
              onClick={() => onDecline(order.id)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              Từ chối
            </button>
            <button
              onClick={() => onAccept(order.id)}
              className="px-6 py-2 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold text-sm transition-all shadow-md"
            >
              Chấp nhận
            </button>
          </>
        );
      case 'accepted':
      case 'confirmed':
        return (
          <>
            <button
              onClick={() => onCancel(order.id)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors border border-red-200"
            >
              Hủy đơn
            </button>
            <button
              onClick={() => onMarkShipping(order.id)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-md"
            >
              Bắt đầu giao hàng
            </button>
          </>
        );
      case 'shipping':
        return (
          <button
            onClick={() => onMarkCompleted(order.id)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-all shadow-md"
          >
            Xác nhận đã giao
          </button>
        );
      default:
        return null;
    }
  };

  // Lấy ảnh hiển thị đại diện từ sản phẩm đầu tiên nếu có
  const displayImage = order.items && order.items.length > 0 ? order.items[0].productImage : '/content/images/default-product.png';
  const displayTitle = order.items && order.items.length > 0 ? order.items[0].productTitle : 'Đơn hàng';
  const additionalItemsCount = order.items ? order.items.length - 1 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="p-5">
        {/* GIỮ NGUYÊN HOÀN TOÀN STYLE LAYOUT GỐC CỦA BẠN */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Khối ảnh bên trái */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <ImageWithFallback src={displayImage} alt={displayTitle} className="w-full h-full object-cover" />
          </div>

          {/* Khối thông tin bên phải */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">
                  {displayTitle}{' '}
                  {additionalItemsCount > 0 && (
                    <span className="text-sm font-normal text-gray-500"> (và {additionalItemsCount} sản phẩm khác)</span>
                  )}
                </h3>

                {/* 🔴 SỬA LỖI HIỂN THỊ CHI TIẾT SẢN PHẨM TRONG ĐƠN (OrderItem[]) */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-2 mb-3 space-y-1.5 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <span className="truncate font-medium max-w-[250px] md:max-w-[400px] block">{item.productTitle}</span>
                        <span className="flex-shrink-0 ml-2 text-gray-500">
                          {item.productPrice.toLocaleString('vi-VN')}đ{' '}
                          <span className="font-bold text-gray-700 dark:text-gray-300">x{item.quantity}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {getStatusBadge()}
                  {/* Cố định ngày yêu cầu không đổi */}
                  <span className="text-sm text-gray-500 dark:text-gray-400">Ngày đặt: {order.requestDate}</span>
                  {order.acceptedDate && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Xác nhận lúc: {order.acceptedDate}</span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-[#FF6B35]">{order.productPrice.toLocaleString('vi-VN')}đ</p>
                <span className="text-xs text-gray-400">Mã đơn: #{order.orderId || order.id}</span>
              </div>
            </div>

            {/* Khối thông tin Buyer */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {order.buyerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{order.buyerName}</span>
                    <BadgeCheck className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                  </div>
                  {/* FIX LỖI HIỂN THỊ UNIVERSITY */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{order.university || 'Không rõ trường đại học'}</p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Thanh tác vụ dưới cùng: Góc trái - Xem/Nhắn tin | Góc phải - Thao tác */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={`/seller/orders/${order.orderId || order.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors border border-gray-200"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </Link>
                <button
                  onClick={() => onContact(order.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium text-sm transition-colors border border-blue-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 w-full sm:w-auto">{renderRightActions()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vùng thông tin mở rộng */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 mt-2">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
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
            {order.deliveryAddress && (
              <div className="flex items-start gap-2 text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{order.deliveryAddress}</span>
              </div>
            )}
            {(order.status === 'declined' || order.status === 'cancelled') && (
              <div className="flex items-start gap-2 text-sm pt-2 border-t border-gray-200 dark:border-gray-700 text-red-600">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span className="font-medium">Lý do: {order.declineReason || order.cancelReason || 'Không rõ'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
