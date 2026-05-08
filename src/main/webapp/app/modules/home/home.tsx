import './home.scss';

import React from 'react';
import { HeroSection } from './components/HeroSection';
import { FiltersSidebar } from './components/FiltersSidebar';
import { BrowsingTabs } from './components/BrowsingTabs';
import { ProductGrid } from './components/ProductGrid';
import { AugmentedFeatures } from './components/AugmentedFeatures';
import { useState } from 'react';
// import { Row } from 'react-bootstrap';
// import { Translate } from 'react-jhipster';
// import { Link } from 'react-router';
// import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState('electronics');

  return (
    <>
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <FiltersSidebar />
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <BrowsingTabs activeTab={activeCategory} onTabChange={setActiveCategory} />
            <ProductGrid activeCategory={activeCategory} />
          </div>
          {/* Augmented Features Sidebar */}
          <AugmentedFeatures />
        </div>
      </div>
    </>
  );
};

export default Home;
