import { Star, MessageCircle, ShoppingCart, BadgeCheck } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import { Link } from 'react-router';
// import { useState } from 'react';
import React from 'react';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice: number | null;
  seller: string;
  university: string;
  rating: number;
  reviews: number;
  condition: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  //   const [showMenu, setShowMenu] = useState(false);

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <div className="absolute top-2 left-2 bg-[#FF6B35] text-white px-2 py-1 rounded-md text-xs font-medium">{discount}% OFF</div>
          )}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
            {product.condition}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] hover:text-[#FF6B35] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-[#0A2647]">{product.price.toLocaleString('vi-VN')}đ</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-xs font-medium">
            {product.seller.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900 truncate">{product.seller}</span>
              <BadgeCheck className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
            </div>
            <span className="text-xs text-gray-600">{product.university}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex-1 bg-[#FF6B35] hover:bg-[#FF5722] text-white py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
          <button className="p-2 border border-gray-300 hover:border-[#0A2647] hover:bg-gray-50 rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
