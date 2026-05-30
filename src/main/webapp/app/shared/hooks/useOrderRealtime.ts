// NEW FEATURE: Real-time Status Updates - WebSocket hook for live order tracking
// Listens to order status changes and updates UI in real-time
// Sends browser notifications when order status changes
// TODO: Backend WebSocket server at /ws/orders/:id

import { useEffect, useState } from 'react';

interface OrderUpdate {
  type: 'STATUS_CHANGE' | 'TRACKING_UPDATE' | 'MESSAGE_FROM_SELLER';
  orderId: string;
  status?: 'pending' | 'shipping' | 'completed' | 'cancelled';
  statusText?: string;
  trackingSteps?: any[];
  message?: string;
  timestamp: string;
}

interface UseOrderRealtimeOptions {
  orderId: string;
  onStatusChange?: (update: OrderUpdate) => void;
  onTrackingUpdate?: (update: OrderUpdate) => void;
  onMessage?: (update: OrderUpdate) => void;
}

// NEW FEATURE: Real-time Status Updates - Custom hook for WebSocket connection
export function useOrderRealtime({ orderId, onStatusChange, onTrackingUpdate, onMessage }: UseOrderRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<OrderUpdate | null>(null);

  useEffect(() => {
    // TODO: Replace with actual WebSocket connection to backend
    // const wsUrl = `${process.env.REACT_APP_WS_URL}/orders/${orderId}`;
    // const socket = new WebSocket(wsUrl);

    // MOCK: Simulate WebSocket connection for development
    console.warn(`[WebSocket Mock] Connecting to order ${orderId}...`);
    setIsConnected(true);

    // NEW FEATURE: Real-time Status Updates - Simulate receiving updates
    // TODO: Remove this mock and use real WebSocket when backend is ready
    const mockUpdates: OrderUpdate[] = [
      {
        type: 'STATUS_CHANGE',
        orderId,
        status: 'shipping',
        statusText: 'ĐANG GIAO HÀNG',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'TRACKING_UPDATE',
        orderId,
        trackingSteps: [
          { label: 'Đơn hàng đã được đặt', time: '23/03/2024 14:30', completed: true },
          { label: 'Người bán đã xác nhận', time: '23/03/2024 15:00', completed: true },
          { label: 'Đang giao hàng', time: '24/03/2024 09:00', completed: true },
          { label: 'Đã giao hàng', time: '', completed: false },
        ],
        timestamp: new Date().toISOString(),
      },
    ];

    // Simulate receiving updates every 10 seconds (for demo)
    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex < mockUpdates.length) {
        const update = mockUpdates[updateIndex];
        handleUpdate(update);
        updateIndex++;
      }
    }, 10000);

    // NEW FEATURE: Real-time Status Updates - Handle incoming WebSocket messages
    const handleUpdate = (update: OrderUpdate) => {
      console.warn('[WebSocket Mock] Received update:', update);
      setLastUpdate(update);

      // Route to appropriate callback
      switch (update.type) {
        case 'STATUS_CHANGE':
          onStatusChange?.(update);
          // Show browser notification
          showBrowserNotification('Cập nhật đơn hàng', `Đơn hàng #${orderId.slice(-6)} ${update.statusText}`);
          break;
        case 'TRACKING_UPDATE':
          onTrackingUpdate?.(update);
          break;
        case 'MESSAGE_FROM_SELLER':
          onMessage?.(update);
          showBrowserNotification('Tin nhắn mới từ người bán', update.message || 'Bạn có tin nhắn mới');
          break;
        default:
          break;
      }
    };

    // TODO: Replace mock with real WebSocket event handlers
    // socket.onopen = () => {
    //   console.log('[WebSocket] Connected');
    //   setIsConnected(true);
    // };
    //
    // socket.onmessage = (event) => {
    //   const update = JSON.parse(event.data) as OrderUpdate;
    //   handleUpdate(update);
    // };
    //
    // socket.onerror = (error) => {
    //   console.error('[WebSocket] Error:', error);
    //   setIsConnected(false);
    // };
    //
    // socket.onclose = () => {
    //   console.log('[WebSocket] Disconnected');
    //   setIsConnected(false);
    // };

    // Cleanup
    return () => {
      clearInterval(interval);
      // socket?.close();
      console.warn(`[WebSocket Mock] Disconnected from order ${orderId}`);
    };
  }, [orderId, onStatusChange, onTrackingUpdate, onMessage]);

  return { isConnected, lastUpdate };
}

// NEW FEATURE: Real-time Status Updates - Browser notification helper
function showBrowserNotification(title: string, body: string) {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return;
  }

  // Request permission if not granted
  if (Notification.permission === 'granted') {
    void new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'order-update', // Prevents multiple notifications
      requireInteraction: false,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        void new Notification(title, { body, icon: '/favicon.ico' });
      }
    });
  }
}
