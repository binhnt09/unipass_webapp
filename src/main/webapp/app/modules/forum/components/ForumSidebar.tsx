import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/post-category/post-category.reducer';
import { Hash, TrendingUp, Users, Star } from 'lucide-react';

export const ForumSidebar = () => {
  const dispatch = useAppDispatch();
  const categoryList = useAppSelector(state => state.postCategory.entities);
  const loading = useAppSelector(state => state.postCategory.loading);

  useEffect(() => {
    dispatch(getEntities({ page: 0, size: 20, sort: 'name,asc' }));
  }, [dispatch]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get('filter');
  const currentCategory = searchParams.get('category');

  const defaultCategories = [
    { id: 'trending', name: 'Đang Trending', icon: <TrendingUp className="w-5 h-5 text-pink-500" />, path: '/forum?filter=trending' },
    { id: 'following', name: 'Đang theo dõi', icon: <Users className="w-5 h-5 text-blue-500" />, path: '/forum?filter=following' },
    { id: 'saved', name: 'Đã lưu', icon: <Star className="w-5 h-5 text-yellow-500" />, path: '/forum?filter=saved' },
  ];

  const getButtonClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 font-medium text-sm active:scale-95 cursor-pointer ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20'
        : 'text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className="sticky top-24 bg-white/40 dark:bg-[#090418]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">Khám phá</h3>
        <ul className="space-y-1">
          {defaultCategories.map(cat => {
            const isActive = currentFilter === cat.id;
            return (
              <li key={cat.id}>
                <Link to={cat.path} className={getButtonClass(isActive)}>
                  {cat.icon}
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">Chủ đề</h3>
        {loading ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            <li>
              <Link to="/forum" className={getButtonClass(!currentFilter && !currentCategory)}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  A
                </div>
                Tất cả
              </Link>
            </li>
            {categoryList.map(category => {
              const isActive = currentCategory === category.id.toString();
              return (
                <li key={category.id}>
                  <Link to={`/forum?category=${category.id}`} className={getButtonClass(isActive)}>
                    <Hash className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
