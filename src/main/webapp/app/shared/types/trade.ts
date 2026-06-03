// NEW FEATURE: Trade System - Type definitions for barter/exchange feature
// Allows users to propose trading their items for seller's items
// Supports: up to 2 items + cash difference

export type TradeStatus =
  | 'pending' // Chờ seller xem xét
  | 'accepted' // Seller chấp nhận
  | 'negotiating' // Đang đàm phán
  | 'scheduled' // Đã hẹn lịch gặp
  | 'completed' // Hoàn thành trao đổi
  | 'declined' // Seller từ chối
  | 'cancelled'; // User hủy

export type TradeType =
  | 'straight' // Đổi thẳng (không bù tiền)
  | 'with_cash'; // Đổi + bù tiền

export type MeetingLocationType =
  | 'buyer_address' // Địa chỉ người đề xuất
  | 'public_place'; // Địa điểm công cộng

// Món đồ được đề xuất để đổi
export interface OfferedItem {
  title: string;
  description: string;
  estimatedValue: number;
  images: string[]; // Array of image URLs/files
  condition: string; // Tình trạng: "Mới 99%", "Đã qua sử dụng", etc.
  purchaseDate?: string; // Ngày mua (optional)
  warrantyRemaining?: string; // Thời gian bảo hành còn lại (optional)
}

// Meeting location info
export interface MeetingLocation {
  type: MeetingLocationType;
  address?: string; // If type = buyer_address
  publicPlace?: string; // If type = public_place (e.g., "Thư viện Tầng 2")
  notes?: string; // Ghi chú thêm về địa điểm
}

// Counter offer from seller
export interface CounterOffer {
  cashDifference: number; // Số tiền bù mới đề xuất
  message: string; // Lời nhắn từ seller
  createdAt: string;
}

// Meeting schedule
export interface MeetingSchedule {
  date: string; // ISO date string
  time: string; // HH:mm format
  location: string; // Địa chỉ đầy đủ
  notes?: string;
  confirmedByBoth: boolean; // Cả 2 bên đã xác nhận
}

// Main trade request interface
export interface TradeRequest {
  id: string;
  status: TradeStatus;

  // Món đồ mục tiêu (của seller - đang được đăng bán)
  targetProductId: string;
  targetProductTitle: string;
  targetProductPrice: number;
  targetProductImage: string;

  // Món đồ được đề xuất (1 hoặc 2 món)
  offeredItems: OfferedItem[]; // Tối đa 2 món

  // Thông tin trao đổi
  tradeType: TradeType;
  cashDifference: number; // Số tiền bù (0 nếu đổi thẳng)
  totalOfferedValue: number; // Tổng giá trị món đề xuất
  reason: string; // Lý do muốn đổi

  // Thông tin người đề xuất (buyer/requester)
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterUniversity: string;

  // Địa điểm gặp đề xuất
  proposedMeetingLocation: MeetingLocation;

  // Thông tin seller
  sellerId: string;
  sellerName: string;

  // Counter offer (nếu có)
  counterOffer?: CounterOffer;

  // Lịch hẹn (sau khi accept)
  meetingSchedule?: MeetingSchedule;

  // Decline reason
  declineReason?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  declinedAt?: string;

  // Ratings (sau khi hoàn thành)
  requesterRating?: number;
  sellerRating?: number;
  requesterReview?: string;
  sellerReview?: string;
}

// For creating new trade request
export interface CreateTradeRequestInput {
  targetProductId: string;
  offeredItems: Omit<OfferedItem, 'images'>[]; // Images handled separately
  tradeType: TradeType;
  cashDifference: number;
  reason: string;
  proposedMeetingLocation: MeetingLocation;
  requesterPhone: string;
}
