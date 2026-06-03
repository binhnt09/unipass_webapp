// NEW FEATURE: Trade Request Card - Display trade proposal in a card format
// Shows offered items, requester info, and quick actions for seller
// Used in TradeRequestsPage to list all trade proposals

import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  ArrowRight,
  Home,
} from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import type { TradeRequest } from '../../../shared/types/trade';

interface TradeRequestCardProps {
  trade: TradeRequest;
  onAccept?: (tradeId: string) => void;
  onDecline?: (tradeId: string) => void;
  onViewDetail?: (tradeId: string) => void;
}

export function TradeRequestCard({ trade, onAccept, onDecline, onViewDetail }: TradeRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    const badges = {
      pending: { text: 'Chờ xử lý', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: Clock },
      accepted: { text: 'Đã chấp nhận', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
      negotiating: {
        text: 'Đang đàm phán',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: MessageCircle,
      },
      scheduled: { text: 'Đã hẹn lịch', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300', icon: Calendar },
      completed: { text: 'Hoàn thành', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
      declined: { text: 'Đã từ chối', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300', icon: XCircle },
    }[trade.status];

    const Icon = badges.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badges.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badges.text}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="p-5">
        {/* Header: Status & Date */}
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge()}
          <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(trade.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>

        {/* Trade Summary: Target ⇄ Offered */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Target Product (Seller's item) */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                <ImageWithFallback src={trade.targetProductImage} alt={trade.targetProductTitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Món của bạn</p>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{trade.targetProductTitle}</h4>
                <p className="text-sm font-bold text-[#FF6B35]">{trade.targetProductPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Arrow & Cash Difference */}
            <div className="flex flex-col items-center justify-center py-2">
              <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-2 hidden md:block" />
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {trade.tradeType === 'with_cash' ? 'Đổi + bù tiền' : 'Đổi thẳng'}
                </p>
                {trade.tradeType === 'with_cash' && (
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">+ {trade.cashDifference.toLocaleString('vi-VN')}đ</p>
                )}
              </div>
            </div>

            {/* Offered Items */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Món đề xuất ({trade.offeredItems.length})</p>
              {trade.offeredItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {item.images[0] && <ImageWithFallback src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">~{item.estimatedValue.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requester Info - Compact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {trade.requesterName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 dark:text-white">{trade.requesterName}</span>
                <BadgeCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{trade.requesterUniversity}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* View Detail Button - NEW FEATURE */}
        {onViewDetail && (
          <Link
            to={`/seller/trades/${trade.id}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 text-purple-800 dark:text-purple-300 rounded-lg font-medium text-sm transition-all border border-purple-300 dark:border-purple-700"
          >
            <Eye className="w-4 h-4" />
            Xem chi tiết so sánh
          </Link>
        )}

        {/* Actions */}
        {trade.status === 'pending' && onAccept && onDecline && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onAccept(trade.id)}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              Chấp nhận đổi
            </button>
            <button
              onClick={() => onDecline(trade.id)}
              className="flex-1 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              Từ chối
            </button>
          </div>
        )}

        {trade.status === 'declined' && trade.declineReason && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-medium">Lý do từ chối:</span> {trade.declineReason}
            </p>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-4 space-y-3">
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{trade.requesterEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{trade.requesterPhone}</span>
              </div>
            </div>

            {/* Meeting Location */}
            <div className="flex items-start gap-2 text-sm">
              {trade.proposedMeetingLocation.type === 'buyer_address' ? (
                <Home className="w-4 h-4 text-gray-400 mt-0.5" />
              ) : (
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  {trade.proposedMeetingLocation.type === 'buyer_address'
                    ? trade.proposedMeetingLocation.address
                    : trade.proposedMeetingLocation.publicPlace}
                </p>
                {trade.proposedMeetingLocation.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{trade.proposedMeetingLocation.notes}</p>
                )}
              </div>
            </div>

            {/* Reason */}
            {trade.reason && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lý do muốn đổi:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{trade.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
