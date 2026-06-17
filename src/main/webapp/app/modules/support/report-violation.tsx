import React from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export const ReportViolationPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Gửi báo cáo vi phạm thành công! Ban quản trị sẽ xử lý sớm nhất.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-8 py-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Báo Cáo Vi Phạm</h1>
          <p className="text-white/90">Gửi thông tin về tài khoản lừa đảo hoặc sản phẩm sai quy định cho Unipass.</p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Đường link sản phẩm / tài khoản vi phạm</label>
            <input
              type="text"
              placeholder="Ví dụ: https://unipass.edu.vn/product/123"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả vi phạm</label>
            <textarea
              rows={5}
              placeholder="Chi tiết hành vi vi phạm..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh bằng chứng (Tùy chọn)</label>
            <input
              type="file"
              className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}
          >
            <Send className="w-5 h-5" />
            Gửi Báo Cáo
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportViolationPage;
