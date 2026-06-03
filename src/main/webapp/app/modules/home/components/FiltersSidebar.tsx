import React from 'react';
import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { ICategory } from 'app/shared/model/category.model';
import { getConditionLabel } from '../../../shared/util/condition-util';

interface FiltersSidebarProps {
  categories: ICategory[];
  selectedCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  condition: string | null;
  onConditionChange: (cond: string | null) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  onClearFilters: () => void;
}

export function FiltersSidebar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  condition,
  onConditionChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearFilters,
}: FiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    categories: true,
  });

  const conditions = [
    { id: 'Brand New', label: getConditionLabel('Brand New') },
    { id: 'Like New', label: getConditionLabel('Like New') },
    { id: 'Excellent', label: getConditionLabel('Excellent') },
    { id: 'Good', label: getConditionLabel('Good') },
    { id: 'Fair', label: getConditionLabel('Fair') },
  ];

  const toggleCondition = (id: string) => {
    if (condition === id) {
      onConditionChange(null);
    } else {
      onConditionChange(id);
    }
  };

  const toggleCategory = (id: number) => {
    if (selectedCategoryId === id) {
      onCategoryChange(null);
    } else {
      onCategoryChange(id);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 flex-shrink-0 space-y-4 hidden md:block">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-[#0A2647]">
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="font-semibold">Bộ lọc tìm kiếm</h3>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-none bg-transparent outline-none"
        >
          <h4 className="font-medium text-gray-900">Khoảng giá (đ)</h4>
          {expandedSections.price ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
        </button>

        {expandedSections.price && (
          <div className="px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Thấp nhất</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice || ''}
                  onChange={e => onPriceChange(Number(e.target.value), maxPrice)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>
              <span className="text-gray-400 mt-4">—</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Cao nhất</label>
                <input
                  type="number"
                  placeholder="Vô hạn"
                  value={maxPrice === 100000000 ? '' : maxPrice}
                  onChange={e => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : 100000000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('condition')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-none bg-transparent outline-none"
        >
          <h4 className="font-medium text-gray-900">Tình trạng</h4>
          {expandedSections.condition ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
        </button>

        {expandedSections.condition && (
          <div className="px-4 pb-4 space-y-2">
            {conditions.map(item => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={condition === item.id}
                  onChange={() => toggleCondition(item.id)}
                  className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-none bg-transparent outline-none"
        >
          <h4 className="font-medium text-gray-900">Danh mục</h4>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="px-4 pb-4 space-y-2">
            {categories.map(cat => (
              <label
                key={cat.id}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategoryId === cat.id}
                    onChange={() => toggleCategory(cat.id || 0)}
                    className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="w-full py-2 text-sm text-[#FF6B35] hover:text-[#FF5722] font-semibold transition-colors bg-white rounded-xl border border-gray-200 hover:border-[#FF6B35]/20 shadow-sm"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
}
