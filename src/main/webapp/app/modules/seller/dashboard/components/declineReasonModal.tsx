// NEW FEATURE: Decline Order Request - Modal for seller to decline buyer's purchase request
// Seller must select a reason and optionally add notes
// Helps maintain transparency and professionalism

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DeclineReasonModalProps {
  isOpen: boolean;
  buyerName: string;
  productTitle: string;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => Promise<void> | void;
}

const DECLINE_REASONS = [
  { value: 'already_sold', label: 'Sản phẩm đã bán cho người khác' },
  { value: 'not_available', label: 'Sản phẩm không còn sẵn' },
  { value: 'buyer_location', label: 'Người mua ngoài khu vực giao hàng' },
  { value: 'suspicious', label: 'Nghi ngờ gian lận hoặc spam' },
  { value: 'changed_mind', label: 'Thay đổi ý định không bán nữa' },
  { value: 'price_negotiation', label: 'Không đồng ý về giá' },
  { value: 'other', label: 'Lý do khác' },
];

export function DeclineReasonModal({ isOpen, buyerName, productTitle, onClose, onConfirm }: DeclineReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('Vui lòng chọn lý do từ chối');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, notes);
      // Reset form
      setSelectedReason('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('[DeclineReasonModal] Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setNotes('');
      onClose();
    }
  };

  //   const selectedReasonLabel = DECLINE_REASONS.find(r => r.value === selectedReason)?.label;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Từ chối yêu cầu mua</h2>
              <p className="text-white/90 text-sm mt-1">Người mua: {buyerName}</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Product info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sản phẩm:</p>
            <p className="font-medium text-gray-900 dark:text-white">{productTitle}</p>
          </div>

          {/* Reason selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DECLINE_REASONS.map(reason => (
                <label
                  key={reason.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedReason === reason.value
                      ? 'border-[#FF6B35] bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="decline-reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={e => setSelectedReason(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional notes */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Ghi chú thêm (tùy chọn)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Thêm lời nhắn cho người mua (ví dụ: thời gian có thể bán lại, đề xuất sản phẩm khác...)"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            />
            <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{notes.length}/500 ký tự</div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-bold mb-1">Lưu ý:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Người mua sẽ nhận được thông báo về việc từ chối</li>
                  <li>Lý do từ chối sẽ được gửi đến người mua</li>
                  <li>Hành động này không thể hoàn tác</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
}
