import { Laptop, Home, BookOpen, Armchair, Car, Shirt, Trophy, Package, LucideIcon } from 'lucide-react';
import React from 'react';
import { motion } from 'motion/react';
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

/* Framer Motion stagger variants */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.5 } },
};

export function BrowsingTabs({ categories, activeCategoryId, onCategoryChange }: BrowsingTabsProps) {
  return (
    <motion.div
      id="browsing-tabs-wrapper"
      className="rounded-xl p-2 mb-6 overflow-x-auto"
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(0,245,255,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="flex items-center gap-2 min-w-max" variants={containerVariants} initial="hidden" animate="visible">
        {/* All Categories Tab */}
        <motion.button
          variants={tabVariants}
          onClick={() => onCategoryChange(null)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
          style={
            activeCategoryId === null
              ? {
                  background: 'linear-gradient(135deg, #00F5FF 0%, #9B4DFF 100%)',
                  color: '#090418',
                  boxShadow: '0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(155,77,255,0.15)',
                  fontWeight: 600,
                }
              : {
                  background: 'rgba(255,255,255,0.85)',
                  color: '#475569',
                  border: '1px solid rgba(0,245,255,0.15)',
                }
          }
          whileHover={activeCategoryId !== null ? { background: '#fff', color: '#0ea5e9', borderColor: 'rgba(0,245,255,0.4)' } : {}}
          whileTap={{ scale: 0.96 }}
        >
          <Package className="w-4 h-4" />
          <span>Tất cả</span>
        </motion.button>

        {/* Dynamic Categories */}
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.name || '');
          const isActive = activeCategoryId === cat.id;
          return (
            <motion.button
              key={cat.id}
              variants={tabVariants}
              onClick={() => onCategoryChange(cat.id || null)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #00F5FF 0%, #9B4DFF 100%)',
                      color: '#090418',
                      boxShadow: '0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(155,77,255,0.15)',
                      fontWeight: 600,
                    }
                  : {
                      background: 'rgba(255,255,255,0.85)',
                      color: '#475569',
                      border: '1px solid rgba(0,245,255,0.15)',
                    }
              }
              whileHover={!isActive ? { background: '#fff', color: '#0ea5e9', borderColor: 'rgba(0,245,255,0.4)' } : {}}
              whileTap={{ scale: 0.96 }}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
