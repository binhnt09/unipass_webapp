// NEW FEATURE: Cancel Order - Modal for cancelling orders with reason selection
// Allows users to cancel pending orders with required reason
// Sends notification to seller and processes refund if payment was made
// TODO: Backend API call to /api/orders/:id/cancel

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
}

// NEW FEATURE: Cancel Order - Predefined cancel reasons
const CANCEL_REASONS = [
  { value: 'found_better_price', label: 'Tìm được giá tốt hơn' },
  { value: 'changed_mind', label: 'Đổi ý không muốn mua nữa' },
  { value: 'ordered_wrong', label: 'Đặt nhầm sản phẩm' },
  { value: 'too_expensive', label: 'Giá quá cao' },
  { value: 'delivery_too_long', label: 'Thời gian giao hàng quá lâu' },
  { value: 'seller_not_responsive', label: 'Người bán không phản hồi' },
  { value: 'other', label: 'Lý do khác' },
];

export function CancelOrderModal({ isOpen, orderNumber, onClose, onConfirm }: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // NEW FEATURE: Cancel Order - Handle cancel submission
  const handleCancel = async () => {
    if (!selectedReason) {
      alert('Vui lòng chọn lý do hủy đơn');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to backend
      // await api.post(`/api/orders/${orderId}/cancel`, {
      //   reason: selectedReason,
      //   notes: notes
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onConfirm(selectedReason, notes);
      onClose();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Hủy đơn hàng</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Lưu ý:</strong> Đơn hàng #{orderNumber} sẽ bị hủy vĩnh viễn. Nếu đã thanh toán, tiền sẽ được hoàn lại trong 3-5 ngày
              làm việc.
            </p>
          </div>

          {/* Reason selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CANCEL_REASONS.map(reason => (
                <label
                  key={reason.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={e => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-900 dark:text-gray-200">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ghi chú thêm (không bắt buộc)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Chia sẻ thêm chi tiết nếu bạn muốn..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Quay lại
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
