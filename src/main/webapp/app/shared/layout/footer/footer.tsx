import './footer.scss';

import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import logoImg from '../../../../content/images/Icon_logo.png';

const Footer = () => (
  <footer
    style={{
      background: 'linear-gradient(180deg, #090418 0%, #0a051e 100%)',
      borderTop: '1px solid rgba(0,245,255,0.08)',
      color: '#fff',
      marginTop: '4rem',
    }}
  >
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Main Footer Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* Brand icon — neon gradient */}
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm overflow-hidden p-1">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                background: 'linear-gradient(135deg, #fff 40%, #00F5FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Unipass
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Chợ trường an toàn dành riêng cho sinh viên ĐH FPT. Mua bán đồ cũ, sách giáo khoa, và nhiều hơn nữa.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[FaFacebook, FaInstagram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(0,245,255,0.12)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,245,255,0.12)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.4)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.12)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#fff' }}>
            Liên kết nhanh
          </h3>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Trang chủ' },
              { to: '/market', label: 'Marketplace' },
              { to: '/create-listing', label: 'Đăng sản phẩm' },
              { to: '/premium', label: 'Gói Premium' },
              { to: '/orders', label: 'Đơn hàng của tôi' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm transition-all inline-flex items-center gap-1 group"
                  style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#fff' }}>
            Hỗ trợ
          </h3>
          <ul className="space-y-3">
            {['Câu hỏi thường gặp', 'Hướng dẫn mua bán', 'Chính sách giao dịch', 'Báo cáo vi phạm'].map(item => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm transition-all"
                  style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#fff' }}>
            Liên hệ
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#00F5FF' }} />
              <span>Khu Công nghệ cao Hòa Lạc, Km29, Đại lộ Thăng Long, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#9B4DFF' }} />
              <a
                href="mailto:support@unipass.vn"
                style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                support@unipass.vn
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#FF2D78' }} />
              <a
                href="tel:+842473001866"
                style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                024 7300 1866
              </a>
            </li>
          </ul>

          {/* Mini CTA in footer */}
          <Link
            to="/market"
            className="inline-flex items-center gap-2 mt-5 text-sm font-semibold transition-all"
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(0,245,255,0.08)',
              border: '1px solid rgba(0,245,255,0.2)',
              borderRadius: '0.75rem',
              color: '#00F5FF',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,245,255,0.14)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,245,255,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,245,255,0.2)';
            }}
          >
            Vào Marketplace <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="py-6" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Unipass. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {['Điều khoản dịch vụ', 'Chính sách bảo mật', 'Quy chế hoạt động'].map(item => (
              <a
                key={item}
                href="#"
                style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)')}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>Made with</span>
            {/* Heart — neon pink gradient */}
            <Heart
              className="w-4 h-4"
              style={{ fill: '#FF2D78', stroke: '#FF2D78', filter: 'drop-shadow(0 0 6px rgba(255,45,120,0.6))' }}
            />
            <span>for FPT Students</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
