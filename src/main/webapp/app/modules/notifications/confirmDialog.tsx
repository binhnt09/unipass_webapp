import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  type?: 'success' | 'danger' | 'warning' | 'info'; // Dùng để đổi màu UI
  title: string;
  message: string;
  note?: string; // Ghi chú chữ đỏ (có hoặc không)
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  type = 'success',
  title,
  message,
  note,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy bỏ',
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  // Tự động cấu hình UI (Icon và Màu sắc) dựa trên biến 'type'
  const config = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500 bg-green-100',
      btnColor: 'bg-[#FF6B35] hover:bg-[#FF5722] text-white shadow-orange-500/30', // Màu cam chủ đạo của app
    },
    danger: {
      icon: Trash2,
      iconColor: 'text-red-500 bg-red-100',
      btnColor: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500 bg-yellow-100',
      btnColor: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/30',
    },
    info: {
      icon: AlertCircle,
      iconColor: 'text-blue-500 bg-blue-100',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30',
    },
  };

  const activeConfig = config[type];
  const Icon = activeConfig.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
        {/* Icon Header tự động đổi màu */}
        <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto ${activeConfig.iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Nội dung động */}
        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="text-center text-gray-600 dark:text-gray-300 mb-6 space-y-2">
          <p>{message}</p>
          {note && <p className="text-sm text-red-500 font-medium">*{note}</p>}
        </div>

        {/* Nút bấm */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors shadow-lg ${activeConfig.btnColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
