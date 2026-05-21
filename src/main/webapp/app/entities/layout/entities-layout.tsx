import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight, Database } from 'lucide-react';
import EntitiesMenuItems from 'app/entities/menu';

import './entites-layout.scss';
// import './app.scss';

export const EntitiesLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`h-full bg-[#0A2647] text-gray-200 flex flex-col border-r border-[#0A2647] relative transition-all duration-300 ease-in-out shadow-lg z-20 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Nút Co / Thụt */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-7 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-full p-2 shadow-lg border-2 border-[#FF6B35] hover:scale-110 transition-all duration-200 z-50 cursor-pointer"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Header Sidebar */}
        <div className="p-4 flex items-center gap-3 border-b border-[#0a3d5c] h-20 overflow-hidden select-none">
          <div className="p-2.5 bg-[#FF6B35]/20 text-[#FF6B35] rounded-lg min-w-[44px] flex items-center justify-center">
            <Database size={22} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm tracking-wider">QUẢN LÝ</span>
              <span className="text-xs text-gray-400">Dữ liệu hệ thống</span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-80px)] ${isCollapsed ? 'px-2 py-3' : 'p-4'}`}
          data-current-path={currentPath}
        >
          <div className={isCollapsed ? 'sidebar-collapsed' : ''}>
            <EntitiesMenuItems />
          </div>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-gray-50">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Quản lý</span>
              <span className="text-gray-300">/</span>
              <span className="text-[#0A2647] font-semibold capitalize">
                {currentPath.split('/')[1]?.replace(/-/g, ' ') || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400">Hệ thống quản lý dữ liệu CRUD</div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-8 min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntitiesLayout;
