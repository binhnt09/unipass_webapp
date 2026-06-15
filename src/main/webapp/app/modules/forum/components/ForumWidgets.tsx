import React, { useState, useEffect } from 'react';
import { Flame, Award } from 'lucide-react';
import { Link } from 'react-router';
import axios from 'axios';

export const ForumWidgets = () => {
  const [premiumSellers, setPremiumSellers] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('/api/user-profiles/public/premium-sellers')
      .then(res => setPremiumSellers(res.data))
      .catch(err => console.error('Error fetching premium sellers', err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white/40 dark:bg-[#090418]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
          <Flame className="w-5 h-5 text-orange-500" />
          Bài viết nổi bật
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="group cursor-pointer">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#00F5FF] transition-colors line-clamp-2">
                Làm sao để pass môn Đồ án Web siêu tốc mà không trượt?
              </h4>
              <p className="text-xs text-gray-500 mt-1">2 giờ trước • 45 bình luận</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/40 dark:bg-[#090418]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
          <Award className="w-5 h-5 text-yellow-500" />
          Người bán Premium
        </h3>
        <div className="space-y-4">
          {premiumSellers.map(seller => {
            const profileUrl = seller.userLogin
              ? `/profile/${seller.userLogin}`
              : seller.userId
                ? `/profile/${seller.userId}`
                : `/profile/${seller.name}`;
            return (
              <Link
                key={seller.name}
                to={profileUrl}
                className="flex items-center gap-3 hover:bg-white/50 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2D78] to-[#9B4DFF] flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                  {seller.name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[#00F5FF] transition-colors">
                    {seller.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{seller.university}</p>
                </div>
                <div className="text-xs font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-lg">
                  Premium
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
