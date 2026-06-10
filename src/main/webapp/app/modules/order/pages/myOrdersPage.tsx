import React, { useState, useEffect, useRef } from 'react';
import { Search, BadgeCheck, MessageCircle, Eye, Package, Copy, Check, ShoppingBag, Star, RotateCcw, SortAsc } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { Link } from 'react-router';
import { RatingModal } from '../components/ratingModal';
import axios from 'axios';
// Removed OrderTrackingTimeline usage here — using polling-based realtime updates instead

type OrderStatus = 'all' | 'pending' | 'accepted' | 'shipping' | 'completed' | 'cancelled';
type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc';

interface OrderItem {
  id: string;
  productImage: string;
  productTitle: string;
  variation?: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  sellerName: string;
  sellerId?: string;
  sellerUniversity: string;
  status: 'pending' | 'accepted' | 'shipping' | 'completed' | 'cancelled';
  statusText: string;
  items: OrderItem[];
  total: number;
  orderDate: string;
  orderDateRaw: number;
}

import { useNavigate } from 'react-router';

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentlyUpdatedOrderId, setRecentlyUpdatedOrderId] = useState<string | null>(null);
  const prevOrdersRef = useRef<Order[] | null>(null);
  const navigate = useNavigate();

  const handleContactSeller = async (sellerId?: string) => {
    if (!sellerId) {
      alert('Không tìm thấy thông tin người bán');
      return;
    }
    try {
      const response = await axios.post(`/api/chat-rooms/initiate?sellerId=${sellerId}`);
      if (response.status === 200 || response.status === 201) {
        const roomId = response.data.id;
        navigate('/messages', { state: { selectedRoomId: roomId } });
      }
    } catch (err) {
      console.error('Error initiating chat room:', err);
      alert('Không thể mở cửa sổ chat. Vui lòng thử lại sau.');
    }
  };

  const tabs = [
    { id: 'all' as OrderStatus, label: 'Tất cả' },
    { id: 'pending' as OrderStatus, label: 'Chờ xác nhận' },
    { id: 'accepted' as OrderStatus, label: 'Đã xác nhận' },
    { id: 'shipping' as OrderStatus, label: 'Chờ giao hàng' },
    { id: 'completed' as OrderStatus, label: 'Hoàn thành' },
    { id: 'cancelled' as OrderStatus, label: 'Đã hủy' },
  ];

  // order {
  //     id: '1',
  //     orderNumber: 'UM2024032301',
  //     sellerName: 'Nam Nguyễn',
  //     sellerUniversity: 'ĐH Bách Khoa HN',
  //     status: 'pending',
  //     statusText: 'CHỜ XÁC NHẬN',
  //     orderDate: '23/03/2024',
  //     items: [
  //       {
  //         id: '1',
  //         productImage:
  //           'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  //         productTitle: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
  //         variation: 'Màu bạc',
  //         quantity: 1,
  //         unitPrice: 12500000,
  //       },
  //     ],
  //     total: 12500000,
  //   },

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesTab = activeTab === 'all' || order.status === activeTab;
      const matchesSearch =
        searchQuery === '' ||
        order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          // return b.orderDate.localeCompare(a.orderDate);
          return b.orderDateRaw - a.orderDateRaw;
        case 'date-asc':
          // return a.orderDate.localeCompare(b.orderDate);
          return a.orderDateRaw - b.orderDateRaw;
        case 'price-desc':
          return b.total - a.total;
        case 'price-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const getOrderCount = (status: OrderStatus) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-[#FF6B35]';
      case 'accepted':
        return 'text-emerald-600';
      case 'shipping':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Hàm bổ trợ map trạng thái BE -> FE
  const mapBEStatusToFEStatus = (status: string): 'pending' | 'accepted' | 'shipping' | 'completed' | 'cancelled' => {
    if (!status) return 'pending';
    switch (status.toUpperCase()) {
      case 'PENDING_CONFIRM':
      case 'PENDING':
        return 'pending';
      case 'ACCEPT':
      case 'ACCEPTED': // Backend set ACCEPTED khi seller accept
        return 'accepted';
      case 'SHIPPING':
      case 'DELIVERING':
        return 'shipping';
      case 'COMPLETED':
      case 'DELIVERED':
        return 'completed';
      case 'CANCELLED':
      case 'DECLINED':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  // Hàm hiển thị chữ Tiếng Việt tương ứng
  const getStatusText = (status: string): string => {
    if (!status) return 'CHỜ XÁC NHẬN';
    switch (status.toUpperCase()) {
      case 'PENDING_CONFIRM':
      case 'PENDING':
        return 'CHỜ XÁC NHẬN';
      case 'ACCEPT':
      case 'ACCEPTED':
        return 'ĐÃ XÁC NHẬN';
      case 'SHIPPING':
      case 'DELIVERING':
        return 'ĐANG GIAO HÀNG';
      case 'COMPLETED':
      case 'DELIVERED':
        return 'ĐÃ GIAO';
      case 'CANCELLED':
      case 'DECLINED':
        return 'ĐÃ HỦY';
      default:
        return 'CHỜ XÁC NHẬN';
    }
  };

  //  GỌI API KHI TRANG ĐƯỢC TẢI LÊN + polling để mô phỏng realtime
  useEffect(() => {
    let isMounted = true;

    const mapBEToFE = (beOrders: any[]): Order[] =>
      beOrders.map((beOrder: any) => {
        // Lấy thời gian thô từ BE trả về
        const rawDate = beOrder.createdAt || beOrder.createdDate;

        return {
          id: beOrder.id.toString(),
          orderNumber: `ORD${beOrder.id}`,
          sellerName: beOrder.seller?.login || 'Người bán',
          sellerId: beOrder.seller?.id?.toString(),
          sellerUniversity: 'Đại học FPT',
          status: mapBEStatusToFEStatus(beOrder.status),
          statusText: getStatusText(beOrder.status),

          // 🔥 SỬA: Đổi toLocaleDateString() sang toLocaleString() để hiển thị cả Giờ:Phút:Giây
          orderDate: rawDate ? new Date(rawDate).toLocaleString('vi-VN') : 'Vừa xong',

          // 🔥 SỬA: Đóng gói timestamp phục vụ hàm sort dữ liệu
          orderDateRaw: rawDate ? new Date(rawDate).getTime() : 0,

          total: beOrder.totalAmount,
          items: (beOrder.items || []).map((beItem: any) => ({
            id: beItem.id.toString(),
            productImage: beItem.productMainImage,
            productTitle: beItem.product?.name || 'Sản phẩm',
            variation: beItem.product?.condition || '',
            quantity: beItem.quantity,
            unitPrice: beItem.price,
          })),
        };
      });

    // const handleContactSeller = async (sellerId?: string) => {
    //   if (!sellerId) {
    //     return; // Or show error toast if you import it
    //   }
    //   try {
    //     const response = await axios.post(`/api/chat-rooms/initiate?sellerId=${sellerId}`);
    //     if (response.status === 200 || response.status === 201) {
    //       const roomId = response.data.id;
    //       // window.location.href = `/messages?selectedRoomId=${roomId}`;
    //     }
    //   } catch (err) {
    //     console.error('Error initiating chat room:', err);
    //   }
    // };
    // // Wait, I should not define handleContactSeller inside useEffect. I will put it outside.

    const fetchAndUpdate = async (initial = false) => {
      try {
        if (initial) setLoading(true);
        const response = await axios.get('/api/orders/current-user');
        const formattedOrders: Order[] = mapBEToFE(response.data || []);

        if (!isMounted) return;

        setOrders(prev => {
          // detect status change for any order
          const prevMap = new Map(prev.map(o => [o.id, o]));
          for (const o of formattedOrders) {
            const p = prevMap.get(o.id);
            if (p && p.status !== o.status) {
              setRecentlyUpdatedOrderId(o.id);
              // clear highlight shortly after
              setTimeout(() => setRecentlyUpdatedOrderId(null), 3000);
              break;
            }
          }
          prevOrdersRef.current = formattedOrders;
          return formattedOrders;
        });
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
      } finally {
        if (initial) setLoading(false);
      }
    };

    // initial fetch
    fetchAndUpdate(true);

    const intervalId = setInterval(() => fetchAndUpdate(false), 3000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Đang tải danh sách đơn mua của bạn...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-[#FF6B35]" />
            <h1 className="text-3xl font-bold text-[#0A2647]">Đơn mua của tôi</h1>
          </div>
          <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-20 z-10">
          {/* Tabs */}
          {/* Real-time updates handled via polling; timeline removed */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'border-[#FF6B35] text-[#FF6B35] font-bold'
                      : 'border-transparent text-gray-600 hover:text-[#0A2647] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{tab.label}</span>
                    {getOrderCount(tab.id) > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                          activeTab === tab.id ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }`}
                      >
                        {getOrderCount(tab.id)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar and Sort */}
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors text-sm font-medium"
                >
                  <SortAsc className="w-5 h-5" />
                  Sắp xếp
                </button>

                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      {[
                        { value: 'date-desc' as SortOption, label: 'Ngày đặt: Mới nhất' },
                        { value: 'date-asc' as SortOption, label: 'Ngày đặt: Cũ nhất' },
                        { value: 'price-desc' as SortOption, label: 'Giá: Cao đến thấp' },
                        { value: 'price-asc' as SortOption, label: 'Giá: Thấp đến cao' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            sortBy === option.value ? 'text-[#FF6B35] font-medium bg-orange-50' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bạn chưa có đơn hàng nào trong mục này'}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            /* Order Cards */
            filteredOrders.map(order => (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#FF6B35]/30 transition-all duration-300 group ${
                  recentlyUpdatedOrderId === order.id ? 'ring-2 ring-yellow-300 animate-pulse' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                      {order.sellerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0A2647]">{order.sellerName}</span>
                        <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                      </div>
                      <span className="text-xs text-gray-500">{order.sellerUniversity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm mb-1 ${getStatusColor(order.status)}`}>{order.statusText}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Mã: {order.orderNumber}</span>
                      <button
                        onClick={() => copyOrderNumber(order.orderNumber)}
                        className="hover:text-[#FF6B35] transition-colors"
                        title="Sao chép mã đơn"
                      >
                        {copiedOrderId === order.orderNumber ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body - Product Items */}
                <div className="px-6 py-5">
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-[#FF6B35]/50 transition-all">
                          <ImageWithFallback src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#0A2647] transition-colors">
                              {item.productTitle}
                            </h3>
                            {item.variation && <p className="text-sm text-gray-500 mb-1">Phân loại: {item.variation}</p>}
                            <p className="text-sm text-gray-600">x{item.quantity}</p>
                          </div>

                          {/* Unit Price */}
                          <div className="text-right flex-shrink-0">
                            <span className="text-lg font-bold text-[#0A2647]">{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Ngày đặt: {order.orderDate}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Thành tiền:</span>
                      <span className="text-2xl font-bold text-[#FF6B35]">{order.total.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      {order.status === 'completed' && (
                        <>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] rounded-lg font-medium text-sm transition-all flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Mua lại
                          </button>
                          <button
                            onClick={() => setSelectedOrderForRating(order)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-600 rounded-lg font-medium text-sm transition-all flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Đánh giá
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleContactSeller(order.sellerId)}
                        className="px-5 py-2.5 border-2 border-[#0A2647] text-[#0A2647] hover:bg-[#0A2647] hover:text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ
                      </button>
                      <Link
                        to={`/order/${order.id}`}
                        className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedOrderForRating && <RatingModal order={selectedOrderForRating} onClose={() => setSelectedOrderForRating(null)} />}
    </div>
  );
}
