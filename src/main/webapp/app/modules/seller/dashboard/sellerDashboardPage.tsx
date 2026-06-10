import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Bell, BadgeCheck, Loader2, Play, Pause, Repeat, Mail, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { IProduct } from 'app/shared/model/product.model';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { getConditionLabel } from '../../../shared/util/condition-util';

interface PurchaseRequest {
  id: string;
  buyerName: string;
  buyerEmail: string;
  university: string;
  requestDate: string;
}

export function SellerDashboardPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRequests, setCurrentRequests] = useState<PurchaseRequest[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Optimized Fetch Lifecycle to completely eliminate N+1 requests
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all listings of the seller (single call)
      const listingsRes = await axios.get<IProduct[]>('/api/products/my-products', {
        params: {
          page: 0,
          size: 20,
        },
      });
      const products = listingsRes.data || [];

      const accountRes = await axios.get('/api/account');
      const userId = accountRes.data.id;

      // 2. Fetch all images, order items, and trade requests in parallel
      const [imagesRes, itemsRes, tradeRes] = await Promise.all([
        axios.get<any[]>('/api/product-images'),
        axios.get<any[]>('/api/order-items'),
        axios.get<any[]>(`/api/trade-requests?sellerId.equals=${userId}`),
      ]);

      const allImages = imagesRes.data || [];
      const allOrderItems = itemsRes.data || [];
      const allTradeRequests = tradeRes.data || [];

      // 3. Perform dynamic mapping in memory on the frontend
      const mappedListings = products.map((prod: any) => {
        const productImages =
          prod.productImages && prod.productImages.length > 0 ? prod.productImages : allImages.filter(img => img.product?.id === prod.id);
        const primaryImage = productImages.find((img: any) => img.isPrimary) || productImages[0];

        const productOrderItems = allOrderItems.filter(item => item.product?.id === prod.id);

        // Count ONLY pending purchase requests
        const pendingCount = productOrderItems.filter(item => String(item.order?.status || '').toUpperCase() === 'PENDING_CONFIRM').length;

        // Count ONLY pending trade requests
        const pendingTradeRequests = allTradeRequests.filter(
          tr => Number(tr.targetProduct?.id) === prod.id && String(tr.status || '').toUpperCase() === 'PENDING',
        ).length;

        let imageUrl = primaryImage ? primaryImage.imageUrl : null;
        if (imageUrl && imageUrl.startsWith('uploads/')) {
          imageUrl = '/' + imageUrl;
        }

        return {
          ...prod,
          imageUrl,
          pendingRequests: pendingCount,
          pendingTradeRequests,
        };
      });

      setListings(mappedListings);
    } catch (err) {
      console.error('Failed to load seller dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const handleViewRequests = (listingId: string | number | undefined) => {
  //   if (!listingId) return;
  //   // navigate(`/seller/products/${String(listingId)}/orders`);
  // };

  const handleViewTradeRequests = (listingId: string | number | undefined) => {
    navigate(`/seller/products/${String(listingId)}/trades`);
  };
  // Lazy load purchase requests for modal upon click (protecting mount performance)
  const handleViewRequests = async (productId: number) => {
    if (!selectedListing) {
      console.warn('ko co j');
    }

    setSelectedListing(productId);
    setShowModal(true);
    setModalLoading(true);
    setCurrentRequests([]);

    try {
      const res = await axios.get<any[]>(`/api/order-items?productId.equals=${productId}`);
      const orderItems = res.data || [];

      // Only show requests that are still pending
      const pendingItems = (orderItems || []).filter((item: any) => {
        const status = String(item.order?.status || '').toUpperCase();
        return status === 'PENDING_CONFIRM';
      });

      const mappedRequests = pendingItems.map((item: any) => ({
        id: item.order?.id?.toString() || item.id?.toString(),
        buyerName: item.order?.buyer?.login || 'Người mua ẩn danh',
        buyerEmail: item.order?.buyer?.email || 'no-email@unipass.edu.vn',
        university: item.order?.buyer?.university?.name || 'Đại học FPT Hà Nội',
        requestDate: item.order?.createdAt ? new Date(item.order.createdAt).toLocaleString('vi-VN') : '19/03/2026 14:30',
      }));

      setCurrentRequests(mappedRequests);
    } catch (err) {
      console.error('Failed to lazy load buy requests for product:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Secure Product Deletion (Trash2)
  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (!confirmed) return;

    try {
      await axios.delete(`/api/products/${productId}`);
      // Success feedback: Instantly filter deleted item out of local state array
      setListings(prev => prev.filter(p => p.id !== productId));
      alert('Sản phẩm đã được xóa thành công!');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      alert('Lỗi khi xóa sản phẩm: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Status alteration API: Toggle Active/Inactive
  const handleToggleStatus = async (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'INACTIVE' ? 'AVAILABLE' : 'INACTIVE';
    try {
      await axios.patch(`/api/products/${productId}`, { id: productId, status: newStatus });
      setListings(prev => prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p)));
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      alert('Lỗi khi đổi trạng thái: ' + (err.response?.data?.title || err.message));
    }
  };

  // Dynamic Header Stats Calculation
  const totalPendingRequests = listings.reduce((sum, item: any) => sum + (item.pendingRequests || 0), 0);
  const activeListingsCount = listings.filter(item => item.status === 'AVAILABLE').length;
  const totalInventoryValue = listings
    .filter(item => item.status === 'AVAILABLE')
    .reduce((sum, item) => sum + (item.price || 0) * (item.stock !== undefined ? item.stock : 1), 0);

  const formatInventoryValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    return val.toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Quản lý tin đăng</h1>
              <p className="text-gray-600">Xem và quản lý các sản phẩm đang bán của bạn</p>
            </div>
            <Link
              to="/create-listing"
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-medium transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Đăng tin mới
            </Link>
          </div>

          {/* Dynamic Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A2647]">{loading ? '...' : totalPendingRequests}</p>
                  <p className="text-sm text-gray-600">Yêu cầu chờ xử lý</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A2647]">{loading ? '...' : activeListingsCount}</p>
                  <p className="text-sm text-gray-600">Tin đang hoạt động</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600">đ</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A2647]">{loading ? '...' : formatInventoryValue(totalInventoryValue)}</p>
                  <p className="text-sm text-gray-600">Giá trị hàng đang bán</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Sản phẩm</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Giá</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Kho hàng (Stock)</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Lượt xem</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Trạng thái</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900 text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
                        Đang tải danh sách tin đăng...
                      </div>
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      Bạn chưa có tin đăng nào. Hãy đăng tin mới!
                    </td>
                  </tr>
                ) : (
                  listings.map(listing => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <ImageWithFallback src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{listing.name}</h3>
                            {listing.condition && (
                              <p className="text-xs text-gray-500 mb-1">Tình trạng: {getConditionLabel(listing.condition)}</p>
                            )}
                            {listing.pendingRequests > 0 ? (
                              <button
                                onClick={() => handleViewRequests(listing.id)}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all"
                              >
                                <Bell className="w-3 h-3 animate-pulse" />
                                {listing.pendingRequests} người đang chờ mua
                              </button>
                            ) : (
                              <button
                                onClick={() => handleViewRequests(listing.id)}
                                className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors"
                              >
                                <Repeat className="w-3 h-3 animate-pulse" />
                                Chưa có ai yêu cầu
                              </button>
                            )}
                          </div>
                          {listing.pendingTradeRequests > 0 ? (
                            <button
                              onClick={() => handleViewTradeRequests(listing.id)}
                              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all"
                            >
                              <Repeat className="w-3 h-3 animate-pulse" />
                              {listing.pendingTradeRequests} đề xuất đổi
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewTradeRequests(listing.id)}
                              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors"
                            >
                              <Repeat className="w-3 h-3 animate-pulse" />
                              Chưa có ai đề xuất đổi
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#0A2647] text-lg">{(listing.price || 0).toLocaleString('vi-VN')}đ</span>
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-6">
                        {listing.stock !== undefined ? (
                          listing.stock === 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                              Hết hàng (0)
                            </span>
                          ) : (
                            <span className="text-gray-900 font-medium">{listing.stock}</span>
                          )
                        ) : (
                          <span className="text-gray-500">1</span>
                        )}
                      </td>

                      {/* Views (Defaulting to 0 since not present in basic product schema) */}
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{listing.views || 0}</span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-6">
                        {listing.status === 'PENDING_DEAL' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Chờ giao dịch
                          </span>
                        ) : listing.status === 'SOLD' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Đã bán
                          </span>
                        ) : listing.status === 'INACTIVE' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Không hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đang hoạt động
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(listing.id, listing.status || 'AVAILABLE')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                              listing.status === 'INACTIVE'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            {listing.status === 'INACTIVE' ? (
                              <>
                                <Play className="w-4 h-4" />
                                Kích hoạt
                              </>
                            ) : (
                              <>
                                <Pause className="w-4 h-4" />
                                Tạm ngưng
                              </>
                            )}
                          </button>

                          {listing.status === 'INACTIVE' && (
                            <>
                              <button
                                onClick={() => navigate(`/listings/edit/${listing.id}`)}
                                className="px-4 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDelete(listing.id)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchase Requests Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Danh sách yêu cầu mua</h2>
                <p className="text-white/80 text-sm">
                  {modalLoading ? 'Đang tải...' : `${currentRequests.length} người muốn mua sản phẩm này`}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {modalLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
                  <p className="text-gray-500 font-medium text-sm">Đang tải danh sách yêu cầu mua...</p>
                </div>
              ) : currentRequests.length === 0 ? (
                <div className="py-12 text-center text-gray-500 font-medium">Chưa có yêu cầu mua nào cho sản phẩm này.</div>
              ) : (
                <div className="space-y-4">
                  {currentRequests.map(request => (
                    <div
                      key={request.id}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border-2 border-gray-200 hover:border-[#FF6B35] transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Buyer Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {request.buyerName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">{request.buyerName}</h3>
                              <BadgeCheck className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700 font-mono">{request.buyerEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{request.university}</span>
                              <span>• {request.requestDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Info Box */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Lưu ý:</strong> Sau khi chấp nhận yêu cầu, người mua sẽ nhận được thông báo và có thể tiến hành thanh toán. Bạn
                  chỉ nên chấp nhận một người mua cho mỗi sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
