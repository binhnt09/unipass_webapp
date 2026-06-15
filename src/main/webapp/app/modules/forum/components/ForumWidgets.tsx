import React from 'react';
import { Flame, Award } from 'lucide-react';

export const ForumWidgets = () => {
  const topContributors = [
    { id: 1, name: 'Nguyễn Văn A', role: 'Sinh viên IT', points: 1250, avatar: 'A' },
    { id: 2, name: 'Trần Thị B', role: 'Sinh viên Marketing', points: 980, avatar: 'B' },
    { id: 3, name: 'Lê Hoàng C', role: 'Sinh viên Design', points: 850, avatar: 'C' },
  ];

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
          Top Đóng góp
        </h3>
        <div className="space-y-4">
          {topContributors.map(user => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2D78] to-[#9B4DFF] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</h4>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
              <div className="text-xs font-bold text-[#9B4DFF] bg-[#9B4DFF]/10 px-2 py-1 rounded-lg">{user.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
