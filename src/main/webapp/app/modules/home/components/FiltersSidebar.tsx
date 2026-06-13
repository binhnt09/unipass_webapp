import React from 'react';
import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

/* Shared glass panel style */
const glassPanel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(0,245,255,0.2)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '0.85rem',
  overflow: 'hidden',
};

const glassPanelHover: React.CSSProperties = {
  borderColor: 'rgba(0,245,255,0.4)',
  boxShadow: '0 4px 25px rgba(0,245,255,0.1)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(0,245,255,0.25)',
  borderRadius: '0.6rem',
  fontSize: '0.85rem',
  textAlign: 'center',
  color: '#1e293b',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
};

const sectionReveal = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

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
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const conditions = [
    { id: 'Brand New', label: getConditionLabel('Brand New') },
    { id: 'Like New', label: getConditionLabel('Like New') },
    { id: 'Excellent', label: getConditionLabel('Excellent') },
    { id: 'Good', label: getConditionLabel('Good') },
    { id: 'Fair', label: getConditionLabel('Fair') },
  ];

  const toggleCondition = (id: string) => {
    onConditionChange(condition === id ? null : id);
  };

  const toggleCategory = (id: number) => {
    onCategoryChange(selectedCategoryId === id ? null : id);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const panelStyle = (key: string): React.CSSProperties => ({
    ...glassPanel,
    ...(hoveredPanel === key ? glassPanelHover : {}),
    transition: 'border-color 0.25s ease',
  });

  /* Shared section toggle button style */
  const toggleBtnStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 1rem',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    color: '#334155',
    fontWeight: 700,
    fontSize: '0.9rem',
    transition: 'background 0.2s ease',
  };

  return (
    <motion.div
      id="filters-sidebar"
      className="w-64 flex-shrink-0 space-y-3 hidden md:block"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Header ── */}
      <div style={panelStyle('header')} onMouseEnter={() => setHoveredPanel('header')} onMouseLeave={() => setHoveredPanel(null)}>
        <div className="flex items-center gap-2 p-4" style={{ color: '#00D4DD' }}>
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="font-bold" style={{ color: '#1e293b', fontSize: '0.95rem' }}>
            Bộ lọc tìm kiếm
          </h3>
        </div>
      </div>

      {/* ── Price Range ── */}
      <div style={panelStyle('price')} onMouseEnter={() => setHoveredPanel('price')} onMouseLeave={() => setHoveredPanel(null)}>
        <button onClick={() => toggleSection('price')} style={toggleBtnStyle}>
          <span>Khoảng giá (đ)</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" style={{ color: '#00D4DD' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: '#94a3b8' }} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {expandedSections.price && (
            <motion.div variants={sectionReveal} initial="hidden" animate="visible" exit="exit" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0 1rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Thấp nhất
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice || ''}
                    onChange={e => onPriceChange(Number(e.target.value), maxPrice)}
                    style={inputStyle}
                    onFocus={e => {
                      e.target.style.borderColor = '#00D4DD';
                      e.target.style.background = '#fff';
                      e.target.style.boxShadow = '0 0 10px rgba(0,212,221,0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(0,245,255,0.25)';
                      e.target.style.background = 'rgba(255,255,255,0.85)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <span style={{ color: '#94a3b8', marginTop: '1.2rem', fontWeight: 600 }}>—</span>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Cao nhất
                  </label>
                  <input
                    type="number"
                    placeholder="Vô hạn"
                    value={maxPrice === 100000000 ? '' : maxPrice}
                    onChange={e => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : 100000000)}
                    style={inputStyle}
                    onFocus={e => {
                      e.target.style.borderColor = '#00D4DD';
                      e.target.style.background = '#fff';
                      e.target.style.boxShadow = '0 0 10px rgba(0,212,221,0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(0,245,255,0.25)';
                      e.target.style.background = 'rgba(255,255,255,0.85)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Condition ── */}
      <div style={panelStyle('condition')} onMouseEnter={() => setHoveredPanel('condition')} onMouseLeave={() => setHoveredPanel(null)}>
        <button onClick={() => toggleSection('condition')} style={toggleBtnStyle}>
          <span>Tình trạng</span>
          {expandedSections.condition ? (
            <ChevronUp className="w-4 h-4" style={{ color: '#00D4DD' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: '#94a3b8' }} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {expandedSections.condition && (
            <motion.div variants={sectionReveal} initial="hidden" animate="visible" exit="exit" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {conditions.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      padding: '0.45rem 0.5rem',
                      borderRadius: '0.5rem',
                      transition: 'background 0.15s ease',
                      background: condition === item.id ? 'rgba(0,212,221,0.15)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (condition !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = condition === item.id ? 'rgba(0,212,221,0.15)' : 'transparent';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={condition === item.id}
                      onChange={() => toggleCondition(item.id)}
                      style={{ accentColor: '#00D4DD', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: condition === item.id ? 600 : 500,
                        color: condition === item.id ? '#0284c7' : '#475569',
                      }}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Categories ── */}
      <div style={panelStyle('categories')} onMouseEnter={() => setHoveredPanel('categories')} onMouseLeave={() => setHoveredPanel(null)}>
        <button onClick={() => toggleSection('categories')} style={toggleBtnStyle}>
          <span>Danh mục</span>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" style={{ color: '#00D4DD' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: '#94a3b8' }} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {expandedSections.categories && (
            <motion.div variants={sectionReveal} initial="hidden" animate="visible" exit="exit" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {categories.map(cat => (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      padding: '0.45rem 0.5rem',
                      borderRadius: '0.5rem',
                      transition: 'background 0.15s ease',
                      background: selectedCategoryId === cat.id ? 'rgba(0,212,221,0.15)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (selectedCategoryId !== cat.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background =
                        selectedCategoryId === cat.id ? 'rgba(0,212,221,0.15)' : 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedCategoryId === cat.id}
                        onChange={() => toggleCategory(cat.id || 0)}
                        style={{ accentColor: '#00D4DD', width: '15px', height: '15px', cursor: 'pointer' }}
                      />
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: selectedCategoryId === cat.id ? 600 : 500,
                          color: selectedCategoryId === cat.id ? '#0284c7' : '#475569',
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Clear Filters Button ── */}
      <motion.button
        onClick={onClearFilters}
        className="w-full py-2.5 text-sm font-bold rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(0,212,221,0.4)',
          color: '#0284c7',
          cursor: 'pointer',
          letterSpacing: '0.01em',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
        whileHover={{
          background: '#fff',
          borderColor: 'rgba(0,212,221,0.7)',
          boxShadow: '0 4px 15px rgba(0,212,221,0.15)',
        }}
        whileTap={{ scale: 0.97 }}
      >
        Xóa tất cả bộ lọc
      </motion.button>
    </motion.div>
  );
}
