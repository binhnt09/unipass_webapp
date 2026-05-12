import React, { useState } from 'react';
import { MapPin, ChevronRight, BadgeCheck, MessageSquare, Store, Shield, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router';

// Interface for cart items grouped by seller
interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  condition: string;
  quantity: number;
}

interface SellerGroup {
  sellerId: string;
  sellerName: string;
  university: string;
  items: CartItem[];
  messageToSeller: string;
  deliveryMethod: 'library' | 'dorm';
}

export function CheckoutPage() {
  const navigate = useNavigate();

  // Sample data - grouped by sellers (from ShoppingCartPage)
  const [sellerGroups, setSellerGroups] = useState<SellerGroup[]>([
    {
      sellerId: '1',
      sellerName: 'Sarah M.',
      university: 'MIT',
      items: [
        {
          id: '1',
          image:
            'https://images.unsplash.com/photo-1633707392225-d883c8cd3e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2slMjBzdGFja3xlbnwxfHx8fDE3NzMyOTYwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Calculus Early Transcendentals 8th Ed.',
          price: 45.0,
          condition: 'Like New',
          quantity: 1,
        },
      ],
      messageToSeller: '',
      deliveryMethod: 'library',
    },
    {
      sellerId: '2',
      sellerName: 'Lisa W.',
      university: 'Yale',
      items: [
        {
          id: '2',
          image:
            'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzczMjQ2MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Sony WH-1000XM4 Headphones',
          price: 220.0,
          condition: 'Excellent',
          quantity: 1,
        },
      ],
      messageToSeller: '',
      deliveryMethod: 'dorm',
    },
    {
      sellerId: '3',
      sellerName: 'Mike T.',
      university: 'Berkeley',
      items: [
        {
          id: '3',
          image:
            'https://images.unsplash.com/photo-1700627565641-bd6b7890befd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcCUyMHN0dWR5fGVufDF8fHx8MTc3MzI5NjA4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'LED Desk Lamp with USB Charging',
          price: 25.0,
          condition: 'Like New',
          quantity: 2,
        },
      ],
      messageToSeller: '',
      deliveryMethod: 'library',
    },
  ]);

  // Placeholder address data
  const shippingInfo = {
    name: 'Minh Hoàng',
    phone: '0912 345 678',
    address: 'Ký túc xá A - Phòng 301, Đại học FPT',
  };

  // Calculate totals
  const merchandiseSubtotal = sellerGroups.reduce(
    (total, group) => total + group.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    0,
  );
  const shippingFee = 0; // Free shipping
  const totalPayment = merchandiseSubtotal + shippingFee;

  const updateMessage = (sellerId: string, message: string) => {
    setSellerGroups(groups => groups.map(group => (group.sellerId === sellerId ? { ...group, messageToSeller: message } : group)));
  };

  const updateDeliveryMethod = (sellerId: string, method: 'library' | 'dorm') => {
    setSellerGroups(groups => groups.map(group => (group.sellerId === sellerId ? { ...group, deliveryMethod: method } : group)));
  };

  const handlePlaceOrder = () => {
    navigate('/purchase-success');
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <h2 className="text-lg font-bold text-[#0A2647]">Địa chỉ nhận hàng</h2>
                </div>
                <button className="text-[#FF6B35] hover:text-[#FF5722] text-sm font-medium transition-colors">Thay đổi</button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{shippingInfo.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-700">{shippingInfo.phone}</span>
                </div>
                <p className="text-gray-600 text-sm">{shippingInfo.address}</p>
              </div>
            </div>

            {/* Items Grouped by Seller */}
            {sellerGroups.map(group => (
              <div key={group.sellerId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Seller Header */}
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#0A2647]" />
                    <span className="font-medium text-[#0A2647]">{group.sellerName}</span>
                    <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                    <span className="text-xs text-gray-500">• {group.university}</span>
                  </div>
                </div>

                {/* Product List */}
                <div className="p-6">
                  <div className="space-y-4 mb-5">
                    {group.items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{item.condition}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
                            <span className="text-lg font-bold text-[#0A2647]">${(item.price * item.quantity).toFixed(2)}</span>
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
                      value={group.messageToSeller}
                      onChange={e => updateMessage(group.sellerId, e.target.value)}
                      placeholder="Lưu ý cho Người bán..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phương thức giao hàng:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          group.deliveryMethod === 'library'
                            ? 'border-[#FF6B35] bg-orange-50 text-[#0A2647]'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`delivery-${group.sellerId}`}
                          checked={group.deliveryMethod === 'library'}
                          onChange={() => updateDeliveryMethod(group.sellerId, 'library')}
                          className="text-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                        <span className="text-sm font-medium">Hẹn gặp ở thư viện</span>
                      </label>
                      <label
                        className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          group.deliveryMethod === 'dorm'
                            ? 'border-[#FF6B35] bg-orange-50 text-[#0A2647]'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`delivery-${group.sellerId}`}
                          checked={group.deliveryMethod === 'dorm'}
                          onChange={() => updateDeliveryMethod(group.sellerId, 'dorm')}
                          className="text-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                        <span className="text-sm font-medium">Giao tận KTX</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Order Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2647] mb-6">Chi tiết thanh toán</h2>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tổng tiền hàng:</span>
                  <span className="font-medium text-gray-900">${merchandiseSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>

                {/* Total Payment */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-[#FF6B35]">${totalPayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
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
      </div>
    </div>
  );
}
