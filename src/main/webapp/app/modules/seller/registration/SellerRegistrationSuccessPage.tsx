import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import { SellerRegistrationModal } from './SellerRegistrationModal';
import { useAppDispatch } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { useAuth } from 'app/contexts/AuthContext';

export function SellerRegistrationSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'UNKNOWN'>('PENDING');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async (showToast = false) => {
    setIsChecking(true);
    try {
      const res = await axios.get<any>('/api/seller-requests/my-status');

      // Robust response parsing handling both string or full entity JSON
      let fetchedStatus = 'PENDING';
      let fetchedReason = null;

      if (res.data) {
        if (typeof res.data === 'string') {
          fetchedStatus = res.data;
        } else if (res.data.status) {
          fetchedStatus = res.data.status;
          fetchedReason = res.data.rejectionReason || null;
        } else if (res.data.myStatus) {
          // fallback
          fetchedStatus = res.data.myStatus;
        }
      }

      const upperStatus = fetchedStatus.toUpperCase();
      setStatus(upperStatus as any);
      setRejectionReason(fetchedReason);

      if (upperStatus === 'REJECTED') {
        toast.error('Hồ sơ nâng cấp tài khoản của bạn đã bị từ chối.');
      } else if (upperStatus !== 'APPROVED') {
        if (showToast) {
          toast.info('Hồ sơ của bạn vẫn đang được kiểm duyệt.');
        }
      }
    } catch (err) {
      console.error('Lỗi kiểm tra trạng thái phê duyệt:', err);
      if (showToast) {
        toast.error('Không thể kiểm tra trạng thái. Vui lòng thử lại sau.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Poll status every 30 seconds
  useEffect(() => {
    // Check once immediately on load
    checkStatus(false);

    const intervalId = setInterval(() => {
      checkStatus(false);
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleApprovedTransition = async () => {
      if (status === 'APPROVED') {
        toast.success('Chúc mừng! Yêu cầu làm Người bán của bạn đã được phê duyệt.');
        setIsLoading(true);

        // Force refresh the account state to load the new ROLE_SELLER authority
        if (dispatch) {
          await (dispatch(getSession()) as any);
        } else if ((auth as any)?.refreshAccount) {
          await (auth as any).refreshAccount();
        }

        // Only navigate AFTER the local store is fully aware of the new role
        navigate('/seller-dashboard');
      }
    };

    handleApprovedTransition();
  }, [status, dispatch, auth, navigate]);

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 flex items-center justify-center px-4">
      {isLoading && <span className="sr-only">Loading...</span>}
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
        {/* Banner header theme */}
        <div className="bg-[#0A2647] p-8 text-center text-white relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors py-1 px-3 rounded-lg bg-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
            </button>
          </div>

          <div className="w-16 h-16 bg-[#FF6B35]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF6B35]/40 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <h1 className="text-2xl font-bold">Nâng Cấp Người Bán</h1>
          <p className="text-white/70 text-xs mt-1">Hệ thống xét duyệt thành viên uy tín UniPass Hoa Lạc</p>
        </div>

        {/* Dynamic Status Content */}
        <div className="p-8 space-y-6">
          {status === 'PENDING' && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center animate-pulse border border-amber-200">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Đang Chờ Phê Duyệt
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0A2647]">Hồ sơ đang được kiểm duyệt</h3>
                <p className="text-sm text-gray-600 leading-relaxed px-4">
                  Cảm ơn bạn đã gửi yêu cầu nâng cấp! Đội ngũ quản trị viên UniPass đang tiến hành đối chiếu ảnh thẻ sinh viên/CCCD và thông
                  tin liên hệ của bạn để kích hoạt quyền Người bán.
                </p>
                <p className="text-xs text-gray-400 italic">
                  Hệ thống tự động kiểm tra mỗi 30 giây. Quá trình kiểm duyệt thường hoàn thành trong vài phút.
                </p>
              </div>

              {/* Progress Stepper Visual */}
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 flex items-center justify-between text-xs max-w-sm mx-auto text-left">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-gray-500">Gửi hồ sơ</span>
                </div>
                <div className="h-[2px] bg-green-300 flex-1 mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
                    2
                  </div>
                  <span className="text-gray-900 font-semibold">Đang duyệt</span>
                </div>
                <div className="h-[2px] bg-gray-200 flex-1 mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-[10px] border border-gray-300">
                    3
                  </div>
                  <span className="text-gray-400">Hoàn tất</span>
                </div>
              </div>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className="space-y-4 text-center animate-fadeIn">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center border border-green-200 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  Đã Phê Duyệt
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0A2647]">Tài khoản đã kích hoạt!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Chúc mừng! Yêu cầu đăng ký Người bán của bạn đã được kiểm duyệt thông qua. Bạn hiện đã sở hữu toàn bộ các đặc quyền của
                  Người bán trên UniPass.
                </p>
                <div className="pt-2 text-xs text-green-600 font-medium animate-pulse">Đang chuyển hướng bạn tới Kênh Người bán...</div>
              </div>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center border border-red-200 shadow-sm">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  Từ Chối Phê Duyệt
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0A2647]">Yêu cầu không được phê duyệt</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Rất tiếc, hồ sơ nâng cấp tài khoản của bạn đã bị từ chối do không đáp ứng đủ các tiêu chuẩn xác thực danh tính.
                </p>
              </div>

              {/* Rejection reason box */}
              {rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-red-800 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" /> Lý do từ chối:
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-red-100 font-medium">
                    {rejectionReason}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors border border-gray-200"
                >
                  Quay về trang chủ
                </button>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#FF5722] text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
                >
                  Gửi lại yêu cầu đăng ký
                </button>
              </div>
            </div>
          )}

          {/* Persistent controls for polling feedback */}
          {status === 'PENDING' && (
            <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Quay lại trang chủ
              </button>
              <button
                onClick={() => checkStatus(true)}
                disabled={isChecking}
                className="px-5 py-2 bg-[#0A2647] hover:bg-[#144272] text-white disabled:bg-gray-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang cập nhật...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Kiểm tra ngay
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Security verification notice in footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
          <Mail className="w-3.5 h-3.5" /> Liên hệ hỗ trợ kỹ thuật: support@unipass.edu.vn
        </div>
      </div>

      {/* Reg Modal for re-submission in case of rejection */}
      {showRegModal && (
        <SellerRegistrationModal
          isOpen={showRegModal}
          onClose={() => {
            setShowRegModal(false);
            // Refresh state
            checkStatus(false);
          }}
        />
      )}
    </div>
  );
}
