import React, { useState } from 'react';
import { Edit, Trash2, Plus, Bell, X, BadgeCheck, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';

interface PurchaseRequest {
  id: string;
  buyerName: string;
  buyerEmail: string;
  university: string;
  requestDate: string;
}

interface Listing {
  id: string;
  image: string;
  title: string;
  price: number;
  pendingRequests: number;
  status: 'active' | 'pending' | 'sold';
  views: number;
}

const mockListings: Listing[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    price: 12500000,
    pendingRequests: 3,
    status: 'active',
    views: 127,
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzczODkwMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Tai nghe Sony WH-1000XM4 - Chống ồn',
    price: 4500000,
    pendingRequests: 2,
    status: 'active',
    views: 89,
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBpcGFkfGVufDF8fHx8MTc3MzgzMDk2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'iPad Air M1 64GB - Màu hồng',
    price: 11200000,
    pendingRequests: 5,
    status: 'active',
    views: 203,
  },
];

const mockRequests: Record<string, PurchaseRequest[]> = {
  '1': [
    {
      id: 'req1',
      buyerName: 'Trần Thị Mai',
      buyerEmail: 'mai.tran@student.hust.edu.vn',
      university: 'ĐH Bách Khoa Hà Nội',
      requestDate: '19/03/2026 14:30',
    },
    {
      id: 'req2',
      buyerName: 'Lê Hoàng Nam',
      buyerEmail: 'nam.le@student.hust.edu.vn',
      university: 'ĐH Bách Khoa Hà Nội',
      requestDate: '19/03/2026 10:15',
    },
    {
      id: 'req3',
      buyerName: 'Phạm Minh Quân',
      buyerEmail: 'quan.pham@student.neu.edu.vn',
      university: 'ĐH Kinh tế Quốc dân',
      requestDate: '18/03/2026 16:45',
    },
  ],
  '2': [
    {
      id: 'req4',
      buyerName: 'Nguyễn Thu Hà',
      buyerEmail: 'ha.nguyen@student.vnu.edu.vn',
      university: 'ĐH Quốc gia Hà Nội',
      requestDate: '19/03/2026 09:20',
    },
    {
      id: 'req5',
      buyerName: 'Đỗ Văn Hưng',
      buyerEmail: 'hung.do@student.hust.edu.vn',
      university: 'ĐH Bách Khoa Hà Nội',
      requestDate: '18/03/2026 20:10',
    },
  ],
  '3': [
    {
      id: 'req6',
      buyerName: 'Vũ Thị Lan',
      buyerEmail: 'lan.vu@student.ueh.edu.vn',
      university: 'ĐH Kinh tế TP.HCM',
      requestDate: '19/03/2026 15:00',
    },
    {
      id: 'req7',
      buyerName: 'Hoàng Minh Tuấn',
      buyerEmail: 'tuan.hoang@student.neu.edu.vn',
      university: 'ĐH Kinh tế Quốc dân',
      requestDate: '19/03/2026 11:30',
    },
    {
      id: 'req8',
      buyerName: 'Bùi Thị Hương',
      buyerEmail: 'huong.bui@student.hust.edu.vn',
      university: 'ĐH Bách Khoa Hà Nội',
      requestDate: '19/03/2026 08:45',
    },
  ],
};

export function SellerDashboardPage() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewRequests = (listingId: string) => {
    setSelectedListing(listingId);
    setShowModal(true);
  };

  const handleAccept = (requestId: string) => {
    console.warn('Accepted request:', requestId);
    // Handle accept logic
  };

  const handleDecline = (requestId: string) => {
    console.warn('Declined request:', requestId);
    // Handle decline logic
  };

  const currentRequests = selectedListing ? mockRequests[selectedListing] || [] : [];

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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0A2647]">10</p>
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
                  <p className="text-2xl font-bold text-[#0A2647]">3</p>
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
                  <p className="text-2xl font-bold text-[#0A2647]">28.2M</p>
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
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Lượt xem</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-900 text-sm">Trạng thái</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900 text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                    {/* Product Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{listing.title}</h3>
                          {listing.pendingRequests > 0 && (
                            <button
                              onClick={() => handleViewRequests(listing.id)}
                              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-medium hover:shadow-md transition-all"
                            >
                              <Bell className="w-3 h-3 animate-pulse" />
                              {listing.pendingRequests} người đang chờ mua
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#0A2647] text-lg">{listing.price.toLocaleString('vi-VN')}đ</span>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{listing.views}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đang hoạt động
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-4 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <p className="text-white/80 text-sm">{currentRequests.length} người muốn mua sản phẩm này</p>
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

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-bold text-sm transition-all shadow-lg whitespace-nowrap"
                        >
                          Chấp nhận
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
