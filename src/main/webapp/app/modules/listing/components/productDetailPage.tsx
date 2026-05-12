import React, { useState } from 'react';
import {
  ShoppingCart,
  MessageCircle,
  BadgeCheck,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Shield,
  Clock,
  Flag,
} from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { Link } from 'react-router';
import { ReportModal } from './reportModal';

export function ProductDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const product = {
    id: '1',
    title: 'MacBook Pro 13" M2 Chip - 256GB (Like New)',
    price: 1099.0,
    condition: 'Like New',
    category: 'Electronics',
    description: `Selling my 2022 MacBook Pro with M2 chip in excellent condition. Used for one semester, always kept in a protective case. Includes original box, charger, and all accessories. No scratches or dents. Battery health is at 98%. Perfect for students who need a reliable laptop for coding, design, or everyday tasks.

Specs:
• Apple M2 Chip (8-core CPU, 10-core GPU)
• 8GB Unified Memory
• 256GB SSD Storage
• 13.3" Retina Display
• Touch Bar and Touch ID
• macOS Ventura (latest)

Reason for selling: Upgraded to the 14" model for video editing work. Willing to meet on campus or deliver to dorm for a small fee.`,
    images: [
      'https://images.unsplash.com/photo-1637329589604-4485001b3605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBtYWNib29rJTIwbGFwdG9wfGVufDF8fHx8MTc3MzMwMzQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzczMzAzNDExfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBvcGVuJTIwZGVza3xlbnwxfHx8fDE3NzMzMDM0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    seller: {
      name: 'Sarah Martinez',
      university: 'Stanford University',
      year: 'Junior',
      major: 'Computer Science',
      rating: 4.9,
      totalSales: 23,
      responseTime: '< 1 hour',
      memberSince: 'Sept 2023',
      verifiedStudent: true,
    },
    location: 'Palo Alto, CA',
    postedDate: '2 days ago',
    views: 156,
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">
            Home
          </Link>
          <span>/</span>
          <Link to="/" className="hover:text-[#FF6B35]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square group">
              <ImageWithFallback src={product.images[currentImageIndex]} alt={product.title} className="w-full h-full object-cover" />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Share2 className="w-5 h-5 text-gray-900" />
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                  title="Report this listing"
                >
                  <Flag className="w-5 h-5 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-[#FF6B35] shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageWithFallback src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-[#0A2647] mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{product.postedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                <span>• {product.views} views</span>
              </div>

              {/* Price and Condition */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-4xl font-bold text-[#FF6B35] mb-1">${product.price.toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Original: $1,299 • Save 15%</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">{product.condition}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Link>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg font-medium transition-colors shadow-md">
                  <MessageCircle className="w-5 h-5" />
                  Chat with Seller
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0A2647] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#0A2647] mb-1">Buyer Protection</h4>
                    <p className="text-xs text-gray-600">Safe meet-up spots on campus • Verified sellers only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-[#0A2647] mb-4">Verified Seller</h3>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {product.seller.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{product.seller.name}</h4>
                    <BadgeCheck className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-medium text-[#0A2647]">{product.seller.university}</span>
                    <span>•</span>
                    <span>{product.seller.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.seller.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900 ml-1">{product.seller.rating}</span>
                    <span className="text-sm text-gray-500">({product.seller.totalSales} sales)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Response Time</p>
                  <p className="text-sm font-medium text-gray-900">{product.seller.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">{product.seller.memberSince}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Usually responds within 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-4">Description</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} itemTitle={product.title} sellerName={product.seller.name} />
      )}
    </div>
  );
}
