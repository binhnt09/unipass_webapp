import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelSellerOrderModalProps {
  isOpen: boolean;
  orderNumber: string;
  buyerName: string;
  productTitle: string;
  orderStatus: 'accepted' | 'confirmed' | 'shipping';
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => Promise<void> | void;
}

const CANCEL_REASONS = [
  { value: 'buyer_no_payment', label: 'Người mua không thanh toán' },
  { value: 'buyer_no_contact', label: 'Không liên lạc được với người mua' },
  { value: 'product_damaged', label: 'Sản phẩm bị hỏng/mất trước khi giao' },
  { value: 'out_of_stock', label: 'Sản phẩm không còn sẵn' },
  { value: 'personal_reason', label: 'Lý do cá nhân khẩn cấp' },
  { value: 'buyer_request', label: 'Theo yêu cầu của người mua' },
  { value: 'other', label: 'Lý do khác' },
];

export function CancelSellerOrderModal({
  isOpen,
  orderNumber,
  buyerName,
  productTitle,
  orderStatus,
  onClose,
  onConfirm,
}: CancelSellerOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [understood, setUnderstood] = useState(false);

  if (!isOpen) return null;

  const isPaid = orderStatus === 'confirmed' || orderStatus === 'shipping';

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('Vui lòng chọn lý do hủy đơn');
      return;
    }

    if (isPaid && !understood) {
      alert('Vui lòng xác nhận bạn đã hiểu về việc hoàn tiền');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, notes);
      // Reset form
      setSelectedReason('');
      setNotes('');
      setUnderstood(false);
      onClose();
    } catch (error) {
      console.error('[CancelSellerOrderModal] Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setNotes('');
      setUnderstood(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Hủy đơn hàng</h2>
              <p className="text-white/90 text-sm mt-1">Đơn hàng #{orderNumber}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Order info */}
          <div className="mb-6 space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Người mua:</p>
              <p className="font-bold text-gray-900 dark:text-white">{buyerName}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sản phẩm:</p>
              <p className="font-medium text-gray-900 dark:text-white">{productTitle}</p>
            </div>
          </div>

          {/* Reputation warning */}
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-bold mb-2">⚠️ Cảnh báo quan trọng:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Hủy đơn sau khi đã xác nhận sẽ <strong>ảnh hưởng xấu đến uy tín</strong> của bạn
                  </li>
                  <li>Điểm đánh giá của bạn có thể bị giảm</li>
                  {isPaid && (
                    <li className="text-red-900 dark:text-red-100 font-bold">
                      Người mua đã thanh toán - Tiền sẽ được hoàn lại trong 3-5 ngày
                    </li>
                  )}
                  <li>Người mua sẽ nhận được thông báo và lý do hủy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reason selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CANCEL_REASONS.map(reason => (
                <label
                  key={reason.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={e => setSelectedReason(e.target.value)}
                    className="mt-1 w-4 h-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional notes */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Chi tiết lý do <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Giải thích cụ thể lý do hủy đơn để người mua hiểu rõ tình huống..."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            />
            <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{notes.length}/1000 ký tự</div>
          </div>

          {/* Confirmation checkbox for paid orders */}
          {isPaid && (
            <div className="mb-6">
              <label className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={e => setUnderstood(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="flex-1 text-sm text-gray-900 dark:text-white">
                  Tôi hiểu rằng người mua đã thanh toán và tiền sẽ được hoàn lại. Tôi chấp nhận trách nhiệm về việc hủy đơn này.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Quay lại
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || !notes.trim() || (isPaid && !understood) || isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy đơn'}
          </button>
        </div>
      </div>
    </div>
  );
}
