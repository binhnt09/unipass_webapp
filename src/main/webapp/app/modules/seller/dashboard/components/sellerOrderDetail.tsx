import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  BadgeCheck,
  MessageCircle,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import { ImageWithFallback } from '../../../../shared/figma/ImageWithFallback';
import { OrderTrackingTimeline } from '../../../order/pages/orderTrackingTimeline';
import { OrderNotes } from '../../../order/pages/orderNotes';
import { CancelSellerOrderModal } from '../components/cancelSellerOrderModal';
import { useNotifications } from '../../../../contexts/notificationContext';
import { toast } from 'react-toastify';

interface SellerOrderDetail {
  id: string;
  orderNumber: string;
  status: 'pending' | 'accepted' | 'confirmed' | 'shipping' | 'completed' | 'declined' | 'cancelled';
  statusText: string;
  buyerName: string;
  buyerId?: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerUniversity: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  requestDate: string;
  acceptedDate?: string;
  confirmedDate?: string;
  completedDate?: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid';
  sellerNotes?: string;
  trackingSteps: {
    label: string;
    time: string;
    completed: boolean;
    description?: string;
  }[];
}

const mapBackendStatusToFEStatus = (status?: string) => {
  const normalized = String(status || '').toUpperCase();
  switch (normalized) {
    case 'PENDING':
    case 'PENDING_CONFIRM':
    case 'WAITING':
      return 'pending';
    case 'ACCEPTED':
    case 'CONFIRMED':
    case 'PAYMENT_PENDING':
      return 'accepted';
    case 'SHIPPING':
    case 'DELIVERING':
      return 'shipping';
    case 'COMPLETED':
    case 'DELIVERED':
      return 'completed';
    case 'DECLINED':
      return 'declined';
    case 'CANCELLED':
    case 'REJECTED':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const getStatusText = (status?: string) => {
  const normalized = String(status || '').toUpperCase();
  switch (normalized) {
    case 'PENDING':
    case 'WAITING':
      return 'CHỜ XỬ LÝ';
    case 'ACCEPTED':
    case 'CONFIRMED':
    case 'PAYMENT_PENDING':
      return 'ĐÃ CHẤP NHẬN - CHỜ THANH TOÁN';
    case 'SHIPPING':
    case 'DELIVERING':
      return 'ĐANG GIAO HÀNG';
    case 'COMPLETED':
    case 'DELIVERED':
      return 'HOÀN THÀNH';
    case 'DECLINED':
      return 'ĐÃ TỪ CHỐI';
    case 'CANCELLED':
    case 'REJECTED':
      return 'ĐÃ HỦY';
    default:
      return 'ĐANG CHỜ';
  }
};

const parseDeliveryInfo = (meetupLocation?: string) => {
  if (!meetupLocation) return { name: '', phone: '', address: '' };
  const parts = meetupLocation.split('|').map(p => p.trim());
  return {
    name: parts[0]?.replace('Người nhận:', '').trim() || '',
    phone: parts[1]?.replace('SĐT:', '').trim() || '',
    address: parts[2]?.replace('Địa chỉ:', '').trim() || meetupLocation,
  };
};

const getSellerProductTitle = (firstItem: any, beOrder: any) =>
  firstItem.product?.name || firstItem.productName || beOrder.productName || 'Sản phẩm';

const getSellerProductImage = (firstItem: any) => firstItem.productMainImage || '/content/images/default-product.png';

const getSellerProductPrice = (firstItem: any, beOrder: any) => firstItem.price ?? firstItem.unitPrice ?? beOrder.totalAmount ?? 0;

const getSellerTrackingSteps = (status: string, beOrder: any) => {
  const statusOrder = ['PENDING_CONFIRM', 'ACCEPTED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];
  const currentStatusIndex = Math.max(statusOrder.indexOf(String(status || '').toUpperCase()), 0);

  const normalizeLabel = (rawStatus: string) => {
    switch (String(rawStatus || '').toUpperCase()) {
      case 'PENDING_CONFIRM':
        return 'Đơn hàng đã được đặt';
      case 'ACCEPTED':
        return 'Người bán đã xác nhận';
      case 'SHIPPING':
        return 'Đang giao hàng';
      case 'COMPLETED':
        return 'Đã giao hàng';
      case 'CANCELLED':
        return 'Đã hủy đơn hàng';
      default:
        return String(rawStatus || '');
    }
  };

  const trackingStepsFromHistory = (histories: any[]) => {
    const seenLabels = new Set<string>();
    return histories.reduce((steps: any[], h: any) => {
      const rawStatus = String(h.status || '').toUpperCase();
      const label = normalizeLabel(rawStatus);
      if (!label || seenLabels.has(label)) return steps;
      seenLabels.add(label);
      const statusIndex = statusOrder.indexOf(rawStatus);
      steps.push({
        label,
        time: h.createdAt ? new Date(h.createdAt).toLocaleString('vi-VN') : '',
        completed: statusIndex >= 0 ? statusIndex <= currentStatusIndex : true,
        description: h.note || '',
      });
      return steps;
    }, [] as any[]);
  };

  if (beOrder.statusHistories && beOrder.statusHistories.length > 0) {
    const sortedHistories = [...beOrder.statusHistories].sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const trackingSteps = trackingStepsFromHistory(sortedHistories);

    const hasLabel = (label: string) => trackingSteps.some(step => step.label === label);
    const pushIfMissing = (step: any) => {
      if (!hasLabel(step.label)) trackingSteps.push(step);
    };

    const lastStatus = String(sortedHistories[sortedHistories.length - 1].status).toUpperCase();
    if (lastStatus !== 'COMPLETED' && lastStatus !== 'CANCELLED') {
      if (lastStatus === 'PENDING_CONFIRM') {
        pushIfMissing({
          label: 'Người bán đã xác nhận',
          time: '',
          completed: statusOrder.indexOf('ACCEPTED') <= currentStatusIndex,
          description: 'Chờ người bán xác nhận',
        });
        pushIfMissing({
          label: 'Đang giao hàng',
          time: '',
          completed: statusOrder.indexOf('SHIPPING') <= currentStatusIndex,
          description: 'Chờ giao hàng',
        });
        pushIfMissing({
          label: 'Đã giao hàng',
          time: '',
          completed: statusOrder.indexOf('COMPLETED') <= currentStatusIndex,
          description: 'Chờ nhận hàng',
        });
      } else if (lastStatus === 'ACCEPTED') {
        pushIfMissing({
          label: 'Đang giao hàng',
          time: '',
          completed: statusOrder.indexOf('SHIPPING') <= currentStatusIndex,
          description: 'Chờ giao hàng',
        });
        pushIfMissing({
          label: 'Đã giao hàng',
          time: '',
          completed: statusOrder.indexOf('COMPLETED') <= currentStatusIndex,
          description: 'Chờ nhận hàng',
        });
      } else if (lastStatus === 'SHIPPING') {
        pushIfMissing({
          label: 'Đã giao hàng',
          time: '',
          completed: statusOrder.indexOf('COMPLETED') <= currentStatusIndex,
          description: 'Chờ nhận hàng',
        });
      }
    }
    return trackingSteps;
  }

  const shipmentDate = beOrder.shippedDate || beOrder.shippingDate;
  return [
    {
      label: 'Đơn hàng đã được đặt',
      time: beOrder.createdAt ? new Date(beOrder.createdAt).toLocaleString('vi-VN') : '',
      completed: true,
      description: 'Đơn hàng đã được tạo thành công',
    },
    {
      label: 'Người bán đã xác nhận',
      time: beOrder.acceptedDate ? new Date(beOrder.acceptedDate).toLocaleString('vi-VN') : '',
      completed: status === 'accepted' || status === 'shipping' || status === 'completed',
      description: 'Người bán đã xác nhận và đang chuẩn bị đóng gói',
    },
    {
      label: 'Đang giao hàng',
      time: shipmentDate ? new Date(shipmentDate).toLocaleString('vi-VN') : '',
      completed: status === 'shipping' || status === 'completed',
      description: 'Đơn hàng đang trên đường giao',
    },
    {
      label: 'Đã giao hàng',
      time: beOrder.completedDate ? new Date(beOrder.completedDate).toLocaleString('vi-VN') : '',
      completed: status === 'completed',
      description: 'Giao hàng thành công',
    },
  ];
};

const getSellerPaymentStatus = (status?: string) =>
  ['PAID', 'CONFIRMED', 'COMPLETED', 'DELIVERED'].includes(String(status || '').toUpperCase()) ? 'paid' : 'unpaid';

const mapBEOrderToSellerDetail = (beOrder: any, id: string): SellerOrderDetail => {
  const buyer = beOrder.buyer || beOrder.customer || {};
  const items = beOrder.items || beOrder.orderItems || [];
  const firstItem = items[0] || {};
  const status = mapBackendStatusToFEStatus(beOrder.status);
  const deliveryInfo = parseDeliveryInfo(beOrder.meetupLocation || beOrder.deliveryAddress);

  return {
    id: beOrder.id?.toString() || id,
    orderNumber: beOrder.id ? `ORD${beOrder.id}` : `ORD${id}`,
    status,
    statusText: getStatusText(beOrder.status),
    buyerName: deliveryInfo.name || buyer.login || 'Người mua',
    buyerId: buyer.id?.toString(),
    buyerEmail: buyer.email || buyer.login || 'Không có email',
    buyerPhone: deliveryInfo.phone || '',
    buyerUniversity: buyer.university?.name || buyer.universityName || 'Đại học chưa xác định',
    productId: firstItem.product?.id?.toString() || firstItem.productId?.toString() || '',
    productTitle: getSellerProductTitle(firstItem, beOrder),
    productImage: getSellerProductImage(firstItem),
    productPrice: getSellerProductPrice(firstItem, beOrder),
    requestDate: beOrder.createdAt ? new Date(beOrder.createdAt).toLocaleString('vi-VN') : '',
    acceptedDate: beOrder.acceptedDate ? new Date(beOrder.acceptedDate).toLocaleString('vi-VN') : undefined,
    confirmedDate: beOrder.confirmedDate ? new Date(beOrder.confirmedDate).toLocaleString('vi-VN') : undefined,
    completedDate: beOrder.completedDate ? new Date(beOrder.completedDate).toLocaleString('vi-VN') : undefined,
    deliveryAddress: deliveryInfo.address,
    paymentMethod: beOrder.paymentMethod || 'Thanh toán trực tiếp',
    paymentStatus: getSellerPaymentStatus(beOrder.status),
    sellerNotes: beOrder.sellerNotes || beOrder.notes || '',
    trackingSteps: getSellerTrackingSteps(status, beOrder),
  };
};

// Mock data
const mockOrderData: Record<string, SellerOrderDetail> = {
  '1': {
    id: 'ord1',
    orderNumber: 'UM2024060201',
    status: 'accepted',
    statusText: 'ĐÃ CHẤP NHẬN - CHỜ THANH TOÁN',
    buyerName: 'Trần Thị Mai',
    buyerEmail: 'mai.tran@student.hust.edu.vn',
    buyerPhone: '0912 345 678',
    buyerUniversity: 'ĐH Bách Khoa Hà Nội',
    productId: 'p1',
    productTitle: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    productImage:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    productPrice: 12500000,
    requestDate: '01/06/2026 14:30',
    acceptedDate: '01/06/2026 15:00',
    deliveryAddress: 'Ký túc xá A, Phòng 305, ĐH Bách Khoa Hà Nội',
    paymentMethod: 'Chuyển khoản ngân hàng',
    paymentStatus: 'unpaid',
    trackingSteps: [
      { label: 'Nhận yêu cầu mua', time: '01/06/2026 14:30', completed: true, description: 'Người mua gửi yêu cầu' },
      { label: 'Đã chấp nhận yêu cầu', time: '01/06/2026 15:00', completed: true, description: 'Bạn đã chấp nhận yêu cầu mua' },
      { label: 'Chờ thanh toán', time: '', completed: false, description: 'Người mua có 24h để thanh toán' },
      { label: 'Giao hàng', time: '', completed: false, description: 'Giao sản phẩm cho người mua' },
      { label: 'Hoàn thành', time: '', completed: false, description: 'Người mua xác nhận đã nhận hàng' },
    ],
  },
};

export function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [order, setOrder] = useState<SellerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/orders/detail/${id}`);
        const beOrder = response.data || {};

        if (isMounted) {
          // Luôn đi qua hàm mapBEOrderToSellerDetail để làm sạch dữ liệu
          setOrder(mapBEOrderToSellerDetail(beOrder, id));
          setError(null);
        }
      } catch (fetchError: any) {
        console.error('[SellerOrderDetail] Fetch failed:', fetchError);
        if (isMounted) {
          const fallbackOrder = mockOrderData[id];
          if (fallbackOrder) setOrder(fallbackOrder);
          else setError('Không thể tải chi tiết đơn hàng.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Chạy ngay lần đầu vào trang
    fetchOrder();

    // Bật Real-time cập nhật mỗi 3 giây giống Buyer
    const intervalId = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId); // Hủy vòng lặp khi rời trang
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 p-10">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Không tải được đơn hàng</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#FF6B35] text-white font-medium hover:bg-[#e55a2b] transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đơn hàng không tồn tại.</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCancelOrder = async (reason: string, notes: string) => {
    try {
      const finalReason = notes ? `${reason} - ${notes}` : reason;
      await axios.put(`/api/orders/${order.id}/decline`, { reason: finalReason });

      setOrder({ ...order, status: 'cancelled', statusText: 'ĐÃ HỦY' });

      addNotification({
        type: 'order',
        title: 'Đơn hàng đã được hủy',
        message: 'Người mua sẽ nhận được thông báo và lý do hủy.',
      });

      setTimeout(() => navigate('/seller/dashboard'), 2000);
    } catch (cancelError) {
      console.error('[SellerOrderDetail] Cancel failed:', cancelError);
    }
  };

  const handleContactBuyer = async () => {
    if (!order.buyerId) {
      toast.error('Không tìm thấy thông tin người mua');
      return;
    }
    try {
      const response = await axios.post(`/api/chat-rooms/initiate?targetUserId=${order.buyerId}`);
      if (response.status === 200 || response.status === 201) {
        const roomId = response.data.id;
        navigate('/messages', { state: { selectedRoomId: roomId } });
      }
    } catch (err) {
      console.error('Error initiating chat room:', err);
      toast.error('Không thể mở cửa sổ chat. Vui lòng thử lại sau.');
    }
  };

  const handleMarkShipping = async () => {
    try {
      await axios.put(`/api/orders/${order.id}/shipping`);
      setOrder({
        ...order,
        status: 'shipping',
        statusText: 'ĐANG GIAO HÀNG',
      });

      addNotification({
        type: 'order',
        title: 'Đã cập nhật trạng thái',
        message: 'Đơn hàng đang được giao. Người mua sẽ nhận được thông báo.',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      const response = await axios.put(`/api/orders/${order.id}/accept`);
      const updatedOrder = response.data;
      const mappedOrder = mapBEOrderToSellerDetail(updatedOrder, id || order.id);
      // setOrder({
      //   ...mappedOrder,
      //   status: 'accepted',
      //   statusText: 'ĐÃ XÁC NHẬN',
      // });
      setOrder(mappedOrder);
      toast.success('Nguoi mua se nhan duoc thong bao.');
    } catch (e) {
      console.error('[SellerOrderDetail] Accept failed:', e);
      toast.error('Khong the chap nhan yeu cau. Vui long thu lai.');
    }
  };

  const handleMarkCompleted = () => {
    setOrder({
      ...order,
      status: 'completed',
      statusText: 'HOÀN THÀNH',
      completedDate: new Date().toLocaleString('vi-VN'),
    });

    addNotification({
      type: 'order',
      title: 'Đơn hàng hoàn thành!',
      message: 'Giao dịch đã hoàn tất. Cảm ơn bạn đã sử dụng UniMarket!',
    });
  };

  const handleSaveNotes = async (notes: string) => {
    if (!order) return;
    try {
      await axios.put(`/api/orders/${order.id}/notes`, { note: notes });
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'accepted':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'confirmed':
      case 'shipping':
        return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'declined':
      case 'cancelled':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6" />;
      case 'accepted':
      case 'confirmed':
        return <CheckCircle className="w-6 h-6" />;
      case 'shipping':
        return <Truck className="w-6 h-6" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      case 'declined':
      case 'cancelled':
        return <XCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/seller/orders"
          className="inline-flex items-center gap-2 text-[#0A2647] dark:text-white hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại quản lý Orders
        </Link>

        {/* Order Status Header */}
        <div className={`rounded-xl p-6 mb-6 border-2 shadow-sm ${getStatusColor(order.status)}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">{getStatusIcon(order.status)}</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{order.statusText}</h2>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <span>Mã đơn: {order.orderNumber}</span>
                  <button onClick={() => copyToClipboard(order.orderNumber, 'orderNumber')} className="hover:opacity-70 transition-opacity">
                    {copiedText === 'orderNumber' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Giá trị đơn hàng</p>
                <p className="text-3xl font-bold">{order.productPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <OrderTrackingTimeline steps={order.trackingSteps} currentStatus={order.status as any} />

            {/* Product Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-[#0A2647] dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF6B35]" />
                Sản phẩm
              </h3>
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <ImageWithFallback src={order.productImage} alt={order.productTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{order.productTitle}</h4>
                  <p className="text-2xl font-bold text-[#FF6B35]">{order.productPrice.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Yeu cau mua moi</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vui long xem xet yeu cau tu nguoi mua va quyet dinh chap nhan hoac tu choi.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold transition-colors"
                  >
                    Tu choi
                  </button>
                  <button
                    onClick={handleAcceptOrder}
                    className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-bold transition-all shadow-md"
                  >
                    Chap nhan
                  </button>
                </div>
              </div>
            )}
            {order.status === 'accepted' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {order.paymentStatus === 'paid' ? 'Người mua đã thanh toán' : 'Chờ người mua thanh toán'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.paymentStatus === 'paid'
                        ? 'Bạn có thể bắt đầu giao hàng'
                        : 'Người mua có 24h để thanh toán. Đơn sẽ tự động hủy nếu không thanh toán.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3 mb-4">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">San sang giao hang</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nguoi mua da thanh toan. Vui long bat dau giao hang.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-bold transition-colors border border-red-200 dark:border-red-800"
                  >
                    Huy don
                  </button>
                  <button
                    onClick={handleMarkShipping}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all shadow-md"
                  >
                    Bat dau giao hang
                  </button>
                </div>
              </div>
            )}

            {order.status === 'shipping' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Đã giao hàng thành công?</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Xác nhận khi bạn đã giao sản phẩm cho người mua</p>
                  </div>
                </div>
                <button
                  onClick={handleMarkCompleted}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all shadow-lg"
                >
                  Xác nhận đã giao hàng
                </button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Buyer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-[#0A2647] dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF6B35]" />
                Người mua
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {order.buyerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{order.buyerName}</span>
                      <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.buyerUniversity}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-shadow-2xs">{order.buyerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-shadow-2xs">{order.buyerPhone}</span>
                    <button
                      onClick={() => copyToClipboard(order.buyerPhone, 'phone')}
                      className="ml-auto text-gray-400 hover:text-[#FF6B35] transition-colors"
                    >
                      {copiedText === 'phone' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-shadow-2xs">{order.deliveryAddress}</span>
                  </div>
                </div>

                <button
                  onClick={handleContactBuyer}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-[#0A2647] dark:border-blue-500 text-[#0A2647] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin buyer
                </button>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-[#0A2647] dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
                Thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Phương thức</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Trạng thái</span>
                  <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-bold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-[#FF6B35]">{order.productPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Notes */}
            <OrderNotes orderId={order.id} initialNotes={order.sellerNotes || ''} onSave={handleSaveNotes} />
          </div>
        </div>

        {/* Cancel Modal */}
        <CancelSellerOrderModal
          isOpen={showCancelModal}
          orderNumber={order.orderNumber}
          buyerName={order.buyerName}
          productTitle={order.productTitle}
          orderStatus={order.status as any}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
        />
      </div>
    </div>
  );
}
