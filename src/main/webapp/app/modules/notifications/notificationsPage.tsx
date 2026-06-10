import React, { useState, useEffect } from 'react';
import { Bell, Package, ShoppingBag, AlertCircle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getMyNotifications,
  markAsRead as markAsReadThunk,
  markAllAsRead as markAllAsReadThunk,
  getUnreadCount,
  deleteEntity,
} from 'app/entities/notification/notification.reducer';
import dayjs from 'dayjs';
// import { INotification } from 'app/shared/model/notification.model';

type NotificationType = 'all' | 'order' | 'cart' | 'trade' | 'system';

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<NotificationType>('all');

  const notifications = useAppSelector(state => state.notification.entities) || [];
  const unreadCount = useAppSelector(state => state.notification.unreadCount) || 0;

  useEffect(() => {
    dispatch(getMyNotifications({ page: 0, size: 50, sort: 'id,desc' }));
    dispatch(getUnreadCount());
  }, [dispatch]);
  const filterOptions = [
    { value: 'all', label: 'Tất cả', icon: Bell },
    { value: 'order', label: 'Đơn hàng', icon: ShoppingBag },
    { value: 'cart', label: 'Giỏ hàng', icon: ShoppingBag },
    { value: 'trade', label: 'Đổi đồ', icon: Package },
    { value: 'system', label: 'Hệ thống', icon: AlertCircle },
  ];

  const filteredNotifications = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsReadThunk(id)).then(() => {
      dispatch(getMyNotifications({ page: 0, size: 50, sort: 'id,desc' }));
      dispatch(getUnreadCount());
    });
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadThunk()).then(() => {
      dispatch(getMyNotifications({ page: 0, size: 50, sort: 'id,desc' }));
      dispatch(getUnreadCount());
    });
  };

  const handleDeleteNotification = (id: number) => {
    dispatch(deleteEntity(id)).then(() => {
      dispatch(getMyNotifications({ page: 0, size: 50, sort: 'id,desc' }));
      dispatch(getUnreadCount());
    });
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
                onClick={handleMarkAllAsRead}
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
              const Icon =
                notification.type === 'order'
                  ? ShoppingBag
                  : notification.type === 'trade'
                    ? Package
                    : notification.type === 'cart'
                      ? ShoppingBag
                      : Bell;
              const color = notification.type === 'order' ? 'blue' : notification.type === 'trade' ? 'green' : 'gray';

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-[#FF6B35]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.isRead
                          ? 'bg-gray-100'
                          : color === 'green'
                            ? 'bg-green-100'
                            : color === 'blue'
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          notification.isRead
                            ? 'text-gray-500'
                            : color === 'green'
                              ? 'text-green-600'
                              : color === 'blue'
                                ? 'text-blue-600'
                                : 'text-gray-500'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`font-bold text-gray-900 ${!notification.isRead ? 'text-[#0A2647]' : ''}`}>{notification.title}</h3>
                        {!notification.isRead && <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-2"></div>}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{notification.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.createdAt ? dayjs(notification.createdAt).fromNow() : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id as number)}
                              className="text-xs font-medium text-[#0A2647] hover:text-[#FF6B35] transition-colors"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id as number)}
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
