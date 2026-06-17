/* eslint-disable complexity */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import {
  User,
  Mail,
  Shield,
  Tag,
  History,
  Settings,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Store,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Eye,
  Calendar,
  AlertOctagon,
  X,
  Camera,
  Phone,
  Crown,
  TrendingUp,
  Star,
} from 'lucide-react';
import { usePremiumStatus } from 'app/shared/hooks/usePremiumStatus';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import { getSession } from 'app/shared/reducers/authentication';
import { toast } from 'react-toastify';
import { SellerRegistrationModal } from '../../seller/registration/SellerRegistrationModal';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const { user } = useAuth();

  const { studentIdNumber, username } = useParams<{ studentIdNumber?: string; username?: string }>();
  const activeStudentId = studentIdNumber || username;
  const isOwner = !activeStudentId;

  // Local state for logged-in user account details
  const [accountData, setAccountData] = useState<any>(null);

  // Local state for public profile details
  const [publicUserProfile, setPublicUserProfile] = useState<any>(null);

  // Local state
  const [userProfile, setUserProfile] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const [sellerRequest, setSellerRequest] = useState<any>(null);

  // Authorities mapping
  const authorities = account?.authorities || [];
  const isUserSeller = authorities.includes('ROLE_SELLER');
  const isAdmin = authorities.includes('ROLE_ADMIN');
  const isSeller = isUserSeller;

  const { isPremium, level, packageName, daysRemaining, endDate } = usePremiumStatus();

  // Edit Profile modal & upload states
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Edit Profile Form states
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('KTX Dom A');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic values
  const isOwnerSeller = isOwner ? isSeller : !!publicUserProfile?.phoneNumber;
  const isOwnerAdmin = isOwner ? isAdmin : false;

  const userPhone = isOwner
    ? userProfile?.phoneNumber || userProfile?.phone || sellerRequest?.phoneNumber || ''
    : publicUserProfile?.phoneNumber || '';

  const userInitials = isOwner
    ? accountData?.login
      ? accountData.login.substring(0, 2).toUpperCase()
      : account?.login
        ? account.login.substring(0, 2).toUpperCase()
        : 'US'
    : publicUserProfile?.studentName
      ? publicUserProfile.studentName.substring(0, 2).toUpperCase()
      : 'US';

  const studentName = isOwner
    ? accountData?.firstName && accountData?.lastName
      ? `${accountData.lastName} ${accountData.firstName}`
      : account?.firstName && account?.lastName
        ? `${account.lastName} ${account.firstName}`
        : accountData?.login || account?.login || user?.name || 'Thành viên'
    : publicUserProfile?.studentName || 'Thành viên';

  const fullName = studentName;

  const displayLogin = isOwner
    ? accountData?.login || account?.login || 'N/A'
    : publicUserProfile?.studentIdNumber || activeStudentId || 'N/A';

  const displayEmail = isOwner ? accountData?.email || account?.email || 'Chưa cập nhật email' : '';

  const campusName = userProfile?.campus?.name || 'KTX Hòa Lạc / Phòng trọ';

  const imageUrl = isOwner ? accountData?.imageUrl || account?.imageUrl : publicUserProfile?.imageUrl;

  // Tabs state
  const [activeTab, setActiveTab] = useState<'listings' | 'history'>('history');

  // Listings state
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await axios.get<any>('/api/seller-requests/my-status');
      if (res.data) {
        setSellerRequest(res.data);
        if (typeof res.data === 'string') {
          const statusStr = res.data.toUpperCase();
          if (statusStr === 'PENDING' || statusStr === 'APPROVED' || statusStr === 'REJECTED') {
            setRequestStatus(statusStr);
          }
        } else if (res.data.status) {
          const statusStr = res.data.status.toUpperCase();
          if (statusStr === 'PENDING' || statusStr === 'APPROVED' || statusStr === 'REJECTED') {
            setRequestStatus(statusStr);
          }
          setRejectionReason(res.data.rejectionReason || null);
        } else {
          setRequestStatus(null);
        }
      } else {
        setRequestStatus(null);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setRequestStatus(null);
      } else {
        console.error('Lỗi lấy trạng thái đăng ký người bán:', err);
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchMyProducts = async () => {
    if (!isOwnerSeller) return;
    setLoadingProducts(true);
    try {
      let productsData: any[] = [];
      if (isOwner) {
        const res = await axios.get<any[]>('/api/products/my-products', {
          params: {
            page: 0,
            size: 20,
          },
        });
        productsData = res.data || [];
      } else {
        const profileRes = await axios.get<any[]>('/api/user-profiles', {
          params: {
            'studentIdNumber.equals': activeStudentId,
          },
        });
        if (profileRes.data && profileRes.data.length > 0 && profileRes.data[0].user?.id) {
          const sellerId = profileRes.data[0].user.id;
          const res = await axios.get<any[]>('/api/products', {
            params: {
              'sellerId.equals': sellerId,
              page: 0,
              size: 20,
            },
          });
          productsData = res.data || [];
        }
      }

      // Fetch all images for parallel mapping in memory
      const imagesRes = await axios.get<any[]>('/api/product-images');
      const allImages = imagesRes.data || [];

      const mapped = productsData.map((prod: any) => {
        const productImages =
          prod.productImages && prod.productImages.length > 0 ? prod.productImages : allImages.filter(img => img.product?.id === prod.id);
        const primaryImage = productImages.find((img: any) => img.isPrimary) || productImages[0];
        let primaryImgUrl = primaryImage ? primaryImage.imageUrl : null;
        if (primaryImgUrl && primaryImgUrl.startsWith('uploads/')) {
          primaryImgUrl = '/' + primaryImgUrl;
        }
        return {
          ...prod,
          imageUrl: primaryImgUrl,
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error('Lỗi tải sản phẩm cá nhân/cửa hàng:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchAccountAndProfile = async () => {
    try {
      const accountRes = await axios.get<any>('/api/account');
      const currentAccount = accountRes.data;
      setAccountData(currentAccount);

      if (currentAccount?.id) {
        const profileRes = await axios.get<any[]>('/api/user-profiles', {
          params: {
            'userId.equals': currentAccount.id,
          },
        });
        if (profileRes.data && profileRes.data.length > 0) {
          setUserProfile(profileRes.data[0]);
        }
      }
    } catch (err) {
      console.error('Lỗi tải thông tin tài khoản hoặc hồ sơ:', err);
    }
  };

  const fetchPublicProfile = async () => {
    if (!activeStudentId) return;
    setLoadingStatus(true);
    try {
      const res = await axios.get<any>(`/api/user-profiles/public/${activeStudentId}`);
      setPublicUserProfile(res.data);
      setUserProfile(res.data);
    } catch (err) {
      console.error('Lỗi tải thông tin hồ sơ công khai:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingAvatar(true);
      const res = await axios.post<{ imageUrl: string }>('/api/account/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormAvatarUrl(res.data.imageUrl);
      toast.success('Tải ảnh đại diện lên thành công!');
    } catch (err) {
      console.error('Lỗi tải ảnh đại diện:', err);
      toast.error('Tải ảnh đại diện thất bại. Vui lòng thử lại!');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFullName.trim()) {
      toast.error('Họ và tên không được để trống.');
      return;
    }

    const phoneTrimmed = formPhone.trim();
    const finalPhone = phoneTrimmed || userPhone;
    if (finalPhone && !/^[0-9]{10}$/.test(finalPhone)) {
      toast.error('Số điện thoại phải gồm đúng 10 chữ số.');
      return;
    }

    setIsSaving(true);
    try {
      const nameParts = formFullName.trim().split(' ');
      let firstName = '';
      let lastName = '';
      if (nameParts.length > 1) {
        firstName = nameParts[nameParts.length - 1];
        lastName = nameParts.slice(0, nameParts.length - 1).join(' ');
      } else {
        firstName = formFullName.trim();
        lastName = '';
      }

      // Call POST /api/account using the AdminUserDTO structure containing firstName and lastName
      const baseAccount = accountData || account;
      const accountPayload = {
        ...baseAccount,
        firstName,
        lastName,
        imageUrl: formAvatarUrl,
      };
      await axios.post('/api/account', accountPayload);

      // Find or Create Campus based on chosen location name
      let campusObj = null;
      if (formLocation) {
        const campusesRes = await axios.get<any[]>('/api/campuses', {
          params: { 'name.equals': formLocation },
        });
        if (campusesRes.data && campusesRes.data.length > 0) {
          campusObj = campusesRes.data[0];
        } else {
          const createCampusRes = await axios.post('/api/campuses', {
            name: formLocation,
            address: formLocation,
          });
          campusObj = createCampusRes.data;
        }
      }

      // Update UserProfile via secure endpoint using the strict MyProfileUpdateDTO format
      await axios.post('/api/user-profiles/my-profile', {
        phone: finalPhone,
        campusId: campusObj ? campusObj.id : null,
      });

      toast.success('Cập nhật hồ sơ thành công!');
      setShowEditModal(false);

      // Sync Redux global store state immediately
      await (dispatch as any)(getSession());
      // Refresh local states
      await fetchAccountAndProfile();
    } catch (err: any) {
      console.error('Lỗi cập nhật hồ sơ:', err);
      const errMsg = err.response?.data?.title || err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Load status, account, and profile on mount / account change / activeStudentId change
  useEffect(() => {
    if (isOwner) {
      fetchStatus();
      fetchAccountAndProfile();
    } else {
      fetchPublicProfile();
    }
  }, [account, activeStudentId]);

  // Load products based on seller status
  useEffect(() => {
    if (isOwnerSeller) {
      setActiveTab('listings');
      fetchMyProducts();
    } else {
      setActiveTab('history');
    }
  }, [isOwnerSeller]);

  // Load products when activeTab switches
  useEffect(() => {
    if (activeTab === 'listings' && isOwnerSeller) {
      fetchMyProducts();
    }
  }, [activeTab, isOwnerSeller]);

  useEffect(() => {
    if (showEditModal) {
      setFormFullName(fullName);
      setFormPhone(userPhone);
      setFormLocation(userProfile?.campus?.name || 'KTX Dom A');
      setFormAvatarUrl(accountData?.imageUrl || account?.imageUrl || '');
    }
  }, [showEditModal, fullName, userProfile, accountData, account, userPhone]);

  // Mock transaction list for Activity History tab
  const mockActivityLogs = [
    {
      id: 1,
      type: 'BUY',
      title: 'Mua Giáo trình Toán Cao Cấp 1',
      amount: 120000,
      status: 'SUCCESS',
      date: '02/06/2026 10:15',
    },
    {
      id: 2,
      type: 'UPGRADE',
      title: 'Đăng ký Tài khoản Premium 1 tháng',
      amount: 50000,
      status: 'SUCCESS',
      date: '01/06/2026 08:30',
    },
    {
      id: 3,
      type: 'SELL',
      title: 'Bán Quạt điện để bàn mini cũ',
      amount: 150000,
      status: 'COMPLETED',
      date: '28/05/2026 16:45',
    },
    {
      id: 4,
      type: 'REPORT',
      title: 'Báo cáo lỗi thanh toán đơn hàng #1092',
      amount: 0,
      status: 'RESOLVED',
      date: '25/05/2026 14:00',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A2647] tracking-tight">{isOwner ? 'Trang Cá Nhân' : 'Hồ Sơ Cửa Hàng'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isOwner
              ? 'Quản lý hồ sơ, quyền hạn người bán và xem lịch sử hoạt động của bạn'
              : `Xem thông tin liên hệ và các sản phẩm đăng bán của ${fullName}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: SECTION 1 - USER IDENTITY CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Background Banner */}
              <div className="h-28 bg-gradient-to-r from-[#0A2647] via-[#1E293B] to-[#475569] relative"></div>

              {/* User Meta */}
              <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div
                  className={`w-20 h-20 bg-[#FF6B35] rounded-full border-4 ${isPremium ? (level === 2 ? 'border-[#FFD700]' : 'border-[#FF6B35]') : 'border-white'} flex items-center justify-center text-white font-bold text-2xl shadow-xl absolute -top-10 left-6 hover:scale-105 transition-transform duration-300 overflow-hidden bg-center bg-cover`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl.startsWith('uploads/') ? `/${imageUrl}` : imageUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitials
                  )}
                </div>

                <div className="pt-12 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                    <span className="text-xs text-gray-500 font-mono">ID: {displayLogin}</span>
                  </div>

                  {/* Badges list */}
                  <div className="flex flex-wrap gap-2">
                    {isOwnerAdmin && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        <Shield className="w-3.5 h-3.5" /> Quản trị viên
                      </span>
                    )}
                    {isOwnerSeller && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                        <Store className="w-3.5 h-3.5" /> Người bán
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      <User className="w-3.5 h-3.5" /> Sinh viên FPT
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {displayEmail && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{displayEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{userPhone || 'Chưa cập nhật số điện thoại'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Thành viên từ 2026</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <span className="flex-shrink-0 text-gray-400">📍</span>
                      <span>Khu vực: {campusName}</span>
                    </div>
                  </div>

                  {/* Settings quick links */}
                  {isOwner && (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-semibold border border-gray-200 transition-colors"
                        type="button"
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-400" /> Chỉnh sửa thông tin
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SECTION 2 & 3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION 2: ACTION CENTER CARD */}
            {isOwner &&
              (loadingStatus ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-center py-10 text-gray-500 text-sm font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35] mr-2" />
                  Đang kiểm tra quyền và hồ sơ Người bán...
                </div>
              ) : (
                <>
                  {/* Case 1: Verified Seller */}
                  {isSeller && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Quyền Người Bán Đã Được Kích Hoạt
                          </div>
                          <p className="text-emerald-700 text-xs sm:text-sm leading-relaxed max-w-xl">
                            Tài khoản của bạn đã được xác minh thành công. Bây giờ bạn có thể đăng tải sản phẩm thanh lý, quản lý kho hàng
                            và giao dịch trực tiếp với các sinh viên khác tại Hoa Lạc.
                          </p>
                        </div>
                        <Link
                          to="/seller-dashboard"
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100 whitespace-nowrap self-stretch sm:self-auto text-center justify-center"
                        >
                          <Store className="w-4 h-4" /> Kênh Người Bán <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Premium Status Banner */}
                      {isPremium ? (
                        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-yellow-800 font-bold text-lg">
                              <Crown className="w-5 h-5 text-yellow-600" /> Tài khoản Premium
                            </div>
                            <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed max-w-xl">
                              Bạn đang sử dụng <strong className="font-bold">{packageName}</strong>. Gói của bạn còn{' '}
                              <strong className="font-bold text-red-600">{daysRemaining}</strong> ngày sử dụng (Hết hạn vào{' '}
                              {endDate ? new Date(endDate).toLocaleDateString('vi-VN') : ''}).
                            </p>
                          </div>
                          <Link
                            to="/premium"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-yellow-200 whitespace-nowrap self-stretch sm:self-auto text-center justify-center"
                          >
                            <Star className="w-4 h-4" /> Quản lý gói
                          </Link>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-800 font-bold text-lg">
                              <TrendingUp className="w-5 h-5 text-blue-600" /> Nâng cấp Premium
                            </div>
                            <p className="text-blue-700 text-xs sm:text-sm leading-relaxed max-w-xl">
                              Tăng tốc doanh số bán hàng với các gói Premium dành cho Người bán. Hiển thị ưu tiên, không giới hạn sản phẩm
                              và nhiều tính năng đặc quyền khác.
                            </p>
                          </div>
                          <Link
                            to="/premium"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 whitespace-nowrap self-stretch sm:self-auto text-center justify-center"
                          >
                            <Crown className="w-4 h-4" /> Nâng cấp ngay
                          </Link>
                        </div>
                      )}

                      {/* Quick Stats Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Sản phẩm đang bán</span>
                            <div className="text-2xl font-extrabold text-[#0A2647]">{products.length} sản phẩm</div>
                          </div>
                          <div className="p-3 bg-blue-50 text-[#0A2647] rounded-xl group-hover:bg-blue-100/80 transition-colors">
                            <Tag className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Lượt quan tâm</span>
                            <div className="text-2xl font-extrabold text-[#0A2647]">142 lượt xem</div>
                          </div>
                          <div className="p-3 bg-orange-50 text-[#FF6B35] rounded-xl group-hover:bg-orange-100/80 transition-colors">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Giao dịch thành công</span>
                            <div className="text-2xl font-extrabold text-[#0A2647]">5 đơn hàng</div>
                          </div>
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100/80 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Case 2: Upgrade request is PENDING approval */}
                  {!isSeller && requestStatus === 'PENDING' && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-800 font-bold text-lg">
                          <Clock className="w-5 h-5 text-amber-500 animate-pulse" /> Hồ Sơ Đăng Ký Đang Chờ Phê Duyệt
                        </div>
                        <p className="text-amber-700 text-xs sm:text-sm leading-relaxed max-w-xl">
                          Yêu cầu nâng cấp tài khoản lên quyền Người bán của bạn đã được gửi. Đội ngũ Quản trị viên UniPass đang tiến hành
                          xác minh ảnh căn cước sinh viên.
                        </p>
                      </div>
                      <Link
                        to="/seller-success"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-100 whitespace-nowrap self-stretch sm:self-auto text-center justify-center"
                      >
                        <Eye className="w-4 h-4" /> Xem tiến độ
                      </Link>
                    </div>
                  )}

                  {/* Case 3: Upgrade request is REJECTED */}
                  {!isSeller && requestStatus === 'REJECTED' && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
                          <AlertOctagon className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-red-900 text-lg">Yêu Cầu Nâng Cấp Bị Từ Chối</h3>
                          <p className="text-red-700 text-xs sm:text-sm leading-relaxed">
                            Hồ sơ xác minh danh tính người bán của bạn không được phê duyệt. Vui lòng xem lý do bên dưới để bổ sung tài liệu
                            chính xác.
                          </p>
                        </div>
                      </div>

                      {rejectionReason && (
                        <div className="bg-white/80 border border-red-100 rounded-xl p-4 text-xs">
                          <span className="block text-red-950 font-bold mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Lý do từ chối từ Admin:
                          </span>
                          <p className="text-red-800 leading-relaxed font-medium">{rejectionReason}</p>
                        </div>
                      )}

                      <div className="flex justify-start">
                        <button
                          onClick={() => setShowRegModal(true)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-100"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Gửi lại yêu cầu đăng ký
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 4: No request yet (Regular student user) */}
                  {!isSeller && !requestStatus && (
                    <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] rounded-2xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10">
                        <Store className="w-48 h-48 text-white" />
                      </div>
                      <div className="space-y-2 relative z-10 max-w-xl">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B35] text-white uppercase tracking-wider">
                          Đặc Quyền Thành Viên
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">Bạn có đồ cũ muốn thanh lý tại Hoa Lạc?</h3>
                        <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                          Nâng cấp tài khoản của bạn lên vai trò Người bán hoàn toàn miễn phí! Đăng tải sách cũ, thiết bị điện tử, đồ gia
                          dụng phòng trọ để tiếp cận hàng nghìn sinh viên trong khuôn viên chợ trường UniPass ngay hôm nay.
                        </p>
                      </div>
                      <div className="pt-2 relative z-10">
                        <button
                          onClick={() => setShowRegModal(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] hover:scale-102 text-[#0A2647] rounded-xl text-xs font-bold transition-all shadow-lg"
                        >
                          🏪 Đăng ký bán hàng ngay <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ))}

            {/* SECTION 3: ACTIVITY TABS LAYOUT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab headers */}
              <div className="flex border-b border-gray-150 bg-gray-50/50">
                {isOwnerSeller && (
                  <button
                    onClick={() => setActiveTab('listings')}
                    className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 ${
                      activeTab === 'listings'
                        ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-white font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                    }`}
                  >
                    <Tag className="w-4 h-4" /> Sản phẩm đang bán
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 ${
                      activeTab === 'history'
                        ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-white font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                    }`}
                  >
                    <History className="w-4 h-4" /> Lịch sử hoạt động
                  </button>
                )}
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                {!isOwnerSeller && !isOwner ? (
                  <div className="py-12 text-center text-gray-500 text-sm font-medium">
                    Tài khoản này là tài khoản sinh viên/người mua và chưa đăng ký bán hàng.
                  </div>
                ) : (
                  <>
                    {activeTab === 'listings' && isOwnerSeller && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {isOwner ? 'Danh mục hàng hóa của bạn' : 'Danh sách sản phẩm đăng bán'}
                          </h4>
                          {isOwner && (
                            <Link
                              to="/seller-dashboard"
                              className="text-xs text-[#FF6B35] hover:text-[#FF5722] font-semibold flex items-center gap-1"
                            >
                              Quản lý trong Kênh Người Bán <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>

                        {loadingProducts ? (
                          <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-500 text-xs font-semibold">
                            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" />
                            Đang tải danh sách hàng hóa...
                          </div>
                        ) : products.length === 0 ? (
                          <div className="py-12 text-center text-gray-500 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl space-y-2">
                            <p>{isOwner ? 'Bạn chưa có sản phẩm đăng bán nào trên hệ thống.' : 'Người bán chưa đăng tải sản phẩm nào.'}</p>
                            {isOwner && (
                              <Link
                                to="/create-listing"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                Đăng bán sản phẩm đầu tiên
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {products.map(prod => (
                              <React.Fragment key={`my-prod-${prod.id}`}>
                                <div className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                  {/* Top half: Aspect-video thumbnail */}
                                  <div className="aspect-video w-full bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                                    {prod.imageUrl ? (
                                      <img
                                        src={prod.imageUrl}
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 group-hover:scale-105 transition-transform duration-500">
                                        <Store className="w-8 h-8 text-gray-300 mb-1.5" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                          UniPass Listing
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {/* Bottom half */}
                                  <div className="p-4 space-y-3 flex flex-col justify-between flex-1">
                                    <div className="space-y-2">
                                      <h5 className="font-bold text-gray-800 text-xs line-clamp-2 min-h-[2rem]" title={prod.name}>
                                        {prod.name}
                                      </h5>
                                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                                        <span className="font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                          Kho: {prod.stock ?? 1}
                                        </span>
                                        {prod.status === 'PENDING_DEAL' ? (
                                          <span className="font-bold text-yellow-800 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                                            Chờ giao dịch
                                          </span>
                                        ) : prod.status === 'SOLD' ? (
                                          <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                            Đã bán
                                          </span>
                                        ) : (
                                          <span className="font-bold text-green-800 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                            Hoạt động
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-sm text-[#FF6B35] font-bold">{(prod.price || 0).toLocaleString('vi-VN')}đ</div>
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'history' && isOwner && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 text-sm">Các giao dịch & hành động gần đây</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50">
                                <th className="py-3 px-4">Hoạt động</th>
                                <th className="py-3 px-4">Ngày</th>
                                <th className="py-3 px-4">Giá trị</th>
                                <th className="py-3 px-4 text-center">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {mockActivityLogs.map(log => (
                                <React.Fragment key={`activity-${log.id}`}>
                                  <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-2">
                                      {log.type === 'BUY' && <ShoppingBag className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                                      {log.type === 'SELL' && <Store className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                      {log.type === 'UPGRADE' && <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                                      {log.type === 'REPORT' && <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                                      <span className="truncate max-w-[180px] sm:max-w-xs">{log.title}</span>
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap text-xs font-mono">{log.date}</td>
                                    <td className="py-3.5 px-4 font-semibold text-[#0A2647] whitespace-nowrap">
                                      {log.amount > 0 ? `${log.amount.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                    </td>
                                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                      {log.status === 'SUCCESS' || log.status === 'COMPLETED' || log.status === 'RESOLVED' ? (
                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                                          Thành công
                                        </span>
                                      ) : (
                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                                          Đang xử lý
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller upgrading Registration Modal */}
      {showRegModal && (
        <SellerRegistrationModal
          isOpen={showRegModal}
          onClose={() => {
            setShowRegModal(false);
            fetchStatus(); // Refresh status on close
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col border border-gray-150 animate-slideUp">
            {/* Modal Header */}
            <div className="bg-[#0A2647] text-white p-6 relative flex-shrink-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold">Chỉnh Sửa Hồ Sơ</h3>
              <p className="text-blue-200 text-xs mt-1">Cập nhật thông tin cá nhân của bạn trên UniPass</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Click-to-upload avatar zone */}
              <div className="flex flex-col items-center">
                <div
                  onClick={handleAvatarClick}
                  className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-md relative overflow-hidden group cursor-pointer bg-[#FF6B35] flex items-center justify-center text-white text-3xl font-bold"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : formAvatarUrl ? (
                    <img
                      src={formAvatarUrl}
                      alt="Preview Avatar"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    userInitials
                  )}

                  {/* Camera Icon Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity animate-fadeIn">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <span className="text-[11px] text-gray-500 mt-2 font-medium">Nhấp vào ảnh để thay đổi ảnh đại diện</span>
              </div>

              {/* Grid for fields */}
              <div className="space-y-4">
                {/* Họ và tên (Full Name) - EDITABLE */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-gray-700 block">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formFullName}
                    onChange={e => setFormFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-sm text-gray-900 transition-all font-medium"
                    required
                  />
                </div>

                {/* Số điện thoại (Phone) - EDITABLE */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-gray-700 block">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="Nhập số điện thoại (10 chữ số)"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-sm text-gray-900 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Khu vực Hòa Lạc (Location) - LOCALIZATION DROPDOWN */}
                <div className="space-y-1.5">
                  <label htmlFor="location" className="text-xs font-semibold text-gray-700 block">
                    Khu vực Hòa Lạc
                  </label>
                  <select
                    id="location"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-sm text-gray-900 transition-all font-medium bg-white"
                  >
                    <option value="KTX Dom A">Kí túc xá Dom A</option>
                    <option value="KTX Dom B">Kí túc xá Dom B</option>
                    <option value="KTX Dom C">Kí túc xá Dom C</option>
                    <option value="KTX Dom D">Kí túc xá Dom D</option>
                    <option value="KTX Dom E">Kí túc xá Dom E</option>
                    <option value="Tân Xã">Khu vực Tân Xã</option>
                    <option value="Thạch Hòa">Khu vực Thạch Hòa</option>
                    <option value="Phùng Xá">Khu vực Phùng Xá</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mã số sinh viên (Login) - READ-ONLY */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 block">Mã số sinh viên (Username)</label>
                    <input
                      type="text"
                      value={account?.login || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>

                  {/* Email - READ-ONLY */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 block">Địa chỉ Email</label>
                    <input
                      type="email"
                      value={account?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all"
                  disabled={isSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#FF6B35] hover:bg-[#FF5722] text-[#0A2647] font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                  disabled={isSaving || isUploadingAvatar}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
