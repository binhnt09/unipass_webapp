// NEW FEATURE: Trade Comparison - Side-by-side comparison of seller's item vs offered items
// Visual comparison with images, prices, and value analysis
// Used in TradeDetailPage for seller to evaluate trade proposals

import React from 'react';
import { ArrowRight, Package, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import type { TradeRequest } from '../../../shared/types/trade';

interface TradeComparisonProps {
  trade: TradeRequest;
}

export function TradeComparison({ trade }: TradeComparisonProps) {
  const valueDifference = trade.targetProductPrice - (trade.totalOfferedValue + trade.cashDifference);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-purple-600" />
        So sánh món đồ
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seller's Item (Target) */}
        <div className="lg:col-span-1">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mb-3 uppercase">Món của bạn</p>

            {/* Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
              <ImageWithFallback src={trade.targetProductImage} alt={trade.targetProductTitle} className="w-full h-full object-cover" />
            </div>

            {/* Title & Price */}
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{trade.targetProductTitle}</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{trade.targetProductPrice.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>

        {/* Arrow & Summary */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center">
          <div className="hidden lg:block mb-4">
            <ArrowRight className="w-8 h-8 text-gray-400" />
          </div>

          <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mb-3 font-medium">LOẠI TRAO ĐỔI</p>

            <div className="text-center mb-4">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {trade.tradeType === 'with_cash' ? 'Đổi + bù tiền' : 'Đổi thẳng'}
              </p>
              {trade.tradeType === 'with_cash' && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                  + {trade.cashDifference.toLocaleString('vi-VN')}đ tiền mặt
                </p>
              )}
            </div>

            {/* Value Analysis */}
            <div className="border-t border-purple-200 dark:border-purple-700 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Giá trị đề xuất:</span>
                <span className="font-bold text-gray-900 dark:text-white">{trade.totalOfferedValue.toLocaleString('vi-VN')}đ</span>
              </div>
              {trade.tradeType === 'with_cash' && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tiền bù:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">+ {trade.cashDifference.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                <span className="font-bold text-gray-900 dark:text-white">Chênh lệch:</span>
                <span
                  className={`font-bold ${
                    valueDifference > 0
                      ? 'text-red-600 dark:text-red-400'
                      : valueDifference < 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {valueDifference > 0 && '+'}
                  {valueDifference.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Offered Items */}
        <div className="lg:col-span-1">
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border-2 border-pink-200 dark:border-pink-800">
            <p className="text-xs text-pink-600 dark:text-pink-400 font-bold mb-3 uppercase">
              Món được đề xuất ({trade.offeredItems.length})
            </p>

            <div className="space-y-4">
              {trade.offeredItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  {/* Images Gallery */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {item.images.slice(0, 3).map((img, imgIndex) => (
                      <div key={imgIndex} className="aspect-square rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <ImageWithFallback src={img} alt={`${item.title} ${imgIndex + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {item.images.length > 3 && (
                      <div className="aspect-square rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">+{item.images.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Value */}
                  <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{item.title}</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                      ~{item.estimatedValue.toLocaleString('vi-VN')}đ
                    </span>
                    {item.condition && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {item.condition}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t-2 border-pink-300 dark:border-pink-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Tổng giá trị:</span>
                <span className="text-xl font-bold text-pink-600 dark:text-pink-400">
                  {trade.totalOfferedValue.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Analysis Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white mb-2">Phân tích giá trị:</p>
              <div className="text-sm space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                  • Món của bạn: <span className="font-bold">{trade.targetProductPrice.toLocaleString('vi-VN')}đ</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  • Món đề xuất: <span className="font-bold">{trade.totalOfferedValue.toLocaleString('vi-VN')}đ</span>
                  {trade.tradeType === 'with_cash' && (
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      {' '}
                      + {trade.cashDifference.toLocaleString('vi-VN')}đ tiền mặt
                    </span>
                  )}
                </p>
                <p className="text-gray-700 dark:text-gray-300 pt-2 border-t border-purple-200 dark:border-purple-700">
                  • Kết quả:{' '}
                  {valueDifference > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">
                      Đề xuất thấp hơn {valueDifference.toLocaleString('vi-VN')}đ
                    </span>
                  ) : valueDifference < 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      Đề xuất cao hơn {Math.abs(valueDifference).toLocaleString('vi-VN')}đ
                    </span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400 font-bold">Giá trị tương đương</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
