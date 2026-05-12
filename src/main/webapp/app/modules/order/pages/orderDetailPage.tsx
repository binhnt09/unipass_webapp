import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  BadgeCheck,
  MessageCircle,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Clock,
  Copy,
  Check,
  Printer,
  AlertCircle,
  Star,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';

interface OrderItem {
  id: string;
  productImage: string;
  productTitle: string;
  variation?: string;
  quantity: number;
  unitPrice: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  sellerName: string;
  sellerUniversity: string;
  sellerPhone: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  statusText: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderDate: string;
  deliveryAddress: string;
  deliveryPhone: string;
  receiverName: string;
  paymentMethod: string;
  estimatedDelivery?: string;
  trackingSteps: {
    label: string;
    time: string;
    completed: boolean;
    description?: string;
  }[];
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Mock order data based on ID
  const orderData: Record<string, OrderDetail> = {
    '1': {
      id: '1',
      orderNumber: 'UM2024032301',
      sellerName: 'Nam Nguyễn',
      sellerUniversity: 'ĐH Bách Khoa HN',
      sellerPhone: '0912 345 678',
      status: 'pending',
      statusText: 'CHỜ XÁC NHẬN',
      orderDate: '23/03/2024 14:30',
      estimatedDelivery: '25/03/2024',
      deliveryAddress: 'Ký túc xá A, Phòng 305, ĐH Bách Khoa Hà Nội',
      deliveryPhone: '0987 654 321',
      receiverName: 'Minh Hoàng',
      paymentMethod: 'Thanh toán khi nhận hàng (COD)',
      items: [
        {
          id: '1',
          productImage:
            'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          productTitle: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
          variation: 'Màu bạc',
          quantity: 1,
          unitPrice: 12500000,
        },
      ],
      subtotal: 12500000,
      shippingFee: 0,
      total: 12500000,
      trackingSteps: [
        {
          label: 'Đơn hàng đã được đặt',
          time: '23/03/2024 14:30',
          completed: true,
          description: 'Đơn hàng của bạn đã được tạo thành công',
        },
        {
          label: 'Người bán đang chuẩn bị hàng',
          time: '',
          completed: false,
          description: 'Chờ người bán xác nhận và chuẩn bị sản phẩm',
        },
        {
          label: 'Đang giao hàng',
          time: '',
          completed: false,
          description: 'Đơn hàng đang trên đường giao đến bạn',
        },
        {
          label: 'Đã giao hàng',
          time: '',
          completed: false,
          description: 'Giao hàng thành công',
        },
      ],
    },
    '2': {
      id: '2',
      orderNumber: 'UM2024032202',
      sellerName: 'Minh Trần',
      sellerUniversity: 'ĐH Kinh tế Quốc dân',
      sellerPhone: '0923 456 789',
      status: 'completed',
      statusText: 'ĐÃ GIAO',
      orderDate: '22/03/2024 10:15',
      deliveryAddress: 'Ký túc xá B2, Phòng 201, ĐH Kinh tế Quốc dân',
      deliveryPhone: '0987 654 321',
      receiverName: 'Minh Hoàng',
      paymentMethod: 'Ví MoMo',
      items: [
        {
          id: '2',
          productImage:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzczODkwMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          productTitle: 'Tai nghe Sony WH-1000XM4 - Chống ồn',
          variation: 'Màu đen',
          quantity: 1,
          unitPrice: 4500000,
        },
        {
          id: '3',
          productImage:
            'https://images.unsplash.com/photo-1766411503488-f90eef1124bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcCUyMG1vZGVybnxlbnwxfHx8fDE3NzM4MTc0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          productTitle: 'Đèn bàn LED thông minh - 3 chế độ ánh sáng',
          quantity: 2,
          unitPrice: 450000,
        },
      ],
      subtotal: 5400000,
      shippingFee: 0,
      total: 5400000,
      trackingSteps: [
        {
          label: 'Đơn hàng đã được đặt',
          time: '22/03/2024 10:15',
          completed: true,
          description: 'Đơn hàng của bạn đã được tạo thành công',
        },
        {
          label: 'Người bán đã xác nhận',
          time: '22/03/2024 10:45',
          completed: true,
          description: 'Người bán đã xác nhận và chuẩn bị hàng',
        },
        {
          label: 'Đang giao hàng',
          time: '22/03/2024 15:20',
          completed: true,
          description: 'Đơn hàng đang được giao đến bạn',
        },
        {
          label: 'Đã giao hàng thành công',
          time: '22/03/2024 17:30',
          completed: true,
          description: 'Giao hàng thành công và hoàn tất đơn hàng',
        },
      ],
    },
    '3': {
      id: '3',
      orderNumber: 'UM2024032103',
      sellerName: 'Hương Lê',
      sellerUniversity: 'ĐH Ngoại thương',
      sellerPhone: '0934 567 890',
      status: 'shipping',
      statusText: 'ĐANG GIAO HÀNG',
      orderDate: '21/03/2024 09:00',
      estimatedDelivery: '23/03/2024',
      deliveryAddress: 'Ký túc xá C, Phòng 104, ĐH Ngoại thương',
      deliveryPhone: '0987 654 321',
      receiverName: 'Minh Hoàng',
      paymentMethod: 'VNPay',
      items: [
        {
          id: '4',
          productImage:
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYWNrcGFja3xlbnwxfHx8fDE3NzM4OTAwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          productTitle: 'Balo laptop chống nước - Nhiều ngăn tiện lợi',
          variation: 'Màu xám',
          quantity: 1,
          unitPrice: 850000,
        },
      ],
      subtotal: 850000,
      shippingFee: 0,
      total: 850000,
      trackingSteps: [
        {
          label: 'Đơn hàng đã được đặt',
          time: '21/03/2024 09:00',
          completed: true,
          description: 'Đơn hàng của bạn đã được tạo thành công',
        },
        {
          label: 'Người bán đã xác nhận',
          time: '21/03/2024 09:30',
          completed: true,
          description: 'Người bán đã xác nhận và chuẩn bị hàng',
        },
        {
          label: 'Đang giao hàng',
          time: '22/03/2024 14:00',
          completed: true,
          description: 'Đơn hàng đang được giao đến bạn',
        },
        {
          label: 'Đã giao hàng',
          time: '',
          completed: false,
          description: 'Chờ giao hàng thành công',
        },
      ],
    },
  };

  const order = orderData[id || '1'] || orderData['1'];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6" />;
      case 'shipping':
        return <Truck className="w-6 h-6" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-[#FF6B35] border-[#FF6B35]';
      case 'shipping':
        return 'bg-blue-50 text-blue-600 border-blue-600';
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-600';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-600';
    }
  };

  const getStepIcon = (index: number, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <div className="w-3 h-3 rounded-full bg-current" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-[#0A2647] hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại đơn hàng của tôi
        </Link>

        {/* Order Status Header */}
        <div className={`rounded-xl p-6 mb-6 border-2 shadow-sm ${getStatusColor(order.status)}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/50 rounded-lg">{getStatusIcon(order.status)}</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{order.statusText}</h2>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <span>Mã đơn hàng: {order.orderNumber}</span>
                  <button
                    onClick={() => copyToClipboard(order.orderNumber, 'orderNumber')}
                    className="hover:opacity-70 transition-opacity"
                    title="Sao chép mã đơn"
                  >
                    {copiedText === 'orderNumber' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Calendar className="w-4 h-4" />
                <span>Ngày đặt: {order.orderDate}</span>
              </div>
              {order.estimatedDelivery && order.status !== 'completed' && (
                <div className="flex items-center gap-2 text-sm opacity-90 font-medium">
                  <Truck className="w-4 h-4" />
                  <span>Dự kiến giao: {order.estimatedDelivery}</span>
                </div>
              )}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors mt-2"
              >
                <Printer className="w-4 h-4" />
                In đơn hàng
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0A2647] mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF6B35]" />
                Trạng thái đơn hàng
              </h3>
              <div className="space-y-6">
                {order.trackingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          step.completed ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {getStepIcon(index, step.completed)}
                      </div>
                      {index < order.trackingSteps.length - 1 && (
                        <div className={`w-0.5 h-16 transition-all ${step.completed ? 'bg-[#FF6B35]' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-bold mb-1 ${step.completed ? 'text-[#0A2647]' : 'text-gray-400'}`}>{step.label}</p>
                      {step.description && (
                        <p className={`text-sm mb-2 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
                      )}
                      {step.time && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {step.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {order.sellerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A2647]">{order.sellerName}</span>
                      <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <p className="text-sm text-gray-500">{order.sellerUniversity}</p>
                  </div>
                </div>
                <Link
                  to="/messages"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-[#0A2647] text-[#0A2647] hover:bg-[#0A2647] hover:text-white rounded-lg font-medium text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin
                </Link>
              </div>

              <div className="space-y-4">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-200 hover:ring-[#FF6B35]/50 transition-all">
                      <ImageWithFallback src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="font-medium text-gray-900 mb-2 hover:text-[#FF6B35] transition-colors cursor-pointer">
                          {item.productTitle}
                        </h4>
                        {item.variation && <p className="text-sm text-gray-500 mb-1">Phân loại: {item.variation}</p>}
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-[#0A2647]">{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Based on Status */}
            {order.status === 'pending' && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Bạn muốn hủy đơn hàng?</h4>
                    <p className="text-sm text-gray-600">Bạn có thể hủy đơn hàng trước khi người bán xác nhận</p>
                  </div>
                </div>
                <button className="w-full px-6 py-3 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-lg font-medium transition-colors">
                  Hủy đơn hàng
                </button>
              </div>
            )}

            {order.status === 'shipping' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3 mb-4">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Đã nhận được hàng?</h4>
                    <p className="text-sm text-gray-600">Xác nhận khi bạn đã nhận được sản phẩm</p>
                  </div>
                </div>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md">
                  Xác nhận đã nhận hàng
                </button>
              </div>
            )}

            {order.status === 'completed' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Đánh giá đơn hàng này</h4>
                    <p className="text-sm text-gray-600">Chia sẻ trải nghiệm của bạn để giúp người mua khác</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  Viết đánh giá
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0A2647] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Người nhận</p>
                      <p className="font-bold text-gray-900">{order.receiverName}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{order.deliveryPhone}</p>
                        <button
                          onClick={() => copyToClipboard(order.deliveryPhone, 'phone')}
                          className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                        >
                          {copiedText === 'phone' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                      <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0A2647] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FF6B35]" />
                Thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium text-gray-900">{order.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium text-green-600">
                    {order.shippingFee === 0 ? 'Miễn phí' : `${order.shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-[#FF6B35]">{order.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-3 mt-4">
                  <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Seller Contact */}
            <div className="bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0A2647] rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin người bán
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-gray-300 mb-1">Tên người bán</p>
                  <p className="font-bold">{order.sellerName}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-gray-300 mb-1">Trường</p>
                  <p className="font-medium">{order.sellerUniversity}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-300 mb-1">Số điện thoại</p>
                      <p className="font-medium">{order.sellerPhone}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.sellerPhone, 'sellerPhone')}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {copiedText === 'sellerPhone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Link
                  to="/messages"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white hover:bg-gray-100 text-[#0A2647] rounded-lg font-medium text-sm transition-colors mt-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  Liên hệ người bán
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in">
            <h3 className="text-2xl font-bold text-[#0A2647] mb-2">Đánh giá đơn hàng</h3>
            <p className="text-gray-600 mb-6">Bạn hài lòng với đơn hàng này như thế nào?</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] mb-4 min-h-[120px]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle submit rating
                  setShowRatingModal(false);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-medium transition-all shadow-md"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
