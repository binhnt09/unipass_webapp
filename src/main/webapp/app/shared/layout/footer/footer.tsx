import './footer.scss';

import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-[#0A2647] text-white mt-16">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        {/* About Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-bold">Unipass</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Chợ trường an toàn dành riêng cho sinh viên ĐH FPT. Mua bán đồ cũ, sách giáo khoa, và nhiều hơn nữa.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 hover:bg-[#FF6B35] rounded-lg flex items-center justify-center transition-colors">
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/create-listing" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Đăng sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/premium" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Gói Premium
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Đơn hàng của tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Hướng dẫn mua bán
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Chính sách giao dịch
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-[#FF6B35] text-sm transition-colors">
                Báo cáo vi phạm
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-white/70">
              <MapPin className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
              <span>Khu Công nghệ cao Hòa Lạc, Km29, Đại lộ Thăng Long, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/70">
              <Mail className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
              <a href="mailto:support@unipass.vn" className="hover:text-[#FF6B35] transition-colors">
                support@unipass.vn
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/70">
              <Phone className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
              <a href="tel:+842473001866" className="hover:text-[#FF6B35] transition-colors">
                024 7300 1866
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">© 2026 Unipass. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-[#FF6B35] transition-colors">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="hover:text-[#FF6B35] transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-[#FF6B35] transition-colors">
              Quy chế hoạt động
            </a>
          </div>
          <div className="flex items-center gap-1 text-sm text-white/60">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-[#FF6B35] fill-[#FF6B35]" />
            <span>for FPT Students</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
