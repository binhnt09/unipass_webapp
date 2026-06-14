import './home.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { FiltersSidebar } from './components/FiltersSidebar';
import { BrowsingTabs } from './components/BrowsingTabs';
import { ProductGrid } from '../listing/components/productGrid';
import { AugmentedFeatures } from '../chatboxAI/AugmentedFeatures';
import { ICategory } from 'app/shared/model/category.model';
import { IProduct } from 'app/shared/model/product.model';

export const Home = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000); // 100M VND default max
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Count active filters for badge
  const activeFilterCount = [selectedCategoryId !== null, condition !== null, minPrice > 0, maxPrice < 100000000].filter(Boolean).length;

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    axios
      .get<ICategory[]>('/api/categories')
      .then(res => {
        if (isMounted) {
          setCategories(res.data || []);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products reactively
  useEffect(() => {
    let isMounted = true;
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        // Crucial status filter: always AVAILABLE
        params.append('status.equals', 'AVAILABLE');

        if (searchKeyword.trim() !== '') {
          params.append('name.contains', searchKeyword.trim());
        }
        if (selectedCategoryId !== null) {
          params.append('categoryId.equals', selectedCategoryId.toString());
        }
        if (condition !== null) {
          params.append('condition.equals', condition);
        }

        if (minPrice > 0) {
          params.append('price.greaterThanOrEqual', minPrice.toString());
        }
        if (maxPrice < 100000000) {
          params.append('price.lessThanOrEqual', maxPrice.toString());
        }

        const resProducts = await axios.get<IProduct[]>(`/api/products?${params.toString()}&page=0&size=50`);
        const fetchedProducts = resProducts.data || [];
        const productIds = fetchedProducts.map((p: any) => p.id).filter(Boolean);

        let allImages: any[] = [];
        if (productIds.length > 0) {
          const resImages = await axios.get<any[]>(`/api/product-images?productId.in=${productIds.join(',')}`);
          allImages = resImages.data || [];
        }

        if (isMounted) {
          const mapped = fetchedProducts.map((prod: any) => {
            const productImages =
              prod.productImages && prod.productImages.length > 0
                ? prod.productImages
                : allImages.filter(img => img.product?.id === prod.id);
            const primaryImage = productImages.find((img: any) => img.isPrimary) || productImages[0];
            let imageUrl = primaryImage ? primaryImage.imageUrl : null;
            if (imageUrl && imageUrl.startsWith('uploads/')) {
              imageUrl = '/' + imageUrl;
            }
            return {
              ...prod,
              imageUrl,
            };
          });

          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const handler = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(handler);
    };
  }, [searchKeyword, selectedCategoryId, condition, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedCategoryId(null);
    setCondition(null);
    setMinPrice(0);
    setMaxPrice(100000000);
  };

  return (
    /* ── Home Page Root: Ocean Campus light background ── */
    <div
      id="home-page-root"
      className="home-content-wrapper min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #F8FAFC 0%, #F0F9FF 35%, #EDE9FE 70%, #FDF2F8 100%)',
        color: '#1e293b',
      }}
    >
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
        {/* ── MOBILE SEARCH + FILTER BUTTON (only on mobile) ── */}
        <div className="flex items-center gap-3 mb-4 md:hidden">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(0,245,255,0.3)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                color: '#1e293b',
                outline: 'none',
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,212,221,0.8)' }} />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent outline-none cursor-pointer"
                style={{ color: '#94a3b8' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileFilterOpen(true)}
            className="relative flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: activeFilterCount > 0 ? 'linear-gradient(135deg, #00F5FF, #9B4DFF)' : 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,245,255,0.3)',
              boxShadow: activeFilterCount > 0 ? '0 0 18px rgba(0,245,255,0.35)' : '0 2px 12px rgba(0,0,0,0.04)',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={20} style={{ color: activeFilterCount > 0 ? '#090418' : '#00C4CC' }} />
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-white font-bold"
                style={{
                  width: 18,
                  height: 18,
                  fontSize: '0.6rem',
                  background: '#FF2D78',
                  boxShadow: '0 0 6px rgba(255,45,120,0.6)',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar — desktop only */}
          <FiltersSidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            condition={condition}
            onConditionChange={setCondition}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search Input Bar (desktop only) */}
            <motion.div
              id="home-search-input-wrapper"
              className="relative mb-6 hidden md:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <input
                type="text"
                placeholder="Tìm sách giáo khoa, điện tử, gia dụng và nhiều hơn nữa..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,245,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#1e293b',
                  outline: 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(0,245,255,0.6)';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 20px rgba(0,245,255,0.15)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(0,245,255,0.3)';
                  e.target.style.background = 'rgba(255,255,255,0.7)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(0,245,255,0.8)' }} />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent outline-none cursor-pointer transition-colors"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1e293b')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>

            <BrowsingTabs categories={categories} activeCategoryId={selectedCategoryId} onCategoryChange={setSelectedCategoryId} />

            <ProductGrid products={products} loading={loading} />
          </div>

          {/* Augmented Features Sidebar — hidden on mobile & tablet */}
          <div className="hidden lg:block">
            <AugmentedFeatures />
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            />

            {/* Drawer panel — slides up from bottom */}
            <motion.div
              key="filter-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 overflow-y-auto rounded-t-3xl"
              style={{
                background: 'rgba(255,255,255,0.98)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
                maxHeight: '82vh',
                paddingBottom: 80,
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div style={{ width: 40, height: 5, borderRadius: 999, background: '#e2e8f0' }} />
              </div>

              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pb-4" style={{ borderBottom: '1px solid rgba(0,245,255,0.15)' }}>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} style={{ color: '#00C4CC' }} />
                  <span className="font-bold text-base" style={{ color: '#1e293b' }}>
                    Bộ lọc tìm kiếm
                  </span>
                  {activeFilterCount > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)', color: '#090418' }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full border-none bg-transparent cursor-pointer"
                  style={{ color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter content */}
              <div className="px-5 py-5">
                <MobileFiltersContent
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  onCategoryChange={setSelectedCategoryId}
                  condition={condition}
                  onConditionChange={setCondition}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  onClearFilters={handleClearFilters}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Mobile filter content displayed inside drawer ── */
interface MobileFiltersContentProps {
  categories: ICategory[];
  selectedCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  condition: string | null;
  onConditionChange: (c: string | null) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

function MobileFiltersContent({
  categories,
  selectedCategoryId,
  onCategoryChange,
  condition,
  onConditionChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearFilters,
  onClose,
}: MobileFiltersContentProps) {
  const conditionOptions = [
    { id: 'Brand New', label: 'Mới nguyên' },
    { id: 'Like New', label: 'Như mới' },
    { id: 'Excellent', label: 'Rất tốt' },
    { id: 'Good', label: 'Tốt' },
    { id: 'Fair', label: 'Khá' },
  ];

  const SectionTitle = ({ title }: { title: string }) => (
    <p className="font-bold text-xs mb-3" style={{ color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      {title}
    </p>
  );

  const ChipBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="px-4 py-2 rounded-2xl text-sm font-semibold cursor-pointer border-none outline-none"
      style={{
        background: active ? 'linear-gradient(135deg, #00F5FF, #9B4DFF)' : 'rgba(241,245,249,1)',
        color: active ? '#090418' : '#64748b',
        boxShadow: active ? '0 0 12px rgba(0,245,255,0.3)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="space-y-6">
      {/* Condition */}
      <div>
        <SectionTitle title="Tình trạng" />
        <div className="flex flex-wrap gap-2">
          {conditionOptions.map(opt => (
            <ChipBtn
              key={opt.id}
              label={opt.label}
              active={condition === opt.id}
              onClick={() => onConditionChange(condition === opt.id ? null : opt.id)}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <SectionTitle title="Danh mục" />
        <div className="flex flex-wrap gap-2">
          <ChipBtn label="Tất cả" active={selectedCategoryId === null} onClick={() => onCategoryChange(null)} />
          {categories.map(cat => (
            <ChipBtn
              key={cat.id}
              label={cat.name || ''}
              active={selectedCategoryId === cat.id}
              onClick={() => onCategoryChange(selectedCategoryId === cat.id ? null : cat.id || null)}
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <SectionTitle title="Khoảng giá (đ)" />
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Thấp nhất"
            value={minPrice || ''}
            onChange={e => onPriceChange(Number(e.target.value), maxPrice)}
            className="flex-1 py-3 px-4 rounded-2xl text-sm text-center"
            style={{
              background: 'rgba(241,245,249,1)',
              border: '1px solid rgba(0,245,255,0.25)',
              color: '#1e293b',
              outline: 'none',
            }}
          />
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>—</span>
          <input
            type="number"
            placeholder="Cao nhất"
            value={maxPrice === 100000000 ? '' : maxPrice}
            onChange={e => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : 100000000)}
            className="flex-1 py-3 px-4 rounded-2xl text-sm text-center"
            style={{
              background: 'rgba(241,245,249,1)',
              border: '1px solid rgba(0,245,255,0.25)',
              color: '#1e293b',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClearFilters}
          className="flex-1 py-3 rounded-2xl font-bold text-sm cursor-pointer border-none"
          style={{ background: 'rgba(241,245,249,1)', color: '#64748b' }}
        >
          Xóa tất cả
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl font-bold text-sm cursor-pointer border-none"
          style={{
            background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)',
            color: '#090418',
            boxShadow: '0 0 20px rgba(0,245,255,0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Áp dụng
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
