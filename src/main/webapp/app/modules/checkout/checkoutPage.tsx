import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';

// import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

import {
  MapPin,
  ChevronRight,
  BadgeCheck,
  MessageSquare,
  Store,
  Shield,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  Package,
  Clock,
  Eye,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { getConditionLabel } from '../../shared/util/condition-util';

// Interface for cart items
interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  condition: string;
  quantity: number;
  inStock: boolean;
}

interface SellerGroup {
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  university: string;
  items: CartItem[];
}

interface CheckoutSellerGroup {
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  university: string;
  items: CartItem[];
  messageToSeller: string;
  deliveryMethod: 'library' | 'dorm' | null;
}

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get seller data from navigation state
  const {
    sellerId,
    selectedItemIds,
    sellerGroups: allSellerGroups,
    productId,
    productName,
    productPrice,
    productImage,
    singleProduct,
    sellerName: directSellerName,
    sellerAvatar: directSellerAvatar,
    university: directUniversity,
  } = (location.state || {}) as {
    sellerId?: string | number;
    selectedItemIds?: string[];
    sellerGroups?: SellerGroup[];
    productId?: string | number;
    productName?: string;
    productPrice?: number;
    productImage?: string;
    singleProduct?: boolean;
    sellerName?: string;
    sellerAvatar?: string;
    university?: string;
  };

  const [checkoutGroup, setCheckoutGroup] = useState<CheckoutSellerGroup | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(() => {
    // 1. Khi F5 hoặc tải trang, tìm xem trong máy có lưu địa chỉ nào trước đó chưa
    const savedAddresses = localStorage.getItem('checkout_addresses');
    // 2. Nếu ĐÃ CÓ lưu (người dùng đã từng nhập rồi), thì lấy ra dùng lại
    if (savedAddresses) {
      return JSON.parse(savedAddresses);
    }
    return [];
  });
  // Thêm cái này ngay bên dưới để tự động lưu mỗi khi người dùng Thêm/Sửa/Xóa địa chỉ
  useEffect(() => {
    localStorage.setItem('checkout_addresses', JSON.stringify(addresses));
  }, [addresses]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>('');

  // const libraries: 'places'[] = ['places'];
  //
  // THÊM ĐOẠN LOGIC GOOGLE MAP NÀY VÀO ĐÂY
  // ==========================================
  // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // <--- NHỚ THAY API KEY CỦA BẠN VÀO ĐÂY
  //   libraries,
  // });
  //
  // const onPlaceChanged = () => {
  //   if (autocompleteRef.current !== null) {
  //     const place = autocompleteRef.current.getPlace();
  //     const formattedAddress = place.formatted_address || place.name || '';

  //     // Tự động điền địa chỉ đã chọn vào state newAddress
  //     setNewAddress(prev => ({ ...prev, address: formattedAddress }));
  //   }
  // };

  // NEW FEATURE: Order preview modal - show order summary before final confirmation
  const [showOrderPreviewModal, setShowOrderPreviewModal] = useState(false);
  const [addressValidationError, setAddressValidationError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  // NEW FEATURE: Delivery time estimate - calculate based on delivery method
  const getDeliveryEstimate = () => {
    if (!checkoutGroup?.deliveryMethod) {
      return 'Thời gian giao hàng sẽ được thống nhất với người bán';
    }
    if (checkoutGroup.deliveryMethod === 'library') {
      return 'Hôm nay - Ngày mai (giao tại thư viện)';
    }
    if (checkoutGroup.deliveryMethod === 'dorm') {
      return '1-2 ngày làm việc (giao tận KTX)';
    }
    return '';
  };

  useEffect(() => {
    const isProductCheckout = singleProduct && sellerId != null && productId != null;

    if (isProductCheckout) {
      setCheckoutGroup({
        sellerId: String(sellerId),
        sellerName: directSellerName || 'Người bán',
        sellerAvatar: directSellerAvatar || 'U',
        university: directUniversity || 'Đại học FPT',
        items: [
          {
            id: String(productId),
            image: productImage || 'https://via.placeholder.com/150?text=No+Image',
            title: productName || 'Sản phẩm',
            price: productPrice ?? 0,
            condition: 'N/A',
            quantity: 1,
            inStock: true,
          },
        ],
        messageToSeller: '',
        deliveryMethod: null,
      });
      return;
    }

    if (!sellerId || !selectedItemIds || !allSellerGroups) {
      navigate('/cart');
      return;
    }

    // Find the seller group and filter items
    const seller = allSellerGroups.find(g => String(g.sellerId) === String(sellerId));
    if (!seller) {
      navigate('/cart');
      return;
    }

    const selectedIds = selectedItemIds.map(id => String(id));
    const selectedItems = seller.items.filter(item => selectedIds.includes(String(item.id)));

    if (selectedItems.length === 0) {
      navigate('/cart');
      return;
    }

    setCheckoutGroup({
      sellerId: seller.sellerId,
      sellerName: seller.sellerName,
      sellerAvatar: seller.sellerAvatar,
      university: seller.university,
      items: selectedItems,
      messageToSeller: '',
      deliveryMethod: null,
    });
  }, [
    sellerId,
    selectedItemIds,
    allSellerGroups,
    navigate,
    singleProduct,
    productId,
    productName,
    productPrice,
    productImage,
    directSellerName,
    directSellerAvatar,
    directUniversity,
  ]);

  if (!checkoutGroup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Get selected address
  const shippingInfo = addresses.find(addr => addr.id === selectedAddressId) || null;
  const isAddressValid =
    !!shippingInfo && shippingInfo.name.trim() !== '' && shippingInfo.phone.trim() !== '' && shippingInfo.address.trim() !== '';
  const addressCardClasses = [
    'bg-white rounded-xl shadow-sm border p-6',
    isAddressValid ? 'border-gray-200' : 'border-red-300 ring-1 ring-red-100',
  ].join(' ');

  // Calculate totals for single seller
  const merchandiseSubtotal = checkoutGroup.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0; // Free shipping
  const totalPayment = merchandiseSubtotal + shippingFee;

  const updateMessage = (message: string) => {
    setCheckoutGroup(prev => (prev ? { ...prev, messageToSeller: message } : null));
  };

  const updateDeliveryMethod = (method: 'library' | 'dorm' | null) => {
    setCheckoutGroup(prev => (prev ? { ...prev, deliveryMethod: method } : null));
  };

  // Validate phone number - must start with 0 and have 9-10 digits
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{8,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Handle phone input change with validation
  const handlePhoneChange = (value: string) => {
    setNewAddress({ ...newAddress, phone: value });
    if (value && !validatePhone(value)) {
      setPhoneError('Số điện thoại phải bắt đầu bằng 0 và có 9-10 chữ số');
    } else {
      setPhoneError(null);
    }
  };

  const renderAddressModal = () => {
    if (!showAddressModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#0A2647] text-white p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Địa chỉ nhận hàng</h2>
            </div>
            <button
              onClick={() => {
                setShowAddressModal(false);
                setIsAddingNewAddress(false);
                setNewAddress({ name: '', phone: '', address: '' });
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {!isAddingNewAddress ? (
              <>
                {/* Address List */}
                <div className="space-y-3 mb-4">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === addr.id ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setAddressValidationError(null);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{addr.name}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-700">{addr.phone}</span>
                          {addr.isDefault && <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-xs rounded">Mặc định</span>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                            className="text-[#FF6B35] hover:text-[#FF5722] text-sm font-medium"
                          >
                            Sửa
                          </button>
                          {addresses.length > 1 && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{addr.address}</p>
                      {!addr.isDefault && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleSetDefaultAddress(addr.id);
                          }}
                          className="text-[#FF6B35] hover:text-[#FF5722] text-sm font-medium"
                        >
                          Đặt làm mặc định
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Address Button */}
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-[#FF6B35] text-[#0A2647] hover:text-[#FF6B35] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Thêm địa chỉ mới
                </button>

                {/* Confirm Button */}
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="w-full mt-4 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors"
                >
                  Xác nhận
                </button>
              </>
            ) : (
              <>
                {/* Add/Edit Address Form */}
                <h3 className="text-lg font-bold text-[#0A2647] mb-4">{editingAddressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="Nhập số điện thoại (bắt đầu bằng 0, 9-10 chữ số)"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        phoneError ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-[#FF6B35]'
                      }`}
                    />
                    {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    <textarea
                      value={newAddress.address}
                      onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                      placeholder="Nhập địa chỉ chi tiết"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsAddingNewAddress(false);
                      setEditingAddressId(null);
                      setNewAddress({ name: '', phone: '', address: '' });
                      setPhoneError(null);
                    }}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddAddress}
                    disabled={!newAddress.name || !newAddress.phone || !newAddress.address || !!phoneError}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render order preview modal content
  const renderOrderPreviewModal = () => {
    if (!showOrderPreviewModal || !checkoutGroup) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#0A2647] to-[#144272] text-white p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Xác nhận đơn hàng</h2>
            </div>
            <button onClick={() => setShowOrderPreviewModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Delivery Info */}
            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                Thông tin giao hàng
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Người nhận:</span>
                  <span className="font-medium text-gray-900">{shippingInfo?.name || 'Chưa có địa chỉ'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số điện thoại:</span>
                  <span className="font-medium text-gray-900">{shippingInfo?.phone || 'Chưa có số điện thoại'}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600 block mb-1">Địa chỉ:</span>
                  <span className="font-medium text-gray-900">{shippingInfo?.address || 'Vui lòng thêm địa chỉ nhận hàng'}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600 block mb-1">
                    Thời gian xác nhận:
                    <span className="font-medium text-gray-900"> {orderDate || new Date().toLocaleString('vi-VN')}</span>
                  </span>
                </div>
                {checkoutGroup?.deliveryMethod && (
                  <div className="pt-2 border-t flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#FF6B35] mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">Phương thức giao hàng:</span>
                      <span className="font-medium text-gray-900">
                        {checkoutGroup.deliveryMethod === 'library' ? 'Hẹn gặp ở thư viện' : 'Giao tận KTX'}
                      </span>
                      <p className="text-xs text-green-600 mt-1">{getDeliveryEstimate()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF6B35]" />
                Sản phẩm đặt mua
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Seller Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#0A2647]" />
                  <div className="w-6 h-6 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {checkoutGroup?.sellerAvatar}
                  </div>
                  <span className="font-medium text-[#0A2647]">{checkoutGroup?.sellerName}</span>
                  <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-xs text-gray-500">• {checkoutGroup?.university}</span>
                </div>

                {/* Product List */}
                <div className="p-4 space-y-3">
                  {checkoutGroup?.items.map(item => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-1">{getConditionLabel(item.condition)}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">x{item.quantity}</span>
                          <span className="font-bold text-[#FF5722]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message to Seller */}
                {checkoutGroup?.messageToSeller && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lời nhắn cho người bán:</p>
                        <p className="text-sm text-gray-700">{checkoutGroup.messageToSeller}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-3">Chi tiết thanh toán</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tổng tiền hàng:</span>
                  <span className="font-medium text-gray-900">{merchandiseSubtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="pt-3 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-[#FF5722]">{totalPayment.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowOrderPreviewModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Xác nhận đặt hàng
              </button>
            </div>

            {/* Trust Notice */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#0A2647] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  Bằng việc xác nhận đơn hàng, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Unipass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render success modal content
  const renderSuccessModal = () => {
    if (!showSuccessModal || !checkoutGroup) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fadeIn">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp">
          {/* Success Animation */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-center relative overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-scaleIn">
                <CheckCircle className="w-16 h-16 text-green-500 animate-checkmark" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 animate-fadeInUp">Đặt hàng thành công!</h2>
              <p className="text-white/90 animate-fadeInUp animation-delay-100">Cảm ơn bạn đã đặt hàng tại Unipass</p>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-4">
            {/* Order Info - Left Column */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-[#0A2647] mb-3 text-sm">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Mã đơn hàng:</span>
                    <span className="font-bold text-[#0A2647] text-sm">{orderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Thời gian xác nhận:</span>
                    <span className="font-bold text-[#0A2647] text-sm">{orderDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Trạng thái:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chờ xác nhận</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-gray-600">Tổng thanh toán:</span>
                    <span className="text-lg font-bold text-[#FF6B35]">
                      {(checkoutGroup?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-[#0A2647] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0A2647] mb-2">Bước tiếp theo</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Xác nhận trong 24h</li>
                      <li>• Nhận thông báo</li>
                      <li>• Chat với người bán</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Right Column */}
            <div className="space-y-3 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-3">
                <Link
                  to="/orders?status=pending"
                  onClick={() => setShowSuccessModal(false)}
                  className="py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Xem đơn hàng
                </Link>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                  className="py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>

              {/* Support Info */}
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500">
                  Cần hỗ trợ?{' '}
                  <Link to="/messages" className="text-[#FF6B35] hover:text-[#FF5722] font-medium">
                    Liên hệ hỗ trợ
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      return;
    }

    // Validate phone
    if (!validatePhone(newAddress.phone)) {
      setPhoneError('Số điện thoại phải bắt đầu bằng 0 và có 9-10 chữ số');
      return;
    }

    if (editingAddressId) {
      // Update existing address
      setAddresses(
        addresses.map(addr =>
          addr.id === editingAddressId ? { ...addr, name: newAddress.name, phone: newAddress.phone, address: newAddress.address } : addr,
        ),
      );
      setEditingAddressId(null);
    } else {
      // Add new address
      const newAddr: ShippingAddress = {
        id: Date.now().toString(),
        name: newAddress.name,
        phone: newAddress.phone,
        address: newAddress.address,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
    }

    setNewAddress({ name: '', phone: '', address: '' });
    setIsAddingNewAddress(false);
    setShowAddressModal(false);
    setAddressValidationError(null);
    setPhoneError(null);
  };

  const handleEditAddress = (addr: ShippingAddress) => {
    setNewAddress({ name: addr.name, phone: addr.phone, address: addr.address });
    setEditingAddressId(addr.id);
    setIsAddingNewAddress(true);
    setPhoneError(null);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      })),
    );
    setSelectedAddressId(addressId);
  };

  const handleDeleteAddress = (addressId: string) => {
    const filtered = addresses.filter(addr => addr.id !== addressId);
    setAddresses(filtered);
    if (selectedAddressId === addressId && filtered.length > 0) {
      setSelectedAddressId(filtered[0].id);
    }
  };

  // NEW FEATURE: Order preview modal - open preview instead of directly placing order
  const handleOpenOrderPreview = () => {
    if (!isAddressValid) {
      const errorMessage = 'Vui lòng nhập đầy đủ thông tin địa chỉ nhận hàng trước khi thanh toán!';
      showToast(errorMessage, 'error');
      setAddressValidationError(errorMessage);

      // Tự động mở Modal bắt người dùng nhập địa chỉ luôn cho tiện (Tăng UX)
      setShowAddressModal(true);
      setIsAddingNewAddress(true);
      return; // Chặn không cho đi tiếp
    }
    setAddressValidationError(null);
    setShowOrderPreviewModal(true);
  };

  // NEW FEATURE: Order preview confirmed - proceed with placing the order
  const handleConfirmOrder = async () => {
    try {
      if (!checkoutGroup) return;

      if (!shippingInfo) {
        showToast('Vui lòng cấu hình địa chỉ giao hàng!', 'error');
        return;
      }

      const payload: any = {
        shippingAddress: shippingInfo.address,
        receiverName: shippingInfo.name,
        receiverPhone: shippingInfo.phone,
        buyerNote: checkoutGroup.messageToSeller || '',
        cartItemIds: checkoutGroup.items.map(item => Number(item.id)),
      };

      if (singleProduct && productId != null) {
        // Keep productIds for direct checkout flows if the backend supports it,
        // but always send cartItemIds because the checkout endpoint validates it.
        payload.productIds = checkoutGroup.items.map(item => Number(item.id));
      }

      const response = await axios.post('/api/orders/checkout', payload);

      if (response.data && response.data.id) {
        setOrderId(`ORD${response.data.id}`);

        const dateFromBE = response.data.createdDate || response.data.createdAt;
        setOrderDate(dateFromBE ? new Date(dateFromBE).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'));

        window.dispatchEvent(new Event('cartUpdated'));
        setShowOrderPreviewModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      const errorMessage = 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-[#0A2647] hover:text-[#FF6B35] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại giỏ hàng</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Xác nhận đơn hàng</h1>
          <p className="text-gray-600">Kiểm tra thông tin và hoàn tất đặt hàng</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order & Shipping Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Card */}
            <div className={addressCardClasses}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <h2 className="text-lg font-bold text-[#0A2647]">Địa chỉ nhận hàng</h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddressModal(true);
                    if (!isAddressValid) {
                      setAddressValidationError('Vui lòng nhập đầy đủ thông tin địa chỉ nhận hàng trước khi xác nhận đặt hàng.');
                    }
                  }}
                  className="text-[#FF6B35] hover:text-[#FF5722] text-sm font-medium transition-colors"
                >
                  Thay đổi
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{shippingInfo?.name || 'Chưa có địa chỉ'}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-700">{shippingInfo?.phone || 'Chưa có số điện thoại'}</span>
                </div>
                <p className="text-gray-600 text-sm">{shippingInfo?.address || 'Vui lòng thêm địa chỉ nhận hàng'}</p>
              </div>
              {!isAddressValid && addressValidationError && <p className="mt-3 text-sm text-red-600">{addressValidationError}</p>}
            </div>

            {/* Single Seller Group (selected from cart) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Seller Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-[#0A2647]" />
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {checkoutGroup.sellerAvatar}
                  </div>
                  <span className="font-medium text-[#0A2647]">{checkoutGroup.sellerName}</span>
                  <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-xs text-gray-500">• {checkoutGroup.university}</span>
                </div>
              </div>

              {/* Product List */}
              <div className="p-6">
                <div className="space-y-4 mb-5">
                  {checkoutGroup.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{getConditionLabel(item.condition)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                          <span className="text-lg font-bold text-[#FF5722]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message to Seller */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Lời nhắn:</label>
                  </div>
                  <input
                    type="text"
                    value={checkoutGroup.messageToSeller}
                    onChange={e => updateMessage(e.target.value)}
                    placeholder="Lưu ý cho Người bán..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phương thức giao hàng (Không bắt buộc):</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateDeliveryMethod(checkoutGroup.deliveryMethod === 'library' ? null : 'library')}
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                        checkoutGroup.deliveryMethod === 'library'
                          ? 'border-[#FF6B35] bg-orange-50 text-[#0A2647]'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium">Hẹn gặp ở thư viện</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDeliveryMethod(checkoutGroup.deliveryMethod === 'dorm' ? null : 'dorm')}
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                        checkoutGroup.deliveryMethod === 'dorm'
                          ? 'border-[#FF6B35] bg-orange-50 text-[#0A2647]'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium">Giao tận KTX</span>
                    </button>
                  </div>
                  {!checkoutGroup.deliveryMethod && (
                    <p className="text-xs text-gray-500 mt-2">Bạn có thể thống nhất địa điểm giao hàng sau qua tin nhắn với người bán</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2647] mb-6">Chi tiết thanh toán</h2>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tổng tiền hàng:</span>
                  <span className="font-medium text-gray-900">{merchandiseSubtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>

                {/* Total Payment */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-[#FF5722]">{totalPayment.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              {/* NEW FEATURE: Delivery time estimate display */}
              {checkoutGroup.deliveryMethod && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#0A2647] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#0A2647] mb-1">Thời gian giao hàng dự kiến</p>
                      <p className="text-sm text-gray-700">{getDeliveryEstimate()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* NEW FEATURE: Order preview button - review before confirming */}
              <button
                onClick={handleOpenOrderPreview}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Xác nhận đặt hàng
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Trust Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#0A2647] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-[#0A2647] mb-1">Giao dịch an toàn</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Mọi người bán đều đã được xác thực là sinh viên. Giao dịch của bạn được bảo vệ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <p className="text-xs text-gray-500 text-center mt-4">Nhấn {'Xác nhận đặt hàng'}, bạn đồng ý với Điều khoản Unipass</p>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {renderAddressModal()}

        {/* Order Preview Modal */}
        {renderOrderPreviewModal()}

        {/* Success Modal */}
        {renderSuccessModal()}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-slideUp">
            <div
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              <BadgeCheck className="w-5 h-5" />
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
