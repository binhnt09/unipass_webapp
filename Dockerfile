# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies (sử dụng --legacy-peer-deps nếu gặp lỗi conflict version)
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng cho môi trường production
RUN npm run webapp:prod

# Serve stage
FROM nginx:alpine

# Xoá config mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy file cấu hình Nginx tự tạo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build từ stage trước vào thư mục public của Nginx
COPY --from=build /app/target/classes/static /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
