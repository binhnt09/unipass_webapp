import './home.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
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
    <>
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
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
            {/* Search Input Bar (Premium Aesthetics) */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Tìm sách giáo khoa, điện tử, gia dụng và nhiều hơn nữa..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white rounded-xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm text-gray-900 placeholder:text-gray-400 transition-all font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <BrowsingTabs categories={categories} activeCategoryId={selectedCategoryId} onCategoryChange={setSelectedCategoryId} />

            <ProductGrid products={products} loading={loading} />
          </div>
          {/* Augmented Features Sidebar */}
          <AugmentedFeatures />
        </div>
      </div>
    </>
  );
};

export default Home;
