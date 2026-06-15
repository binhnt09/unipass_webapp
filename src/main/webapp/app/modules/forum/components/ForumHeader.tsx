import React from 'react';
import { Users, Search, Plus, ChevronDown } from 'lucide-react';
import { useAppSelector } from 'app/config/store';
import { useLocation, Link } from 'react-router';

interface ForumHeaderProps {
  onCreatePost: () => void;
}

export const ForumHeader: React.FC<ForumHeaderProps> = ({ onCreatePost }) => {
  const categories = useAppSelector(state => state.postCategory.entities);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');

  const isAllActive = !currentCategory && !currentFilter;

  const getPillStyle = (index: number, isActive: boolean) => {
    const styles = [
      {
        bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
        activeRing: 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-[#090418]',
      },
      {
        bg: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        activeRing: 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-[#090418]',
      },
      {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        activeRing: 'ring-2 ring-yellow-500 ring-offset-2 dark:ring-offset-[#090418]',
      },
      {
        bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
        activeRing: 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#090418]',
      },
      {
        bg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        activeRing: 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-[#090418]',
      },
    ];
    const style = styles[index % styles.length];
    return `px-5 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 ${style.bg} ${isActive ? style.activeRing : ''}`;
  };

  return (
    <div className="mb-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cộng đồng UniPass</h1>
            <p className="text-sm text-gray-500">Nơi sinh viên chia sẻ kinh nghiệm & cảnh báo thật</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm bài viết..."
              className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#00F5FF]/50 outline-none text-gray-800 dark:text-gray-200 transition-shadow"
            />
          </div>

          <div className="relative shrink-0 hidden sm:block">
            <select className="appearance-none bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
              <option>Mới nhất</option>
              <option>Phổ biến</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={onCreatePost}
            className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Đăng bài
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex flex-wrap gap-3 border-b border-gray-200 dark:border-white/10 pb-6">
        <Link
          to="/forum"
          className={`px-5 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 ${isAllActive ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#090418] shadow-md' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}
        >
          🌐 Tất cả
        </Link>
        {categories.map((cat, index) => {
          const isActive = currentCategory === cat.id.toString();
          const emojis = ['💼', '⚠️', '💡', '❓', '🔥', '📚'];
          const emoji = emojis[index % emojis.length];
          return (
            <Link key={cat.id} to={`/forum?category=${cat.id}`} className={getPillStyle(index, isActive)}>
              {emoji} {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
