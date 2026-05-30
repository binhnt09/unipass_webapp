// NEW FEATURE: Advanced Notifications - Context for managing in-app notifications
// Handles notification display, marking as read, and notification history
// TODO: Integrate with backend WebSocket for real-time push notifications
// TODO: Backend should handle email and SMS notifications separately

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'order' | 'message' | 'price_drop' | 'restock' | 'review' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>; // Additional data for notification
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // NEW FEATURE: Advanced Notifications - Mock notifications for demo
  // TODO: Replace with API call to fetch notifications from backend
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'order',
      title: 'Đơn hàng đã được xác nhận',
      message: 'Đơn hàng #ORD123 đã được người bán xác nhận',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      actionUrl: '/orders?status=confirmed',
    },
    {
      id: 'n2',
      type: 'message',
      title: 'Tin nhắn mới từ Sarah M.',
      message: 'Xin chào! Sản phẩm vẫn còn hàng nhé.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      actionUrl: '/messages',
    },
    {
      id: 'n3',
      type: 'price_drop',
      title: 'Giá đã giảm! 🔥',
      message: 'Calculus Book giảm còn $38 (từ $45)',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      read: true,
      actionUrl: '/product/1',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // NEW FEATURE: Advanced Notifications - Add new notification
  // TODO: Backend will push notifications via WebSocket instead of manual add
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);

    // TODO: Backend should handle browser push notifications via Service Worker
    // TODO: Backend should handle email notifications for important events
    // TODO: Backend should handle SMS notifications for critical updates (commented out for future implementation)
  };

  // NEW FEATURE: Advanced Notifications - Mark single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    // TODO: Send API call to backend to mark as read in database
  };

  // NEW FEATURE: Advanced Notifications - Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: Send API call to backend to bulk mark as read
  };

  // NEW FEATURE: Advanced Notifications - Delete single notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // TODO: Send API call to backend to delete from database
  };

  // NEW FEATURE: Advanced Notifications - Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    // TODO: Send API call to backend to clear all notifications
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
