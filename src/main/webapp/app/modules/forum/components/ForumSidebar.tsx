import React, { useEffect } from 'react';
import { NavLink } from 'react-router';
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

  const defaultCategories = [
    { id: 'trending', name: 'Đang Trending', icon: <TrendingUp className="w-5 h-5 text-pink-500" />, path: '/forum?filter=trending' },
    { id: 'following', name: 'Đang theo dõi', icon: <Users className="w-5 h-5 text-blue-500" />, path: '/forum?filter=following' },
    { id: 'saved', name: 'Đã lưu', icon: <Star className="w-5 h-5 text-yellow-500" />, path: '/forum?filter=saved' },
  ];

  return (
    <div className="sticky top-24 bg-white/40 dark:bg-[#090418]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">Khám phá</h3>
        <ul className="space-y-1">
          {defaultCategories.map(cat => (
            <li key={cat.id}>
              <NavLink
                to={cat.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 font-medium text-sm ${
                    isActive
                      ? 'bg-white/60 dark:bg-white/10 shadow-sm text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5'
                  }`
                }
              >
                {cat.icon}
                {cat.name}
              </NavLink>
            </li>
          ))}
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
              <NavLink
                to="/forum"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 font-medium text-sm ${
                    isActive
                      ? 'bg-white/60 dark:bg-white/10 shadow-sm text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5'
                  }`
                }
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                Tất cả
              </NavLink>
            </li>
            {categoryList.map(category => (
              <li key={category.id}>
                <NavLink
                  to={`/forum?category=${category.id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 font-medium text-sm ${
                      isActive
                        ? 'bg-white/60 dark:bg-white/10 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5'
                    }`
                  }
                >
                  <Hash className="w-5 h-5 text-gray-400" />
                  {category.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
