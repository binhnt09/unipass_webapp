import { Laptop, Home, BookOpen, Armchair, Car, Shirt, Trophy, Package, LucideIcon } from 'lucide-react';
import React from 'react';
import { ICategory } from 'app/shared/model/category.model';

interface BrowsingTabsProps {
  categories: ICategory[];
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
}

const getCategoryIcon = (name: string): LucideIcon => {
  const norm = name.toLowerCase();
  if (
    norm.includes('điện tử') ||
    norm.includes('electronic') ||
    norm.includes('máy tính') ||
    norm.includes('laptop') ||
    norm.includes('điện thoại')
  )
    return Laptop;
  if (norm.includes('gia dụng') || norm.includes('thiết bị') || norm.includes('dorm') || norm.includes('home')) return Home;
  if (norm.includes('sách') || norm.includes('vở') || norm.includes('textbook') || norm.includes('tài liệu') || norm.includes('học tập'))
    return BookOpen;
  if (norm.includes('nội thất') || norm.includes('bàn') || norm.includes('ghế') || norm.includes('furniture') || norm.includes('giường'))
    return Armchair;
  if (norm.includes('xe') || norm.includes('phương tiện') || norm.includes('vehicle') || norm.includes('motor')) return Car;
  if (norm.includes('quần áo') || norm.includes('giày') || norm.includes('thời trang') || norm.includes('clothing') || norm.includes('mũ'))
    return Shirt;
  if (norm.includes('thể thao') || norm.includes('dã ngoại') || norm.includes('sport') || norm.includes('fitness')) return Trophy;
  return Package;
};

export function BrowsingTabs({ categories, activeCategoryId, onCategoryChange }: BrowsingTabsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 overflow-x-auto">
      <div className="flex items-center gap-3 min-w-max">
        {/* All Categories Tab */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
            activeCategoryId === null ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Tất cả</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.name || '');
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id || null)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeCategoryId === cat.id ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
