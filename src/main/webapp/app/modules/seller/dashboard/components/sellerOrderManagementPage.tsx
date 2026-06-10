import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Package, Search, Loader2 } from 'lucide-react';

import { OrderItem, SellerOrderCard, type OrderRequestStatus } from './sellerOrderCard';
import { OrderStatus, OrderStatusTabs } from './orderStatusTabs';
import { DeclineReasonModal } from './declineReasonModal';
import { CancelSellerOrderModal } from './cancelSellerOrderModal';
import { toast } from 'react-toastify';

interface OrderRequest {
  id: string;
  orderId: string;
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

export function SellerOrderManagementPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const [selectedOrderForDecline, setSelectedOrderForDecline] = useState<OrderRequest | null>(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<OrderRequest | null>(null);

  const parseMeetupLocation = (meetupLocation?: string) => {
    if (!meetupLocation) return { name: '', phone: '', address: '' };
    const parts = meetupLocation.split('|').map(p => p.trim());
    return {
      name: parts[0]?.replace('Người nhận:', '').trim() || '',
      phone: parts[1]?.replace('SĐT:', '').trim() || '',
      address: parts[2]?.replace('Địa chỉ:', '').trim() || meetupLocation,
    };
  };

  const mapBackendStatus = (status?: string): OrderRequestStatus => {
    const normalized = String(status || '').toUpperCase();
    switch (normalized) {
      case 'PENDING':
      case 'WAITING':
      case 'PENDING_CONFIRM':
        return 'pending';
      case 'ACCEPTED':
        return 'accepted';
      case 'CONFIRMED':
      case 'PAID':
        return 'confirmed';
      case 'SHIPPING':
      case 'DELIVERING':
        return 'shipping';
      case 'COMPLETED':
      case 'DELIVERED':
        return 'completed';
      case 'DECLINED':
      case 'REJECTED':
        return 'declined';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const formatOrderDate = (value?: string | number | Date) => {
    if (!value) return 'Chưa rõ';
    return dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : String(value);
  };

  const loadAllOrders = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await axios.get(`/api/orders/seller`);
      const beOrders = response.data || [];

      const mappedOrders: OrderRequest[] = beOrders.map((order: any) => {
        const buyer = order.buyer || {};
        const buyerDetails = parseMeetupLocation(order.meetupLocation);

        // Backend đã trả items xịn, chỉ việc map qua
        const items: OrderItem[] = (order.items || []).map((item: any) => {
          const productInfo = item.product || {};
          let imageUrl = item.productMainImage || '/content/images/default-product.png';
          if (imageUrl.startsWith('uploads/')) imageUrl = '/' + imageUrl;

          return {
            id: String(item.id),
            productId: String(productInfo.id || ''),
            productTitle: productInfo.name || 'Sản phẩm',
            productImage: imageUrl,
            productPrice: item.price ?? 0,
            quantity: item.quantity ?? 1,
          };
        });

        return {
          id: String(order.id),
          orderId: String(order.id),
          status: mapBackendStatus(order.status),
          buyerName: buyerDetails.name || buyer.login || 'Người mua',
          buyerEmail: buyer.email || buyer.login || 'Không có email',
          buyerPhone: buyerDetails.phone || undefined,
          university: buyer.universityName || 'Đại học FPT',
          requestDate: formatOrderDate(order.createdAt),
          acceptedDate: order.acceptedDate ? formatOrderDate(order.acceptedDate) : undefined,
          items,
          productPrice: order.totalAmount,
          deliveryAddress: buyerDetails.address || '',
          paymentStatus: 'unpaid',
          declineReason: order.cancelReason,
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      console.error(err);
      if (showLoader) setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllOrders();
    const refreshInterval = setInterval(() => loadAllOrders(false), 5000);
    return () => clearInterval(refreshInterval);
  }, []);

  const orderCounts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted' || o.status === 'confirmed').length,
      shipping: orders.filter(o => o.status === 'shipping').length,
      completed: orders.filter(o => o.status === 'completed').length,
      declined: orders.filter(o => o.status === 'declined' || o.status === 'cancelled').length,
    }),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (activeTab !== 'all') {
      if (activeTab === 'accepted') {
        filtered = filtered.filter(o => o.status === 'accepted' || o.status === 'confirmed');
      } else if (activeTab === 'declined') {
        filtered = filtered.filter(o => o.status === 'declined' || o.status === 'cancelled');
      } else {
        filtered = filtered.filter(o => o.status === activeTab);
      }
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => o.buyerName.toLowerCase().includes(query) || o.orderId.includes(query));
    }
    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      return b.productPrice - a.productPrice;
    });
    return filtered;
  }, [orders, activeTab, searchQuery, sortBy]);

  // --- HANDLERS (Gọi API) ---
  const updateOrderStatus = useCallback(
    async (orderId: string, action: 'accept' | 'shipping' | 'confirm-received' | 'decline', payload?: object) => {
      try {
        await axios.put(`/api/orders/${orderId}/${action}`, payload || {});
        await loadAllOrders(false);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    [loadAllOrders],
  );

  const handleAccept = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'accept');
    if (success) {
      toast.success('Đã chấp nhận yêu cầu của người mua!');
    } else {
      toast.error('Không thể chấp nhận đơn hàng. Vui lòng thử lại.');
    }
  };

  const handleDeclineConfirm = async (reason: string, notes: string) => {
    if (!selectedOrderForDecline) return;
    const reasonLabel =
      {
        already_sold: 'Sản phẩm đã bán cho người khác',
        not_available: 'Sản phẩm không còn sẵn',
        buyer_location: 'Người mua ngoài khu vực giao hàng',
        suspicious: 'Nghi ngờ gian lận hoặc spam',
        changed_mind: 'Thay đổi ý định không bán nữa',
        price_negotiation: 'Không đồng ý về giá',
        other: notes || 'Lý do khác',
      }[reason] || reason;

    const success = await updateOrderStatus(selectedOrderForDecline.orderId, 'decline', { reason: reasonLabel });
    if (success) {
      toast.success('Đã từ chối đơn hàng thành công.');
      setSelectedOrderForDecline(null);
    } else {
      toast.error('Gặp lỗi khi xử lý từ chối đơn hàng.');
    }
  };

  const handleCancelConfirm = async (reason: string, notes: string) => {
    if (!selectedOrderForCancel) return;
    const success = await updateOrderStatus(selectedOrderForCancel.orderId, 'decline', {
      reason: notes || reason || 'Hủy đơn hàng',
    });
    if (success) {
      toast.success('Đã hủy đơn hàng thành công.');
      setSelectedOrderForCancel(null);
    } else {
      toast.error('Gặp lỗi khi hủy đơn hàng.');
    }
  };

  const handleMarkShipping = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'shipping');
    if (success) {
      toast.success('Đã chuyển sang trạng thái đang giao hàng.');
    } else {
      toast.error('Lỗi cập nhật trạng thái.');
    }
  };

  const handleMarkCompleted = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'confirm-received');
    if (success) {
      toast.success('Đơn hàng đã hoàn thành thành công.');
    } else {
      toast.error('Lỗi xác nhận hoàn thành.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/seller-dashboard"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] mb-2 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[#0A2647] dark:text-white">Quản lý Tất cả Đơn hàng</h1>
          </div>
        </div>

        <div className="mb-6">
          <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} counts={orderCounts} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn, Tên người mua..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date' | 'price')}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none"
            >
              <option value="date">Mới nhất</option>
              <option value="price">Giá trị cao nhất</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có đơn hàng nào.</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error || 'Đơn hàng này không tồn tại hoặc đã xảy ra lỗi.'}</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <SellerOrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onDecline={() => setSelectedOrderForDecline(order)}
                onCancel={() => setSelectedOrderForCancel(order)}
                onContact={() => navigate(`/messages?order=${order.orderId}`)}
                onMarkShipping={handleMarkShipping}
                onMarkCompleted={handleMarkCompleted}
              />
            ))
          )}
        </div>
      </div>

      {selectedOrderForDecline && (
        <DeclineReasonModal
          isOpen={true}
          buyerName={selectedOrderForDecline.buyerName}
          productTitle={selectedOrderForDecline.productTitle}
          onClose={() => setSelectedOrderForDecline(null)}
          onConfirm={handleDeclineConfirm}
        />
      )}
      {selectedOrderForCancel && (
        <CancelSellerOrderModal
          isOpen={true}
          orderNumber={selectedOrderForCancel.id}
          buyerName={selectedOrderForCancel.buyerName}
          productTitle={selectedOrderForCancel.productTitle}
          orderStatus={selectedOrderForCancel.status as any}
          onClose={() => setSelectedOrderForCancel(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}
