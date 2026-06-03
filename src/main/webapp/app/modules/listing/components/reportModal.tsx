import React, { useState } from 'react';
import { X, AlertTriangle, Upload, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ReportModalProps {
  onClose: () => void;
  itemTitle?: string;
  sellerName?: string;
  targetId?: number;
  reportedLogin?: string;
}

export function ReportModal({ onClose, itemTitle, targetId, reportedLogin }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: '', label: 'Chọn lý do...' },
    { value: 'fraud-scam', label: 'Lừa đảo / Cố gắng lừa đảo' },
    { value: 'fake-item', label: 'Hàng giả hoặc hàng nhái' },
    { value: 'offensive-content', label: 'Nội dung xúc phạm' },
    { value: 'misleading-description', label: 'Mô tả sai lệch' },
    { value: 'price-gouging', label: 'Bán giá cắt cổ' },
    { value: 'prohibited-item', label: 'Hàng cấm' },
    { value: 'harassment', label: 'Quấy rối hoặc hành vi không phù hợp' },
    { value: 'other', label: 'Khác' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !details.trim()) {
      return;
    }

    try {
      setLoading(true);
      const reportPayload = {
        targetType: 'PRODUCT',
        targetId: targetId || 0,
        reason: `[${reason}] ${details}`,
        reported: reportedLogin ? { login: reportedLogin } : null,
      };

      await axios.post('/api/reports', reportPayload);
      setIsSubmitted(true);

      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#0A2647] mb-2">Báo cáo đã gửi</h3>
          <p className="text-gray-600">
            Cảm ơn bạn đã giúp giữ Unipass an toàn. Đội ngũ của chúng tôi sẽ xem xét báo cáo trong vòng 24 giờ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-100 p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A2647]">Báo cáo sản phẩm này</h2>
              {itemTitle && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{itemTitle}</p>}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Safety Notice */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0A2647] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-[#0A2647] mb-1">An toàn của bạn là ưu tiên hàng đầu</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Tất cả báo cáo đều được xem xét bởi đội ngũ an toàn. Báo cáo giả có thể dẫn đến tài khoản bị đình chỉ.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                {reasons.map(r => (
                  <option key={r.value} value={r.value} disabled={!r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Chi tiết bổ sung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              required
              rows={5}
              placeholder="Vui lòng cung cấp chi tiết cụ thể về vấn đề. Thông tin càng chi tiết, chúng tôi càng có thể điều tra tốt hơn."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">Hãy cụ thể nhất có thể</p>
              <p className="text-xs text-gray-500">{details.length} / 500</p>
            </div>
          </div>

          {/* Upload Proof */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Tải lên bằng chứng (Tùy chọn)</label>
            <p className="text-xs text-gray-600 mb-3">Tải lên ảnh chụp màn hình hoặc bằng chứng khác để hỗ trợ báo cáo của bạn</p>

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FF6B35] hover:bg-orange-50/30 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {uploadedFiles.length > 0 ? `${uploadedFiles.length} tệp đã chọn` : 'Nhấn để tải lên ảnh chụp màn hình'}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!reason || !details.trim() || loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all shadow-md ${
                !reason || !details.trim() || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-[#FF6B35] hover:from-red-600 hover:to-[#FF5722] text-white'
              }`}
            >
              {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center mt-4">Danh tính của bạn sẽ được giữ bí mật trong suốt quá trình điều tra.</p>
        </form>
      </div>
    </div>
  );
}
