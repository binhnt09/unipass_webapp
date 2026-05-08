import React from 'react';
import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export function FiltersSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    categories: true,
  });

  const conditions = [
    { id: 'brand-new', label: 'Brand New' },
    { id: 'like-new', label: 'Like New' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
  ];

  const categories = [
    { id: 'textbooks', label: 'Textbooks', count: 234 },
    { id: 'electronics', label: 'Electronics', count: 156 },
    { id: 'furniture', label: 'Furniture', count: 89 },
    { id: 'dorm', label: 'Dorm Essentials', count: 142 },
    { id: 'vehicles', label: 'Vehicles', count: 45 },
    { id: 'clothing', label: 'Clothing', count: 98 },
    { id: 'sports', label: 'Sports & Fitness', count: 76 },
  ];

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-64 flex-shrink-0 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-[#0A2647]">
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="font-medium">Filters</h3>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          {expandedSections.price ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
        </button>

        {expandedSections.price && (
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                // eslint-disable-next-line radix
                onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              />
              <div className="flex items-center justify-between text-sm">
                <input
                  type="number"
                  value={priceRange[0]}
                  // eslint-disable-next-line radix
                  onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  // eslint-disable-next-line radix
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
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
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h4 className="font-medium text-gray-900">Condition</h4>
          {expandedSections.condition ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
        </button>

        {expandedSections.condition && (
          <div className="px-4 pb-4 space-y-2">
            {conditions.map(condition => (
              <label key={condition.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition.id)}
                  onChange={() => toggleCondition(condition.id)}
                  className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">{condition.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h4 className="font-medium text-gray-900">Categories</h4>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="px-4 pb-4 space-y-2">
            {categories.map(category => (
              <label
                key={category.id}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                <span className="text-xs text-gray-500">({category.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button className="w-full py-2 text-sm text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">Clear All Filters</button>
    </div>
  );
}
