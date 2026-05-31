Màn 1: Xem sản phẩm & Thêm vào giỏ (Add to cart)
Hành động: Buyer xem danh sách hoặc chi tiết sản phẩm. Bấm Add to cart.

Logic Backend:

Kiểm tra product.stock. Nếu stock <= 0 hoặc status != 'AVAILABLE', báo lỗi ngay trên FE không cho bấm nút.

Nếu hợp lệ, kiểm tra xem sản phẩm đã có trong cart_item của user chưa. Nếu có rồi, tăng quantity lên 1. Nếu chưa có, tạo bản ghi mới vào cart_item.

Màn 2: Giỏ hàng (Cart) & Chọn hàng (Checkout Info)
Giao diện: Gom nhóm (Group by) các cart_item có cùng seller_id. Hiển thị ô Checkbox đầu mỗi sản phẩm.

Hành động: Buyer tích chọn những sản phẩm muốn mua và bấm Mua hàng.

Xác nhận thông tin: Chuyển sang giao diện Checkout.

Hệ thống tự động lấy phone_number và tên từ bảng user_profile đổ vào ô Người nhận (Buyer có thể sửa lại nếu muốn).

Lấy thông tin từ bảng campus (thông qua campus_id của profile) gợi ý làm địa chỉ nhận/giao dịch mặc định.

Chỉ hiển thị 1 phương thức: Thanh toán khi nhận hàng (COD).

Màn 3: Đặt mua & Khóa Kho (Stock Locking)
Hành động: Buyer bấm Đặt mua.

Logic Backend (Chống lỗ hổng tranh giành đồ cũ):

Chạy một Transaction kiểm tra lại stock của toàn bộ sản phẩm được chọn một lần nữa.

Nếu đủ hàng:

Tạo bản ghi mới vào bảng orders (Trạng thái PENDING_CONFIRM).

Tạo các bản ghi tương ứng vào order_item (Lưu cứng giá và số lượng).

Trừ kho ngay lập tức: product.stock = product.stock - quantity. If stock == 0 thì tự động đổi product.status = 'SOLD'.

Xóa các sản phẩm này khỏi bảng cart_item.

Màn 4: Theo dõi đơn & Xác nhận giao/nhận hàng
Luồng trạng thái đơn hàng sẽ di chuyển chặt chẽ như sau:

[PENDING_CONFIRM] ──(Seller bấm Gửi hàng)──> [SHIPPING] ──(Buyer bấm Đã nhận)──> [COMPLETED]
│ │
(Buyer/Seller (Gửi yêu cầu
bấm Hủy) Hủy đơn)
▼ ▼
[CANCELLED] [CANCELLED]
(Cộng lại kho stock) (Cộng lại kho stock)
Trạng thái 1: PENDING_CONFIRM

Buyer: Có nút Hủy đơn. Nếu bấm, đơn sang CANCELLED, hệ thống tự động cộng lại stock cho sản phẩm.

Seller: Có nút Xác nhận và Gửi hàng và nút Hủy đơn (nếu hết hàng đột xuất).

Trạng thái 2: SHIPPING (Kích hoạt khi Seller bấm gửi hàng)

Lúc này Buyer không được tự ý hủy đơn nữa để bảo vệ Seller.

Chỉ có Buyer có nút Đã nhận được hàng để chuyển đơn sang COMPLETED.

Chặn lỗ hổng Buyer lười bấm nút: Cài đặt một Cronjob chạy ngầm hàng ngày, nếu đơn hàng ở trạng thái SHIPPING quá 7 ngày mà không có khiếu nại, hệ thống tự động chuyển sang COMPLETED.

Màn 5: Đánh giá (Review) – Cơ chế Đánh giá mù
Khi đơn hàng đạt trạng thái COMPLETED:

Hệ thống mở quyền tạo bản ghi vào bảng review cho cả buyer_id và seller_id.

Cơ chế ẩn đánh giá: Khi Buyer đánh giá Seller, bản ghi lưu vào DB nhưng FE của Seller sẽ không nhìn thấy nội dung hay số sao này. Seller cũng phải vào đánh giá lại Buyer.

Thời điểm hiển thị: Đánh giá của cả 2 bên chỉ được công khai lên trang cá nhân của nhau khi: Cả 2 đều đã viết xong đánh giá, hoặc Sau 15 ngày kể từ lúc đơn hàng hoàn thành (Hết hạn tự động khóa tính năng review đơn đó).

Màn 6: Khiếu nại (Report) – Giải quyết lỗ hổng chơi xấu
Kịch bản: Hết 15 ngày, Seller thấy mình bị Buyer cố tình chấm 1 sao ác ý để hạ reputation_score (Điểm uy tín ở bảng user_profile).

Hành động: Seller vào mục Đánh giá, bấm Khiếu nại.

Logic Backend:

Hệ thống chèn 1 bản ghi vào bảng report: reporter_id = [Seller], reported_id = [Buyer], target_type = 'REVIEW', target_id = [ID của cái review 1 sao].

Admin xử lý: Admin kiểm tra lịch sử chat, nếu thấy Buyer cố tình phá hoại, Admin bấm Duyệt khiếu nại (status = 'RESOLVED'), hệ thống sẽ chạy lệnh ẩn/xóa cái review đó đi, đồng thời trừ thẳng điểm reputation_score của Buyer kia làm hình phạt.
