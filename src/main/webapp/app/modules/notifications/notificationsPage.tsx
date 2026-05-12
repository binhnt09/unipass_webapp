import React, { useState } from 'react';
import { Bell, Package, ShoppingBag, Star, MessageCircle, TrendingUp, AlertCircle, CheckCircle, Truck, Gift, Tag, X } from 'lucide-react';

type NotificationType = 'order' | 'promotion' | 'system' | 'review' | 'message';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: any;
  color?: string;
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Đơn hàng đã được xác nhận',
      message: 'Đơn hàng #UM2024032301 của bạn đã được người bán xác nhận và đang chuẩn bị hàng.',
      timestamp: '5 phút trước',
      read: false,
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: '2',
      type: 'order',
      title: 'Đơn hàng đang được giao',
      message: 'Đơn hàng #UM2024032205 đang trên đường giao đến bạn. Dự kiến giao hàng trong hôm nay.',
      timestamp: '1 giờ trước',
      read: false,
      icon: Truck,
      color: 'blue',
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Flash Sale - Giảm đến 50%!',
      message: 'Laptop Dell XPS 13 đang có chương trình giảm giá đặc biệt chỉ trong 2 giờ. Nhanh tay!',
      timestamp: '2 giờ trước',
      read: false,
      icon: Tag,
      color: 'orange',
    },
    {
      id: '4',
      type: 'message',
      title: 'Tin nhắn mới từ người bán',
      message: 'Nam Nguyễn đã trả lời câu hỏi của bạn về sản phẩm "Tai nghe Sony WH-1000XM4".',
      timestamp: '3 giờ trước',
      read: true,
      icon: MessageCircle,
      color: 'purple',
    },
    {
      id: '5',
      type: 'order',
      title: 'Giao hàng thành công',
      message: 'Đơn hàng #UM2024032104 đã được giao thành công. Hãy đánh giá sản phẩm nhé!',
      timestamp: '1 ngày trước',
      read: true,
      icon: Package,
      color: 'green',
    },
    {
      id: '6',
      type: 'review',
      title: 'Nhận được đánh giá mới',
      message: 'Minh Hoàng đã đánh giá 5 sao cho sản phẩm "Balo laptop chống nước" của bạn.',
      timestamp: '1 ngày trước',
      read: true,
      icon: Star,
      color: 'yellow',
    },
    {
      id: '7',
      type: 'promotion',
      title: 'Mã giảm giá mới cho bạn',
      message: 'Bạn nhận được mã giảm giá 100.000đ cho đơn hàng từ 500.000đ. Mã: UNIMART100',
      timestamp: '2 ngày trước',
      read: true,
      icon: Gift,
      color: 'pink',
    },
    {
      id: '8',
      type: 'system',
      title: 'Cập nhật chính sách bảo mật',
      message: 'UniMart đã cập nhật chính sách bảo mật và điều khoản sử dụng. Vui lòng xem chi tiết.',
      timestamp: '3 ngày trước',
      read: true,
      icon: AlertCircle,
      color: 'gray',
    },
    {
      id: '9',
      type: 'system',
      title: 'Nâng cấp Premium thành công',
      message: 'Tài khoản của bạn đã được nâng cấp lên gói Premium. Bắt đầu trải nghiệm ngay!',
      timestamp: '1 tuần trước',
      read: true,
      icon: TrendingUp,
      color: 'blue',
    },
  ]);

  const filterOptions = [
    { value: 'all', label: 'Tất cả', icon: Bell },
    { value: 'order', label: 'Đơn hàng', icon: ShoppingBag },
    { value: 'promotion', label: 'Khuyến mãi', icon: Tag },
    { value: 'message', label: 'Tin nhắn', icon: MessageCircle },
    { value: 'review', label: 'Đánh giá', icon: Star },
    { value: 'system', label: 'Hệ thống', icon: AlertCircle },
  ];

  const filteredNotifications = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  //   const getColorClasses = (color: string, read: boolean) => {
  //     const opacity = read ? '50' : '100';
  //     const colors: Record<string, string> = {
  //       green: `bg-green-${opacity} text-green-700`,
  //       blue: `bg-blue-${opacity} text-blue-700`,
  //       orange: `bg-orange-${opacity} text-orange-700`,
  //       purple: `bg-purple-${opacity} text-purple-700`,
  //       yellow: `bg-yellow-${opacity} text-yellow-700`,
  //       pink: `bg-pink-${opacity} text-pink-700`,
  //       gray: `bg-gray-${opacity} text-gray-700`,
  //     };
  //     return colors[color] || colors.gray;
  //   };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0A2647]">Thông báo</h1>
              <p className="text-gray-600 mt-1">
                Bạn có <span className="font-bold text-[#FF6B35]">{unreadCount}</span> thông báo chưa đọc
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-[#0A2647] hover:text-[#FF6B35] transition-colors"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filterOptions.map(option => {
              const Icon = option.icon;
              const isActive = filter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    isActive ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có thông báo</h3>
              <p className="text-gray-600">Bạn chưa có thông báo nào trong danh mục này</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const Icon = notification.icon || Bell;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-[#FF6B35]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.read
                          ? 'bg-gray-100'
                          : notification.color === 'green'
                            ? 'bg-green-100'
                            : notification.color === 'blue'
                              ? 'bg-blue-100'
                              : notification.color === 'orange'
                                ? 'bg-orange-100'
                                : notification.color === 'purple'
                                  ? 'bg-purple-100'
                                  : notification.color === 'yellow'
                                    ? 'bg-yellow-100'
                                    : notification.color === 'pink'
                                      ? 'bg-pink-100'
                                      : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          notification.read
                            ? 'text-gray-500'
                            : notification.color === 'green'
                              ? 'text-green-600'
                              : notification.color === 'blue'
                                ? 'text-blue-600'
                                : notification.color === 'orange'
                                  ? 'text-orange-600'
                                  : notification.color === 'purple'
                                    ? 'text-purple-600'
                                    : notification.color === 'yellow'
                                      ? 'text-yellow-600'
                                      : notification.color === 'pink'
                                        ? 'text-pink-600'
                                        : 'text-gray-500'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`font-bold text-gray-900 ${!notification.read ? 'text-[#0A2647]' : ''}`}>{notification.title}</h3>
                        {!notification.read && <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-2"></div>}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs font-medium text-[#0A2647] hover:text-[#FF6B35] transition-colors"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
