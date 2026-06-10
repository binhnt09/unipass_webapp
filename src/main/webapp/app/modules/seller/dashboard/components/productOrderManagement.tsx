import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Bell, Package, Search, Filter, Download, ShoppingCart, TrendingUp, Eye, Loader2 } from 'lucide-react';

import { SellerOrderCard, type OrderRequestStatus } from './sellerOrderCard';
import { OrderStatus, OrderStatusTabs } from './orderStatusTabs';
import { DeclineReasonModal } from './declineReasonModal';
import { CancelSellerOrderModal } from './cancelSellerOrderModal';

import { ImageWithFallback } from '../../../../shared/figma/ImageWithFallback';
import { useNotifications } from '../../../../contexts/notificationContext';
import { toast } from 'react-toastify';

interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

interface OrderRequest {
  id: string;
  orderId: string;
  status: OrderRequestStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  university: string;
  requestDate: string;
  requestDateRaw: Date | null;
  acceptedDate?: string;
  items: OrderItem[];
  productPrice: number; // Tổng số tiền của đơn hàng
  deliveryAddress?: string;
  paymentStatus?: 'unpaid' | 'paid';
  declineReason?: string;
  cancelReason?: string;
}

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  views: number;
  status: 'active' | 'pending' | 'sold';
}

interface IProductResponse {
  id?: number;
  name?: string;
  price?: number;
  status?: string;
  views?: number;
}

export function ProductOrderManagementPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [product, setProduct] = useState<Product | null>(null);
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

  // Calculate counts
  const mapBackendStatus = (status?: string): OrderRequestStatus => {
    const normalized = String(status || '').toUpperCase();
    switch (normalized) {
      case 'PENDING':
      case 'WAITING':
      case 'PENDING_CONFIRM':
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
      case 'CANCELLED':
      case 'REJECTED':
        return 'declined';
      default:
        return 'pending';
    }
  };

  const formatOrderDate = (value?: string | number | Date) => {
    if (!value) return 'Chưa rõ';
    return dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : String(value);
  };

  const loadProductOrders = async () => {
    if (!productId) {
      setError('Không tìm thấy sản phẩm.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productRes, ordersRes, imagesRes] = await Promise.all([
        axios.get<IProductResponse>(`/api/products/${productId}`),
        axios.get<any[]>(`/api/orders/seller`),
        axios.get<any[]>(`/api/product-images?productId=${productId}`).catch(() => ({ data: [] })),
      ]);

      const productData = productRes.data;
      const imageData = imagesRes.data || [];
      const primaryImage = imageData.find(img => img.isPrimary) || imageData[0];
      let imageUrl = primaryImage?.imageUrl || '';
      if (imageUrl && imageUrl.startsWith('uploads/')) {
        imageUrl = '/' + imageUrl;
      }
      setProduct({
        id: productId,
        title: productData?.name || 'Sản phẩm không xác định',
        image: imageUrl || '/content/images/default-product.png',
        price: productData?.price ?? 0,
        views: productData?.views ?? 0,
        status: (productData?.status || 'active').toLowerCase() as 'active' | 'pending' | 'sold',
      });

      const orderMap = new Map<string, any>();
      (ordersRes.data || []).forEach(order => {
        const itemsWithProduct = (order.items || []).filter((item: any) => String(item.product?.id ?? item.productId ?? '') === productId);

        if (itemsWithProduct.length > 0) {
          const buyer = order.buyer || {};
          const buyerDetails = parseMeetupLocation(order.meetupLocation);
          const status = mapBackendStatus(order.status);
          const rawCreatedDate = order.createdAt ? new Date(order.createdAt) : null;

          orderMap.set(String(order.id), {
            id: String(order.id),
            orderId: String(order.id),
            status,
            buyerName: buyerDetails.name || buyer.login || `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() || 'Người mua ẩn danh',
            buyerEmail: buyer.email || buyer.login || 'Không có email',
            buyerPhone: buyerDetails.phone || buyer.phone || undefined,
            university: buyer.university?.name || 'Không rõ',
            requestDate: rawCreatedDate
              ? dayjs(rawCreatedDate).format('DD/MM/YYYY HH:mm')
              : formatOrderDate(order.createdAt || order.createdDate || new Date()),
            requestDateRaw: rawCreatedDate,
            acceptedDate: order.acceptedDate ? formatOrderDate(order.acceptedDate) : undefined,
            items: (order.items || []).map((item: any) => {
              const itemImages = imageData.filter(
                (img: any) => String(img.product?.id ?? img.productId ?? '') === String(item.product?.id ?? item.productId ?? ''),
              );
              const itemPrimaryImage = itemImages.find((img: any) => img.isPrimary) || itemImages[0];
              let itemImageUrl = itemPrimaryImage?.imageUrl || '';
              if (itemImageUrl && itemImageUrl.startsWith('uploads/')) {
                itemImageUrl = '/' + itemImageUrl;
              }

              return {
                id: String(item.id ?? 'unknown'),
                productId: String(item.product?.id ?? item.productId ?? 'unknown'),
                productTitle: item.product?.name || 'Sản phẩm không rõ',
                productImage: itemImageUrl || imageUrl || '/content/images/default-product.png',
                productPrice: item.price ?? item.product?.price ?? 0,
                quantity: item.quantity ?? 1,
              };
            }),
            deliveryAddress: buyerDetails.address || order.meetupLocation || order.deliveryAddress || '',
            paymentStatus: ['CONFIRMED', 'PAID'].includes(String(order.status || '').toUpperCase()) ? 'paid' : 'unpaid',
            declineReason: order.cancelReason || order.declineReason || undefined,
            cancelReason: order.cancelReason || undefined,
          });
        }
      });

      const mappedOrders = Array.from(orderMap.values()) as OrderRequest[];
      setOrders(mappedOrders);
    } catch (loadError: any) {
      console.error('Failed to load product order list:', loadError);
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductOrders();
  }, [productId]);

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

  // Filter and sort
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
      filtered = filtered.filter(
        o =>
          o.buyerName.toLowerCase().includes(query) ||
          o.buyerEmail.toLowerCase().includes(query) ||
          o.university.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      }
      const aTotalPrice = a.items?.reduce((sum, item) => sum + item.productPrice * item.quantity, 0) ?? 0;
      const bTotalPrice = b.items?.reduce((sum, item) => sum + item.productPrice * item.quantity, 0) ?? 0;
      return bTotalPrice - aTotalPrice;
    });

    return filtered;
  }, [orders, activeTab, searchQuery, sortBy]);

  // Handlers
  const handleAccept = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    await new Promise(resolve => setTimeout(resolve, 1000));
    const existingAccepted = orders.find(
      o => o.orderId === order.orderId && o.id !== order.id && ['accepted', 'confirmed', 'shipping'].includes(o.status),
    );
    if (existingAccepted) {
      toast.warning('Đơn hàng này đã được xác nhận. Vui lòng từ chối các yêu cầu khác.');
      return;
    }
    try {
      // Gọi API chấp nhận đơn hàng lên Backend
      await axios.put(`/api/orders/${order.orderId || orderId}/accept`);

      toast.success('Đã chấp nhận yêu cầu của người mua!');
      addNotification({
        type: 'order',
        title: 'Đã chấp nhận yêu cầu!',
        message: `Người mua ${order.buyerName} sẽ nhận thông báo và chuẩn bị giao nhận.`,
      });

      loadProductOrders(); // Tải lại dữ liệu mới nhất từ DB
    } catch (err) {
      console.error('Lỗi khi chấp nhận đơn hàng:', err);
      toast.error('Không thể chấp nhận đơn hàng. Vui lòng thử lại.');
    }
    // setOrders(
    //   orders.map(o =>
    //     o.id === orderId
    //       ? {
    //           ...o,
    //           status: 'accepted' as OrderRequestStatus,
    //           acceptedDate: new Date().toLocaleString('vi-VN'),
    //           paymentStatus: 'unpaid' as const,
    //         }
    //       : o,
    //   ),
    // );

    // addNotification({
    //   type: 'order',
    //   title: 'Đã chấp nhận yêu cầu!',
    //   message: `Người mua ${order.buyerName} sẽ nhận thông báo và có 24h để thanh toán.`,
    // });
  };

  const handleDecline = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) setSelectedOrderForDecline(order);
  };

  const handleDeclineConfirm = async (reason: string, notes: string) => {
    if (!selectedOrderForDecline) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
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

    try {
      // Gọi API từ chối kèm theo lý do cụ thể gửi lên Backend
      await axios.put(`/api/orders/${selectedOrderForDecline.orderId}/decline`, {
        reason: reasonLabel,
      });

      toast.success('Đã từ chối đơn hàng thành công.');
      addNotification({
        type: 'order',
        title: 'Đã từ chối yêu cầu',
        message: `Người mua ${selectedOrderForDecline.buyerName} sẽ nhận được thông báo kèm lý do.`,
      });

      setSelectedOrderForDecline(null);
      loadProductOrders(); // Cập nhật lại danh sách thực tế
    } catch (err) {
      console.error('Lỗi khi từ chối đơn hàng:', err);
      toast.error('Gặp lỗi khi xử lý từ chối đơn hàng.');
    }

    // setOrders(
    //   orders.map(o =>
    //     o.id === selectedOrderForDecline.id ? { ...o, status: 'declined' as OrderRequestStatus, declineReason: reasonLabel } : o,
    //   ),
    // );

    // addNotification({
    //   type: 'order',
    //   title: 'Đã từ chối yêu cầu',
    //   message: `Người mua ${selectedOrderForDecline.buyerName} sẽ nhận được thông báo.`,
    // });

    // setSelectedOrderForDecline(null);
  };

  const handleCancel = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) setSelectedOrderForCancel(order);
  };

  const handleCancelConfirm = async (reason: string, notes: string) => {
    if (!selectedOrderForCancel) return;

    try {
      // Tái sử dụng endpoint decline/cancel của Backend cùng với lý do hủy từ Modal lý do
      await axios.put(`/api/orders/${selectedOrderForCancel.orderId}/decline`, {
        reason: notes || reason || 'Hủy đơn hàng',
      });

      toast.success('Đã hủy đơn hàng thành công.');
      addNotification({
        type: 'order',
        title: 'Đơn hàng đã được hủy',
        message: 'Người mua sẽ nhận được thông báo và lý do hủy.',
      });

      setSelectedOrderForCancel(null); // [cite: 58]
      loadProductOrders();
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
      toast.error('Gặp lỗi khi hủy đơn hàng.');
    }

    // await new Promise(resolve => setTimeout(resolve, 1000));
    // setOrders(
    //   orders.map(o => (o.id === selectedOrderForCancel.id ? { ...o, status: 'cancelled' as OrderRequestStatus, cancelReason: notes } : o)),
    // );

    // addNotification({
    //   type: 'order',
    //   title: 'Đơn hàng đã được hủy',
    //   message: 'Người mua sẽ nhận được thông báo và lý do hủy.',
    // });

    // setSelectedOrderForCancel(null);
  };

  const handleContact = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) navigate(`/messages?buyer=${order.buyerName}&order=${order.orderId || orderId}`);
  };

  const handleMarkShipping = async (orderId: string) => {
    try {
      // Cập nhật trạng thái SHIPPING trực tiếp lên DB
      await axios.put(`/api/orders/${orderId}/accept`); // Đổi endpoint tương ứng nếu BE chia riêng phương thức giao hàng
      toast.success('Trạng thái: Đang giao hàng.');
      addNotification({
        type: 'order',
        title: 'Đã cập nhật trạng thái',
        message: 'Đơn hàng đang được giao.',
      });
      loadProductOrders();
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật trạng thái giao hàng.');
    }

    // setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'shipping' as OrderRequestStatus } : o)));
    // addNotification({
    //   type: 'order',
    //   title: 'Đã cập nhật trạng thái',
    //   message: 'Đơn hàng đang được giao.',
    // });
  };

  const handleMarkCompleted = async (orderId: string) => {
    try {
      // Cập nhật trạng thái thành công lên Database
      await axios.put(`/api/orders/${orderId}/confirm-received`);
      toast.success('Chúc mừng! Đơn hàng đã hoàn thành thành công.');
      addNotification({
        type: 'order',
        title: 'Đơn hàng hoàn thành!',
        message: 'Giao dịch đã hoàn tất.',
      });
      loadProductOrders();
    } catch (err) {
      console.error(err);
      toast.error('Không thể xác nhận hoàn thành đơn hàng.');
    }
    // setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'completed' as OrderRequestStatus } : o)));
    // addNotification({
    //   type: 'order',
    //   title: 'Đơn hàng hoàn thành!',
    //   message: 'Giao dịch đã hoàn tất.',
    // });
  };

  const handleExportOrders = () => {
    const csv = filteredOrders
      .map(o => {
        const itemsText = o.items?.map(item => `${item.productTitle}(x${item.quantity})`).join(';') || '';
        const totalPrice = o.items?.reduce((sum, item) => sum + item.productPrice * item.quantity, 0) ?? 0;
        return `${o.id},${o.buyerName},${itemsText},${totalPrice},${o.status}`;
      })
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    addNotification({
      type: 'system',
      title: 'Đã xuất dữ liệu',
      message: `Đã xuất ${filteredOrders.length} đơn hàng.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center max-w-lg w-full">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0A2647] dark:text-white mb-2">Có lỗi khi tải đơn hàng</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/seller-dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white rounded-lg font-medium transition-all"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/seller-dashboard"
          className="inline-flex items-center gap-2 text-[#0A2647] dark:text-white hover:text-[#FF6B35] mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại Dashboard
        </Link>

        {/* Product Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image */}
            <div className="w-full lg:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              <ImageWithFallback src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0A2647] dark:text-white mb-3">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span className="text-3xl font-bold text-[#FF6B35]">{product.price.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{product.views} lượt xem</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Đang hoạt động
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{orderCounts.pending}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đã xác nhận</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orderCounts.accepted}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{orderCounts.completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State - Show if no orders */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Bell className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chưa có ai đặt mua sản phẩm này</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Khi có người đặt mua, bạn sẽ thấy danh sách yêu cầu ở đây và nhận được thông báo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/seller-dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-medium transition-all shadow-lg"
              >
                Quay lại Dashboard
              </Link>
              <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Chia sẻ sản phẩm
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Order Status Tabs */}
            <div className="mb-6">
              <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} counts={orderCounts} />
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên người mua, email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'date' | 'price')}
                    className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 font-medium cursor-pointer"
                  >
                    <option value="date">Mới nhất</option>
                    <option value="price">Giá cao nhất</option>
                  </select>
                </div>
                <button
                  onClick={handleExportOrders}
                  className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Xuất CSV"
                >
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Không tìm thấy đơn hàng phù hợp với bộ lọc của bạn.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <SellerOrderCard
                    key={`${order.orderId}-${order.requestDateRaw?.getTime() ?? 0}`}
                    order={order}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onCancel={handleCancel}
                    onContact={handleContact}
                    onMarkShipping={handleMarkShipping}
                    onMarkCompleted={handleMarkCompleted}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {selectedOrderForDecline && (
        <DeclineReasonModal
          isOpen={true}
          buyerName={selectedOrderForDecline.buyerName}
          productTitle={selectedOrderForDecline.items?.[0]?.productTitle || 'Sản phẩm'}
          onClose={() => setSelectedOrderForDecline(null)}
          onConfirm={handleDeclineConfirm}
        />
      )}

      {selectedOrderForCancel && (
        <CancelSellerOrderModal
          isOpen={true}
          orderNumber={selectedOrderForCancel.id}
          buyerName={selectedOrderForCancel.buyerName}
          productTitle={selectedOrderForCancel.items?.[0]?.productTitle || 'Sản phẩm'}
          orderStatus={selectedOrderForCancel.status as any}
          onClose={() => setSelectedOrderForCancel(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}
