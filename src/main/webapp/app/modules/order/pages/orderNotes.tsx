// NEW FEATURE: Order Notes/Comments - Private notes for user's own orders
// Users can add personal notes about their orders (visible only to them)
// Auto-saves notes when user stops typing (debounced)
// Useful for: meeting time, product condition notes, seller instructions
// TODO: Backend API to save notes to database

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StickyNote, Save, Check } from 'lucide-react';

interface OrderNotesProps {
  orderId: string;
  initialNotes?: string;
  onSave?: (notes: string) => void;
}

// NEW FEATURE: Order Notes/Comments - Main component
export function OrderNotes({ orderId, initialNotes = '', onSave }: OrderNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // NEW FEATURE: Order Notes - Auto-save with debounce (500ms after user stops typing)
  useEffect(() => {
    // Don't save if notes haven't changed from initial
    if (notes === initialNotes) return;

    // Debounce: wait 500ms after user stops typing
    const timeoutId = setTimeout(() => {
      handleSaveNotes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [notes]);

  // NEW FEATURE: Order Notes - Save notes to backend
  const handleSaveNotes = async () => {
    setIsSaving(true);

    try {
      // Actual API call to backend
      await axios.put(`/api/orders/${orderId}/notes`, { note: notes });

      setLastSaved(new Date());
      onSave?.(notes);

      console.warn(`[Order Notes] Saved notes for order ${orderId}:`, notes);
    } catch (error) {
      console.error('[Order Notes] Failed to save:', error);
      alert('Không thể lưu ghi chú. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return null;

    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return lastSaved.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-[#0A2647] dark:text-white">Ghi chú của tôi</h3>
        </div>

        {/* Save indicator */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <Save className="w-4 h-4 text-gray-400 animate-pulse" />
              <span className="text-gray-500 dark:text-gray-400">Đang lưu...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-gray-500 dark:text-gray-400">Đã lưu {getLastSavedText()}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Notes textarea */}
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Thêm ghi chú riêng về đơn hàng này...&#10;&#10;Ví dụ:&#10;• Hẹn gặp 3pm tại thư viện tầng 2&#10;• Nhớ kiểm tra kỹ sản phẩm trước khi nhận&#10;• Đã thỏa thuận giá với seller"
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-yellow-50 dark:bg-yellow-900/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none transition-colors"
        style={{ minHeight: '120px' }}
      />

      {/* Info text */}
      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="mt-0.5">ℹ️</span>
        <p>Ghi chú này chỉ bạn nhìn thấy. Người bán không thể xem được. Ghi chú được tự động lưu khi bạn ngừng gõ.</p>
      </div>

      {/* Character count */}
      <div className="mt-2 text-right">
        <span className={`text-xs ${notes.length > 500 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
          {notes.length}/1000 ký tự
        </span>
      </div>
    </div>
  );
}
