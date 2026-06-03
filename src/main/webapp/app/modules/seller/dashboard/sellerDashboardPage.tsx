import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Bell, BadgeCheck, Loader2, Play, Pause, Repeat } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { IProduct } from 'app/shared/model/product.model';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { getConditionLabel } from '../../../shared/util/condition-util';

// interface PurchaseRequest {
//   id: string;
//   buyerName: string;
//   buyerEmail: string;
//   university: string;
//   requestDate: string;
// }

// const mockRequests: Record<string, PurchaseRequest[]> = {
//   '1': [
//     {
//       id: 'req1',
//       buyerName: 'Trần Thị Mai',
//       buyerEmail: 'mai.tran@student.hust.edu.vn',
//       university: 'ĐH Bách Khoa Hà Nội',
//       requestDate: '19/03/2026 14:30',
//     },
//     {
//       id: 'req2',
//       buyerName: 'Lê Hoàng Nam',
//       buyerEmail: 'nam.le@student.hust.edu.vn',
//       university: 'ĐH Bách Khoa Hà Nội',
//       requestDate: '19/03/2026 10:15',
//     },
//     {
//       id: 'req3',
//       buyerName: 'Phạm Minh Quân',
//       buyerEmail: 'quan.pham@student.neu.edu.vn',
//       university: 'ĐH Kinh tế Quốc dân',
//       requestDate: '18/03/2026 16:45',
//     },
//   ],
//   '2': [
//     {
//       id: 'req4',
//       buyerName: 'Nguyễn Thu Hà',
//       buyerEmail: 'ha.nguyen@student.vnu.edu.vn',
//       university: 'ĐH Quốc gia Hà Nội',
//       requestDate: '19/03/2026 09:20',
//     },
//     {
//       id: 'req5',
//       buyerName: 'Đỗ Văn Hưng',
//       buyerEmail: 'hung.do@student.hust.edu.vn',
//       university: 'ĐH Bách Khoa Hà Nội',
//       requestDate: '18/03/2026 20:10',
//     },
//   ],
//   '3': [
//     {
//       id: 'req6',
//       buyerName: 'Vũ Thị Lan',
//       buyerEmail: 'lan.vu@student.ueh.edu.vn',
//       university: 'ĐH Kinh tế TP.HCM',
//       requestDate: '19/03/2026 15:00',
//     },
//     {
//       id: 'req7',
//       buyerName: 'Hoàng Minh Tuấn',
//       buyerEmail: 'tuan.hoang@student.neu.edu.vn',
//       university: 'ĐH Kinh tế Quốc dân',
//       requestDate: '19/03/2026 11:30',
//     },
//     {
//       id: 'req8',
//       buyerName: 'Bùi Thị Hương',
//       buyerEmail: 'huong.bui@student.hust.edu.vn',
//       university: 'ĐH Bách Khoa Hà Nội',
//       requestDate: '19/03/2026 08:45',
//     },
//   ],
// };

export function SellerDashboardPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // const [selectedListing, setSelectedListing] = useState<number | null>(null);
  // const [showModal, setShowModal] = useState(false);
  // const [currentRequests, setCurrentRequests] = useState<PurchaseRequest[]>([]);
  // const [modalLoading, setModalLoading] = useState<boolean>(false);

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

      // 2. Fetch all images and order items in parallel single-batch requests (eliminating parallel loops)
      const [imagesRes, itemsRes] = await Promise.all([axios.get<any[]>('/api/product-images'), axios.get<any[]>('/api/order-items')]);

      const allImages = imagesRes.data || [];
      const allOrderItems = itemsRes.data || [];

      // 3. Perform dynamic mapping in memory on the frontend
      const mappedListings = products.map((prod: any) => {
        const productImages =
          prod.productImages && prod.productImages.length > 0 ? prod.productImages : allImages.filter(img => img.product?.id === prod.id);
        const primaryImage = productImages.find((img: any) => img.isPrimary) || productImages[0];

        const productOrderItems = allOrderItems.filter(item => item.product?.id === prod.id);
        // Exclude cancelled or completed order items
        const pendingCount = productOrderItems.filter(
          item => item.order?.status !== 'CANCELLED' && item.order?.status !== 'COMPLETED',
        ).length;

        let imageUrl = primaryImage ? primaryImage.imageUrl : null;
        if (imageUrl && imageUrl.startsWith('uploads/')) {
          imageUrl = '/' + imageUrl;
        }

        return {
          ...prod,
          imageUrl,
          pendingRequests: pendingCount,
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

  const handleViewRequests = (listingId: string | number | undefined) => {
    if (!listingId) return;
    navigate(`/seller/products/${String(listingId)}/orders`);
  };

  const handleViewTradeRequests = (listingId: string | number | undefined) => {
    navigate(`/seller/products/${String(listingId)}/trades`);
  };
  // Lazy load purchase requests for modal upon click (protecting mount performance)
  // const handleViewRequests = async (productId: number) => {
  //   setSelectedListing(productId);
  //   setShowModal(true);
  //   setModalLoading(true);
  // setCurrentRequests([]);

  //   try {
  //     const res = await axios.get<any[]>(`/api/order-items?productId.equals=${productId}`);
  //     const orderItems = res.data || [];

  //     const mappedRequests = orderItems.map((item: any) => ({
  //       id: item.order?.id?.toString() || item.id?.toString(),
  //       buyerName: item.order?.buyer?.login || 'Người mua ẩn danh',
  //       buyerEmail: item.order?.buyer?.email || 'no-email@unipass.edu.vn',
  //       university: item.order?.buyer?.university?.name || 'Đại học FPT Hà Nội',
  //       requestDate: item.order?.createdAt ? new Date(item.order.createdAt).toLocaleString('vi-VN') : '19/03/2026 14:30',
  //     }));

  // setCurrentRequests(mappedRequests);
  //   } catch (err) {
  //     console.error('Failed to lazy load buy requests for product:', err);
  //   } finally {
  //     setModalLoading(false);
  //   }
  // };

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

  // Status alteration API: Accept request
  // const handleAccept = async () => {
  //   if (!selectedListing) return;
  //   try {
  //     await axios.patch(`/api/products/${selectedListing}/status?status=PENDING_DEAL`);
  //     // Update local state directly so color shift reflects instantly
  //     setListings(prev => prev.map(p => (p.id === selectedListing ? { ...p, status: 'PENDING_DEAL' } : p)));
  //     setShowModal(false);
  //     alert('Yêu cầu mua hàng đã được chấp nhận!');
  //   } catch (err: any) {
  //     console.error('Failed to accept purchase request:', err);
  //     alert('Lỗi khi chấp nhận yêu cầu: ' + (err.response?.data?.title || err.message));
  //   }
  // };

  // // Status alteration API: Decline request
  // const handleDecline = async () => {
  //   if (!selectedListing) return;
  //   try {
  //     await axios.patch(`/api/products/${selectedListing}/status?status=AVAILABLE`);
  //     // Update local state directly so color shift reflects instantly
  //     setListings(prev => prev.map(p => (p.id === selectedListing ? { ...p, status: 'AVAILABLE' } : p)));
  //     setShowModal(false);
  //     alert('Yêu cầu mua hàng đã bị từ chối.');
  //   } catch (err: any) {
  //     console.error('Failed to decline purchase request:', err);
  //     alert('Lỗi khi từ chối yêu cầu: ' + (err.response?.data?.title || err.message));
  //   }
  // };

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
                            {listing.pendingRequests > 0 && (
                              <button
                                onClick={() => handleViewRequests(listing.id)}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all"
                              >
                                <Bell className="w-3 h-3 animate-pulse" />
                                {listing.pendingRequests} người đang chờ mua
                              </button>
                            )}
                            {listing.pendingTradeRequests > 0 && (
                              <button
                                onClick={() => handleViewTradeRequests(listing.id)}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all"
                              >
                                <Repeat className="w-3 h-3 animate-pulse" />
                                {listing.pendingTradeRequests} đề xuất đổi
                              </button>
                            )}
                          </div>
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
    </div>
  );
}
