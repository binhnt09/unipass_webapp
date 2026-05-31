# Kế hoạch Triển khai Luồng Order (Dựa trên ORDER.md)

Tài liệu này vạch ra các bước chi tiết để xây dựng toàn bộ 6 màn hình nghiệp vụ Order từ Frontend đến Backend. Bằng cách chia nhỏ các bước, chúng ta có thể thi công từng phần một cách an toàn và dễ kiểm soát.

## Open Questions & User Review Required

> [!IMPORTANT]
> **Về WebSocket (Màn Thông báo):** Hiện tại FE chưa cài đặt thư viện để kết nối STOMP. Bạn có đồng ý cho mình chạy lệnh `npm install @stomp/stompjs sockjs-client` vào FE không?
> **Về Cổng Thanh toán (Màn 2):** Trong ORDER.md chỉ yêu cầu Thanh toán khi nhận hàng (COD). Chúng ta có thiết kế chừa sẵn logic cấu trúc để sau này dễ dàng cắm VNPay/Momo vào không, hay chỉ hardcode COD cho nhanh nhất?
> **Về Cronjob (Màn 4):** Lịch quét đơn hàng 7 ngày tự động hoàn thành sẽ được chạy ngầm mỗi ngày 1 lần vào lúc 00:00. Bạn có đồng ý với tần suất này không?

---

## Proposed Changes

### Giai đoạn 1: Giỏ hàng & Đặt hàng (Màn 1, 2, 3)

Phần này tập trung vào việc đưa hàng vào giỏ, hiển thị giao diện và logic trừ kho (Stock Locking) quan trọng nhất để chống tranh giành.

#### Backend (Spring Boot)
- **[NEW] `OrderCheckoutDTO`**: DTO để hứng danh sách các `cart_item_id` mà user tick chọn mua trên giao diện.
- **[MODIFY] `OrderService.java`**: Viết hàm `checkout(List<Long> cartItemIds)` với annotation `@Transactional`.
  - Check quyền (chỉ lấy cartItem của user đang login).
  - Check stock của các Product tương ứng. Ném lỗi `BadRequestAlertException` nếu món nào hết hàng.
  - Trừ kho ( `product.setStock(product.getStock() - quantity)` ). Nếu stock về 0, chuyển status sang `SOLD`.
  - Tạo `Orders` (Status `PENDING_CONFIRM`).
  - Lấy thông tin từ giỏ hàng đổ sang tạo các bản ghi `OrderItem`.
  - Xóa các `cartItemIds` đó khỏi giỏ.
- **[MODIFY] `OrderResource.java`**: Mở endpoint `POST /api/orders/checkout` gọi vào hàm trên.

#### Frontend (React)
- **[MODIFY] `shoppingCartPage.tsx`**: 
  - Tích hợp API `GET /api/cart-items` lọc theo user đang login.
  - Viết hàm Javascript dùng `reduce` để nhóm (group-by) danh sách giỏ hàng theo `sellerId` hoặc `sellerName`.
  - Thêm Checkbox cho từng item và logic tính tổng tiền những món được chọn.
- **[NEW] `CheckoutModal.tsx` hoặc `CheckoutPage.tsx`**:
  - Tự động gọi API `GET /api/account` -> Lấy ID User -> Lấy `UserProfile` để điền sẵn Tên, Phone, Campus vào form giao hàng.
  - Gọi API `POST /api/orders/checkout`. Nếu thành công, chuyển hướng sang trang Danh sách Đơn hàng.

---

### Giai đoạn 2: State Machine, Cronjob & Real-time (Màn 4)

Quản lý vòng đời đơn hàng khắt khe và kết nối thông báo Real-time cho Seller.

#### Backend (Spring Boot)
- **[MODIFY] `OrderService.java`**: Viết các hàm chuyển trạng thái an toàn:
  - `shipOrder(orderId)`: Chỉ Seller của đơn hàng mới được gọi. Chuyển từ `PENDING` -> `SHIPPING`.
  - `completeOrder(orderId)`: Chỉ Buyer mới được gọi. Chuyển từ `SHIPPING` -> `COMPLETED`.
  - `cancelOrder(orderId)`: Trả lại stock ( `product.setStock(product.getStock() + quantity)` ).
- **[NEW] `OrderCronjobService.java`**: Dùng `@Scheduled(cron = "0 0 0 * * ?")` quét DB tìm các `Orders` có `status = SHIPPING` và `updated_at` quá 7 ngày để tự ép thành `COMPLETED`.
- **[MODIFY] `WebsocketConfiguration.java`**: Thêm config `registry.setUserDestinationPrefix("/user");` để hỗ trợ gửi tin nhắn cá nhân.
- **[NEW] `NotificationService.java`**: Hàm `notifyUser(String username, String message)` dùng `SimpMessageSendingOperations` đẩy thông báo đơn hàng mới.

#### Frontend (React)
- **[MODIFY] `orderDetailPage.tsx`**:
  - Dùng `useAppSelector` lấy role/ID hiện tại để quyết định hiển thị nút bấm.
  - Gắn sự kiện gọi các API `ship`, `complete`, `cancel`.
- **[NEW] `WebSocketService.ts`**: Cài `@stomp/stompjs`, kết nối vào `ws://localhost:8080/websocket/tracker`. Lắng nghe kênh `/user/queue/notifications`. Khi có tin nhắn, móc nối vào `notificationContext.tsx` để addNotification.

---

### Giai đoạn 3: Blind Review & Xử lý Khiếu nại (Màn 5, 6)

Bảo vệ người dùng khỏi việc chơi xấu, thiết lập hệ thống điểm uy tín (Reputation).

#### Backend (Spring Boot)
- **[MODIFY] `ReviewService.java`**: Hàm `getReviewsForProduct()` hoặc `getReviewsForUser()`. 
  - Khi Query DB, kiểm tra: Nếu đơn hàng chưa đủ 15 ngày VÀ đối phương chưa review lại -> Thay thế content = "Đánh giá đang bị ẩn", rating = 0 trước khi trả về JSON cho Frontend.
- **[MODIFY] `ReportService.java`**: Hàm `resolveReport(Long reportId)`.
  - Gắn `@Transactional`. Đổi status Report -> `RESOLVED`.
  - Lấy `reported_id` -> Cập nhật `UserProfile` trừ `reputation_score` (VD: trừ 10 điểm).

#### Frontend (React)
- **[NEW] `ReviewModal.tsx`**: Giao diện đánh giá sao ẩn.
- **[NEW] `ReportModal.tsx`**: Nút Report hiện ra nếu đơn hàng đã COMPLETED trên 15 ngày. Gửi lý do lên bảng `Report`.

---

## Verification Plan

- Đăng nhập 2 trình duyệt với 2 tài khoản (Buyer và Seller).
- Buyer thực hiện thêm vào giỏ, Checkout. Verify DB tự động khóa kho và tạo Order. Verify Seller nhận được thông báo rung chuông ngay lập tức (WebSocket).
- Seller ấn Gửi Hàng, Buyer ấn Đã Nhận.
- Sửa lùi ngày `updated_at` của một đơn SHIPPING trong DB quá 7 ngày, ép chạy thử hàm Cronjob xem có tự đổi thành COMPLETED không.
- Test 1 người đánh giá, người kia chưa đánh giá xem API có chặn việc xem trước số sao hay không.
