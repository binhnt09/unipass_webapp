import React from 'react';
import { Clock, CheckCircle, Truck, Star, XCircle } from 'lucide-react';

export type OrderStatus = 'pending' | 'accepted' | 'shipping' | 'completed' | 'declined';

interface OrderStatusTabsProps {
  activeTab: OrderStatus | 'all';
  onTabChange: (tab: OrderStatus | 'all') => void;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    shipping: number;
    completed: number;
    declined: number;
  };
}

const TABS = [
  { key: 'all' as const, label: 'Tất cả', icon: null, color: 'gray' },
  { key: 'pending' as const, label: 'Chờ xử lý', icon: Clock, color: 'orange' },
  { key: 'accepted' as const, label: 'Đã xác nhận', icon: CheckCircle, color: 'blue' },
  { key: 'shipping' as const, label: 'Đang giao', icon: Truck, color: 'indigo' },
  { key: 'completed' as const, label: 'Hoàn thành', icon: Star, color: 'green' },
  { key: 'declined' as const, label: 'Đã từ chối/Hủy', icon: XCircle, color: 'red' },
];

export function OrderStatusTabs({ activeTab, onTabChange, counts }: OrderStatusTabsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-wrap gap-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          let count = 0;
          if (tab.key === 'accepted') {
            count = counts.accepted; // Sẽ bao gồm cả accepted lẫn confirmed ở trang cha truyền vào
          } else if (tab.key === 'declined') {
            count = counts.declined; // Bao gồm cả từ chối và huỷ đơn
          } else {
            count = (counts as any)[tab.key] || 0;
          }

          // Kiểm tra xem Tab có đang được kích hoạt hay không
          const isActive = activeTab === tab.key;

          const colorClasses = {
            gray: {
              active: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
              badge: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300',
            },
            orange: {
              active: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/10',
              badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
            },
            blue: {
              active: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
              badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            },
            indigo: {
              active: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10',
              badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
            },
            green: {
              active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/10',
              badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            },
            red: {
              active: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
              inactive: 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10',
              badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            },
          }[tab.color];

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                ${
                  isActive
                    ? `border-2 ${colorClasses?.active || 'border-blue-600 text-blue-600 bg-blue-50'} shadow-sm`
                    : `border-2 border-transparent ${colorClasses?.inactive || 'text-gray-500 hover:bg-gray-50'}`
                }
            `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center
                    ${isActive ? colorClasses?.badge || 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
