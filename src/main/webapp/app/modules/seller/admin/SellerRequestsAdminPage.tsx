import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldAlert, Check, X, Loader2, Eye, Calendar, Phone, MapPin, FileText, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { ISellerRequest } from 'app/shared/model/seller-request.model';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

export function SellerRequestsAdminPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ISellerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Rejection Reason Modal State
  const [rejectingRequest, setRejectingRequest] = useState<ISellerRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectingSubmit, setIsRejectingSubmit] = useState(false);

  // Identity Card Image Zoom Modal State
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch requests for all statuses to have a complete global list for robust client-side filtering and badge counts
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axios.get<ISellerRequest[]>('/api/admin/seller-requests', { params: { status: 'PENDING' } }),
        axios.get<ISellerRequest[]>('/api/admin/seller-requests', { params: { status: 'APPROVED' } }),
        axios.get<ISellerRequest[]>('/api/admin/seller-requests', { params: { status: 'REJECTED' } }),
      ]);

      const allRequests = [...(pendingRes.data || []), ...(approvedRes.data || []), ...(rejectedRes.data || [])];

      setRequests(allRequests);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu cầu đăng ký:', err);
      toast.error('Tải danh sách yêu cầu nâng cấp Người bán thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn PHÊ DUYỆT tài khoản này làm Người bán không?')) return;

    try {
      await axios.post(`/api/admin/seller-requests/${id}/approve`);
      toast.success('Đã phê duyệt tài khoản thành Người bán thành công!');
      fetchRequests(); // Refresh table
    } catch (err: any) {
      console.error('Lỗi phê duyệt yêu cầu:', err);
      const msg = err.response?.data?.title || err.response?.data?.message || 'Phê duyệt yêu cầu thất bại.';
      toast.error(msg);
    }
  };

  const handleRejectClick = (req: ISellerRequest) => {
    setRejectingRequest(req);
    setRejectionReason('');
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest || !rejectingRequest.id) return;
    if (!rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối phê duyệt.');
      return;
    }

    setIsRejectingSubmit(true);
    try {
      await axios.post(`/api/admin/seller-requests/${rejectingRequest.id}/reject?reason=${encodeURIComponent(rejectionReason.trim())}`);
      toast.success('Đã từ chối phê duyệt yêu cầu thành công!');
      setRejectingRequest(null);
      fetchRequests(); // Refresh table
    } catch (err: any) {
      console.error('Lỗi từ chối yêu cầu:', err);
      const msg = err.response?.data?.title || err.response?.data?.message || 'Từ chối yêu cầu thất bại.';
      toast.error(msg);
    } finally {
      setIsRejectingSubmit(false);
    }
  };

  const pendingRequests = requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'PENDING');
  const approvedRequests = requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'APPROVED');
  const rejectedRequests = requests.filter(r => (r.status || 'PENDING').toUpperCase() === 'REJECTED');

  const filteredRequests = (() => {
    switch (activeTab) {
      case 'PENDING':
        return pendingRequests;
      case 'APPROVED':
        return approvedRequests;
      case 'REJECTED':
        return rejectedRequests;
      default:
        return [];
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-sm text-[#0A2647] font-semibold mb-1 cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại trang quản trị
            </div>
            <h1 className="text-2xl font-bold text-[#0A2647]">Duyệt Yêu Cầu Nâng Cấp Người Bán</h1>
            <p className="text-sm text-gray-500">Quản lý và xác thực thông tin tài khoản sinh viên nâng cấp quyền đăng bán sản phẩm.</p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={isLoading}
            className="self-start sm:self-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Làm mới danh sách
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl overflow-hidden shadow-sm border border-b-0 border-gray-200">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => {
            const count = (() => {
              switch (tab) {
                case 'PENDING':
                  return pendingRequests.length;
                case 'APPROVED':
                  return approvedRequests.length;
                case 'REJECTED':
                  return rejectedRequests.length;
                default:
                  return 0;
              }
            })();
            const label = (() => {
              switch (tab) {
                case 'PENDING':
                  return 'Chờ phê duyệt';
                case 'APPROVED':
                  return 'Đã phê duyệt';
                case 'REJECTED':
                  return 'Đã từ chối';
                default:
                  return '';
              }
            })();
            const colorClass = (() => {
              if (activeTab !== tab) return 'text-gray-500 hover:text-gray-900 hover:bg-gray-50';
              switch (tab) {
                case 'PENDING':
                  return 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/50 font-bold';
                case 'APPROVED':
                  return 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/20 font-bold';
                case 'REJECTED':
                  return 'text-red-600 border-b-2 border-red-600 bg-red-50/20 font-bold';
                default:
                  return '';
              }
            })();
            return (
              <button
                key={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all text-center flex items-center justify-center gap-2 ${colorClass}`}
              >
                {label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab
                      ? tab === 'PENDING'
                        ? 'bg-[#FF6B35] text-white'
                        : tab === 'APPROVED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      : 'bg-gray-150 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading && filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#FF6B35] gap-3">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="font-semibold text-sm">Đang tải danh sách hồ sơ...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <ShieldAlert className="w-12 h-12 text-gray-300" />
              <span className="font-bold text-sm">Không có hồ sơ nào ở danh mục này.</span>
              <p className="text-xs text-gray-400">Các hồ sơ đăng ký mới sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-[#0A2647] text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Thông tin tài khoản
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Khu vực phòng trọ
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Tiểu sử kinh doanh
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Ảnh xác minh
                    </th>
                    <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                      Ngày gửi
                    </th>
                    {activeTab === 'REJECTED' && (
                      <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        Lý do từ chối
                      </th>
                    )}
                    {activeTab === 'PENDING' && (
                      <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                        Thao tác
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {filteredRequests.map(req => {
                    const studentId = req.user?.login || 'Sinh viên';
                    const email = req.user?.email || 'N/A';
                    const submittedAtFormatted = req.submittedAt ? dayjs(req.submittedAt).format('HH:mm DD/MM/YYYY') : 'N/A';

                    return (
                      <tr key={`request-${req.id}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0A2647] font-bold text-xs">
                              {studentId.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{studentId}</div>
                              <div className="text-xs text-gray-500">{email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <span className="font-semibold">{req.phoneNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <span>{req.hostelLocation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-start gap-1.5 text-gray-600">
                            <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs line-clamp-2" title={req.bio || ''}>
                              {req.bio || 'Chưa cung cấp'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.idCardUrl ? (
                            <div className="relative group cursor-pointer w-20 h-12 rounded overflow-hidden border border-gray-300">
                              <img
                                src={req.idCardUrl}
                                alt="CCCD / Thẻ sinh viên"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onClick={() => setZoomedImageUrl(req.idCardUrl || '')}
                              />
                              <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                onClick={() => setZoomedImageUrl(req.idCardUrl || '')}
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Không có ảnh
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{submittedAtFormatted}</span>
                          </div>
                        </td>
                        {activeTab === 'REJECTED' && (
                          <td className="px-6 py-4 max-w-xs">
                            <div className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100 font-medium">
                              {req.rejectionReason || 'Không có lý do rõ ràng.'}
                            </div>
                          </td>
                        )}
                        {activeTab === 'PENDING' && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                            <button
                              type="button"
                              onClick={() => req.id && handleApprove(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              <Check className="w-3.5 h-3.5" /> Phê duyệt
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectClick(req)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              <X className="w-3.5 h-3.5" /> Từ chối
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* REJECTION REASON MODAL POPUP */}
      {rejectingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-red-600 text-white p-5 relative">
              <button
                onClick={() => setRejectingRequest(null)}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Từ Chối Đăng Ký Người Bán
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Tài khoản: {rejectingRequest.user?.login || 'N/A'} - Điện thoại: {rejectingRequest.phoneNumber}
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-lg p-3.5 text-xs text-red-800 leading-relaxed">
                Vui lòng cung cấp lý do từ chối rõ ràng và chi tiết. Lý do này sẽ được gửi trực tiếp đến người dùng và hiển thị trên màn
                hình trạng thái đăng ký của họ.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Lý do từ chối phê duyệt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Ví dụ: Ảnh căn cước bị mờ, không rõ thông tin cá nhân. Vui lòng chụp lại ảnh thẻ căn cước sinh động, sắc nét và thử lại."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  disabled={isRejectingSubmit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isRejectingSubmit}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow shadow-red-200 disabled:opacity-50"
                >
                  {isRejectingSubmit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang từ chối...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" /> Xác nhận từ chối
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM PREVIEW LIGHTBOX */}
      {zoomedImageUrl && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setZoomedImageUrl(null)}
        >
          <button
            onClick={() => setZoomedImageUrl(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] overflow-hidden rounded-lg bg-black border border-white/10 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <img src={zoomedImageUrl} alt="CCCD Zoomed In" className="max-w-full max-h-[85vh] object-contain mx-auto" />
            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-3 text-center text-white text-xs font-medium border-t border-white/5">
              Tải ảnh thẻ xác minh chất lượng cao của Sinh viên
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
