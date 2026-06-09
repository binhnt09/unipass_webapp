import React, { useState, useEffect } from 'react';
import { MessageSquare, Trophy, Info, Award, Star, TrendingUp } from 'lucide-react';
import axios from 'axios';

export function AugmentedFeatures() {
  const [premiumSellers, setPremiumSellers] = useState<{ name: string; university: string; sales: number; rating: number }[]>([]);

  useEffect(() => {
    axios
      .get('/api/user-profiles/public/premium-sellers')
      .then(res => setPremiumSellers(res.data))
      .catch(err => console.error('Error fetching premium sellers', err));
  }, []);

  return (
    <div className="w-80 space-y-6 hidden lg:block">
      {/* AI Chat Support Widget */}
      <div className="bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium">Hỗ trợ AI Chat</h3>
            <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <p className="text-sm text-white/90 mb-4">
          Có thắc mắc? Trợ lý AI của chúng tôi có thể giúp bạn với việc mua bán và các vấn đề tài khoản 24/7.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
          className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
        >
          Bắt đầu trò chuyện
        </button>
      </div>

      {/* Premium Sellers Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-[#FF6B35]" />
          <h3 className="font-medium text-gray-900">Người bán Premium</h3>
        </div>
        <div className="space-y-3">
          {premiumSellers.map((seller, index) => (
            <div key={seller.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-center w-6 h-6">
                {index === 0 && <Award className="w-5 h-5 text-[#FFD700]" />}
                {index === 1 && <Award className="w-5 h-5 text-[#C0C0C0]" />}
                {index === 2 && <Award className="w-5 h-5 text-[#CD7F32]" />}
                {index > 2 && <span className="text-sm font-medium text-gray-500">{index + 1}</span>}
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {seller.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">{seller.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#FF6B35] text-[#FF6B35]" />
                    <span className="text-xs font-medium text-gray-700">{seller.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{seller.university}</span>
                  <span className="text-xs text-gray-500">{seller.sales} sales</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">
            Xem bảng xếp hạng đầy đủ
          </button>
        </div>
      </div>

      {/* Reputation Score Explainer */}
      <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-[#FF6B35]/20 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-[#0A2647]" />
          <h3 className="font-medium text-gray-900">Điểm uy tín</h3>
        </div>
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          Điểm uy tín của bạn được tính dựa trên giao dịch hoàn thành, đánh giá từ người mua/bán và sự tham gia cộng đồng.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Cách cải thiện</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Hoàn thành giao dịch nhanh chóng</li>
                <li>• Duy trì giao tiếp rõ ràng</li>
                <li>• Cung cấp mô tả sản phẩm chính xác</li>
                <li>• Tham gia với cộng đồng</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-[#0A2647] hover:bg-[#144272] text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors">
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  );
}
