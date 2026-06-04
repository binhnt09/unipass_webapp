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

  // Confirmation flags
  isBuyerConfirmed?: boolean;
  isSellerConfirmed?: boolean;

  // Ratings (sau khi hoàn thành)
  requesterRating?: number;
  sellerRating?: number;
  requesterReview?: string;
  sellerReview?: string;
}

export interface TradeRequestProductDTO {
  name: string;
  description: string;
  price: number;
  condition: string;
  imageUrls: string[];
}

// For creating new trade request
export interface CreateTradeRequestInput {
  targetProductId: string;
  existingProductIds?: number[]; // IDs of products from the buyer's own inventory
  newOfferedItems?: TradeRequestProductDTO[]; // New items created specifically for this trade
  tradeType: TradeType;
  cashDifference: number;
  reason: string;
  proposedMeetingLocation: MeetingLocation;
  requesterPhone: string;
}

export function mapTradeRequestDtoToFe(dto: any): TradeRequest {
  // Parsing meeting location from string if it's stored as JSON or string
  // The backend currently stores `meetupLocation` as string. Let's assume it's just a public_place for now if it's a simple string.
  let location: MeetingLocation = { type: 'public_place', publicPlace: dto.meetupLocation || '' };
  try {
    if (dto.meetupLocation && dto.meetupLocation.startsWith('{')) {
      location = JSON.parse(dto.meetupLocation);
    }
  } catch (e) {
    console.error(e);
    // Ignore JSON parse error, use as simple string
  }

  // Parse offered items
  const offeredItems = (dto.offeredItems || []).map((itemDto: any) => {
    const p = itemDto.offeredProduct || {};
    return {
      title: p.name || 'Sản phẩm',
      description: p.description || '',
      estimatedValue: p.price || 0,
      condition: p.condition || '',
      images: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : ['https://via.placeholder.com/300?text=No+Image'],
    };
  });

  const totalOfferedValue = offeredItems.reduce((acc: number, item: any) => acc + (item.estimatedValue || 0), 0);

  return {
    id: String(dto.id),
    status: dto.status ? (dto.status.toLowerCase() as TradeStatus) : 'pending',
    targetProductId: String(dto.targetProduct?.id || ''),
    targetProductTitle: dto.targetProduct?.name || 'Sản phẩm',
    targetProductPrice: dto.targetProduct?.price || 0,
    targetProductImage: (dto.targetProduct?.imageUrls && dto.targetProduct.imageUrls[0]) || 'https://via.placeholder.com/300',
    offeredItems,
    tradeType: dto.topUpAmount > 0 ? 'with_cash' : 'straight',
    cashDifference: dto.topUpAmount || 0,
    totalOfferedValue,
    reason: '', // Assuming not stored in DTO natively if not added
    requesterId: String(dto.buyer?.id || ''),
    requesterName: dto.buyer?.login || 'Người dùng',
    requesterEmail: dto.buyer?.email || '',
    requesterPhone: '', // Not in default UserDTO
    requesterUniversity: '', // Not in default UserDTO
    proposedMeetingLocation: location,
    sellerId: String(dto.seller?.id || ''),
    sellerName: dto.seller?.login || 'Người bán',
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || new Date().toISOString(),
    isBuyerConfirmed: dto.isBuyerConfirmed,
    isSellerConfirmed: dto.isSellerConfirmed,
  };
}
