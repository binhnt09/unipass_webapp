import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Laptop,
  BookOpen,
  Shield,
  Sparkles,
  Menu,
  X,
  Star,
  Zap,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
// import { useAppSelector } from 'app/config/store';
// import { useAuth } from 'app/contexts/AuthContext';
import { AuthModal } from 'app/modules/login/AuthModal';
import studentHeroImg from '../../../../content/images/student-hero.png';
import logoImg from '../../../../content/images/Icon_logo.png';

/* ================================================================
   KEYFRAMES — injected once via <style> tag
   ================================================================ */
const GLOBAL_STYLES = `
  @keyframes spin        { to { transform: rotate(360deg); } }
  @keyframes spin-ccw    { to { transform: rotate(-360deg); } }

  /* ── Student hero: Zero-G Float ── */
  @keyframes studentFloat {
    0%,100% { transform: translateY(0px) rotate(-0.5deg); }
    50%     { transform: translateY(-20px) rotate(0.5deg); }
  }
  /* Shadow breathes opposite to the float */
  @keyframes shadowBreathe {
    0%,100% { transform: scaleX(1);   opacity: 0.45; filter: blur(8px); }
    50%     { transform: scaleX(0.72); opacity: 0.22; filter: blur(14px); }
  }
  /* Soft ambient glow that pulses */
  @keyframes studentGlow {
    0%,100% { opacity: 0.55; }
    50%     { opacity: 0.85; }
  }
  @keyframes breatheGlow {
    0%,100% { box-shadow: 0 0 25px rgba(0,245,255,0.45), 0 0 55px rgba(155,77,255,0.2); }
    50%      { box-shadow: 0 0 55px rgba(0,245,255,0.75), 0 0 90px rgba(155,77,255,0.4); }
  }
  @keyframes floatBob {
    0%,100% { transform: translateY(0px);   }
    50%     { transform: translateY(-14px);  }
  }
  @keyframes neonPingOuter {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(1.6); opacity: 0;   }
  }
`;

/* ================================================================
   STARFIELD CANVAS — full-page background
   ================================================================ */
interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  ad: number;
  as_: number;
  h: string;
}

const StarfieldCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    let stars: Star[] = [];
    const HUES = ['0,245,255', '155,77,255', '255,45,120', '215,230,255'];
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight || window.innerHeight * 3;
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.7 + 0.2,
        a: Math.random() * 0.55 + 0.08,
        ad: Math.random() > 0.5 ? 1 : -1,
        as_: Math.random() * 0.006 + 0.002,
        h: HUES[Math.floor(Math.random() * HUES.length)],
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        s.a += s.as_ * s.ad;
        if (s.a > 0.7 || s.a < 0.05) s.ad *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.h},${s.a})`;
        ctx.fill();
      });
      if (Math.random() < 0.004) {
        const sx = Math.random() * canvas.width * 0.75,
          sy = Math.random() * canvas.height * 0.35;
        const len = 55 + Math.random() * 90;
        const g = ctx.createLinearGradient(sx, sy, sx + len * 0.75, sy + len * 0.42);
        g.addColorStop(0, 'rgba(0,245,255,0)');
        g.addColorStop(0.4, 'rgba(0,245,255,0.8)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + len * 0.75, sy + len * 0.42);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(init);
    ro.observe(document.body);
    init();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

/* ================================================================
   FLOATING PILL NAVBAR
   ================================================================ */
// interface NavbarProps {
//   isLoggedIn: boolean;
// }

const WelcomeNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Trang chủ', href: '#welcome-hero' },
    { label: 'Tính năng', href: '#welcome-features' },
    { label: 'Danh mục', href: '#welcome-slideshow' },
  ];

  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <motion.nav
      id="welcome-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 100,
        background: scrolled ? 'rgba(9,4,24,0.9)' : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '999px',
        padding: '0.65rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,245,255,0.08)' : 'none',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm overflow-hidden p-1">
          <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg,#fff 40%,#00F5FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          UniPass
        </span>
      </button>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(l => (
          <button
            key={l.label}
            onClick={() => scrollTo(l.href)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Auth buttons */}
      <div className="hidden md:flex items-center gap-2"></div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.6rem',
          padding: '0.4rem',
          cursor: 'pointer',
          color: '#fff',
          display: 'flex',
        }}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.75rem)',
              left: 0,
              right: 0,
              background: 'rgba(9,4,24,0.96)',
              border: '1px solid rgba(0,245,255,0.12)',
              borderRadius: '1.25rem',
              padding: '1rem',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {navLinks.map(l => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.6rem 0.5rem',
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ================================================================
   3D TILT CARD
   ================================================================ */
interface TiltCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
  delay: number;
}

const TiltCard = ({ id, icon, title, desc, accent, delay }: TiltCardProps) => {
  const el = useRef<HTMLDivElement>(null);
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!el.current) return;
    const r = el.current.getBoundingClientRect();
    setRx(((e.clientY - r.top - r.height / 2) / r.height / 2) * -14);
    setRy(((e.clientX - r.left - r.width / 2) / r.width / 2) * 14);
  }, []);

  return (
    <motion.div
      id={id}
      ref={el}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setRx(0);
        setRy(0);
        setHov(false);
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${hov ? 1.04 : 1})`,
        transition: hov
          ? 'transform 0.08s linear,box-shadow 0.25s,border-color 0.25s'
          : 'transform 0.55s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s,border-color 0.4s',
        background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? accent + '55' : accent + '20'}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: '1.25rem',
        padding: '1.75rem',
        cursor: 'default',
        boxShadow: hov ? `0 30px 60px rgba(0,0,0,0.4),0 0 40px ${accent}18` : '0 4px 20px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '0.9rem',
          marginBottom: '1rem',
          background: `linear-gradient(135deg,${accent}cc,${accent}44)`,
          boxShadow: `0 0 24px ${accent}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateZ(20px)',
        }}
      >
        {icon}
      </div>
      <div style={{ transform: 'translateZ(12px)' }}>
        <h3
          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '0.5rem' }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{desc}</p>
      </div>
      {/* Shimmer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% ${hov ? '20%' : '110%'},${accent}0c 0%,transparent 60%)`,
          transition: 'background 0.4s',
        }}
      />
    </motion.div>
  );
};

/* ================================================================
   SLIDE DATA
   ================================================================ */
interface SlideData {
  id: string;
  category: string;
  headline: string;
  body: string;
  color: string;
  Icon: React.ElementType;
  badge1: string;
  badge2: string;
  badge3: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'slide-tech',
    category: 'Điện tử & Công nghệ',
    color: '#00F5FF',
    Icon: Laptop,
    headline: 'MacBook, iPhone & Mọi thứ bạn cần',
    body: 'Hàng nghìn thiết bị điện tử chính hãng từ sinh viên khu vực Hòa Lạc — giá tốt hơn 40% so với thị trường.',
    badge1: '1000+ sản phẩm',
    badge2: 'Cập nhật hôm nay',
    badge3: 'Giá tốt nhất',
  },
  {
    id: 'slide-books',
    category: 'Đồ da dụng & Tài liệu',
    color: '#9B4DFF',
    Icon: BookOpen,
    headline: 'Giáo trình & Tài liệu học tập University',
    body: 'Tiết kiệm đến 70% chi phí sách so với mua mới. Từ đề cương đến tài liệu ôn thi chuyên sâu.',
    badge1: '1000+ tài liệu',
    badge2: 'Tiết kiệm 70%',
    badge3: 'Mọi học kỳ',
  },
  {
    id: 'slide-safety',
    category: 'An toàn & Tin cậy',
    color: '#FF2D78',
    Icon: Shield,
    headline: 'Giao dịch bảo đảm trong khuôn viên University',
    body: 'Hệ thống xác thực email .edu, đánh giá người bán minh bạch và bảo vệ người mua toàn diện.',
    badge1: '99% an toàn',
    badge2: 'Xác thực .edu',
    badge3: 'Bảo vệ người mua',
  },
];

/* ================================================================
   SLIDESHOW SECTION
   ================================================================ */
const SlideIllustration = ({ slide }: { slide: SlideData }) => {
  const { Icon, color } = slide;
  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Outer ring — slow spin */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `1px dashed ${color}40`,
          animation: 'spin 30s linear infinite',
        }}
      />
      {/* Ping effect */}
      <div
        style={{
          position: 'absolute',
          inset: 20,
          borderRadius: '50%',
          border: `1px solid ${color}30`,
          animation: 'neonPingOuter 3s ease-out infinite',
        }}
      />
      {/* Middle ring */}
      <div
        style={{
          position: 'absolute',
          inset: 35,
          borderRadius: '50%',
          border: `1px solid ${color}60`,
          boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10`,
          animation: 'spin-ccw 20s linear infinite',
        }}
      />
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: '25%',
          borderRadius: '50%',
          background: `radial-gradient(circle,${color}22 0%,transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      {/* Center icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: `linear-gradient(135deg,${color} 0%,${color}88 100%)`,
          boxShadow: `0 0 40px ${color}70, 0 0 80px ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Icon size={50} color="#090418" strokeWidth={1.75} />
      </motion.div>

      {/* Floating badge 1 — top right */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 20,
          right: -10,
          zIndex: 2,
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.07)',
          border: `1px solid ${color}33`,
          backdropFilter: 'blur(8px)',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#fff',
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
        }}
      >
        <Star size={9} style={{ display: 'inline', marginRight: 4, fill: color, stroke: color }} />
        {slide.badge1}
      </motion.div>

      {/* Floating badge 2 — bottom left */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          bottom: 30,
          left: -15,
          zIndex: 2,
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.07)',
          border: `1px solid ${color}33`,
          backdropFilter: 'blur(8px)',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#fff',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Zap size={9} style={{ display: 'inline', marginRight: 4, fill: color, stroke: color }} />
        {slide.badge2}
      </motion.div>

      {/* Floating badge 3 — bottom right */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: -5,
          zIndex: 2,
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.07)',
          border: `1px solid ${color}33`,
          backdropFilter: 'blur(8px)',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#fff',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <ShieldCheck size={9} style={{ display: 'inline', marginRight: 4, fill: color, stroke: color }} />
        {slide.badge3}
      </motion.div>
    </div>
  );
};

const SLIDE_VARIANTS = {
  enter: (d: number) => ({ x: d > 0 ? '80%' : '-80%', opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-80%' : '80%', opacity: 0, scale: 0.95 }),
};

const Slideshow = ({ onNavigate }: { onNavigate: () => void }) => {
  const [[idx, dir], setPage] = useState([0, 0]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const paginate = useCallback((newDir: number) => {
    setPage(([cur]) => [(cur + newDir + SLIDES.length) % SLIDES.length, newDir]);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [paginate]);

  const resetTimer = (dir1: number) => {
    clearInterval(timerRef.current);
    paginate(dir1);
    timerRef.current = setInterval(() => paginate(1), 5000);
  };

  const slide = SLIDES[idx];

  return (
    <div id="welcome-slideshow" style={{ padding: '5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <p
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#00F5FF',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}
        >
          <Sparkles size={12} /> Khám phá danh mục
        </p>
        <h2
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 'clamp(1.8rem,4vw,2.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            background: 'linear-gradient(135deg,#fff 30%,#00F5FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Mọi thứ bạn cần — ngay trong trường
        </h2>
      </motion.div>

      {/* Slide stage */}
      <div
        style={{
          position: 'relative',
          borderRadius: '1.75rem',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,245,255,0.1)',
          backdropFilter: 'blur(14px)',
          minHeight: 380,
        }}
      >
        {/* Ambient glow behind slide */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit' }}>
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: `radial-gradient(circle,${slide.color}12 0%,transparent 65%)`,
              filter: 'blur(60px)',
              transition: 'background 0.6s ease',
            }}
          />
        </div>

        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
              padding: '3.5rem 3rem',
              position: 'relative',
            }}
          >
            {/* Left: text content */}
            <div style={{ flex: '1 1 300px', maxWidth: 480 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '999px',
                  background: `${slide.color}18`,
                  border: `1px solid ${slide.color}44`,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: slide.color,
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                {slide.category}
              </span>
              <h3
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem,3vw,2.1rem)',
                  color: '#fff',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {slide.headline}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>{slide.body}</p>
              <button
                onClick={onNavigate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.6rem',
                  borderRadius: '0.85rem',
                  background: `linear-gradient(135deg,${slide.color},${slide.color}99)`,
                  color: '#090418',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${slide.color}40`,
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                Xem ngay <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Right: 3D illustration */}
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', padding: '1rem 2rem' }}>
              <SlideIllustration slide={slide} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow buttons */}
        {(['prev', 'next'] as const).map(dir_ => (
          <button
            key={dir_}
            onClick={() => resetTimer(dir_ === 'prev' ? -1 : 1)}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [dir_ === 'prev' ? 'left' : 'right']: '1.25rem',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${slide.color}40`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: `0 0 0 0 ${slide.color}00`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = `${slide.color}20`;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${slide.color}50`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            {dir_ === 'prev' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        ))}

        {/* Dot indicators */}
        <div
          style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                clearInterval(timerRef.current);
                setPage([i, i > idx ? 1 : -1]);
                timerRef.current = setInterval(() => paginate(1), 5000);
              }}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === idx ? slide.color : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
                boxShadow: i === idx ? `0 0 10px ${slide.color}80` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   STICKY FLOATING CTA
   ================================================================ */
const StickyCTA = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 90 }}
    >
      {/* Ping rings */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '999px',
          border: '1px solid rgba(0,245,255,0.4)',
          animation: 'neonPingOuter 2.5s ease-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-16px',
          borderRadius: '999px',
          border: '1px solid rgba(0,245,255,0.2)',
          animation: 'neonPingOuter 2.5s ease-out infinite 0.4s',
        }}
      />
      <button
        onClick={() => navigate('/market')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.75rem',
          borderRadius: '999px',
          background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
          color: '#090418',
          fontWeight: 800,
          fontSize: '0.95rem',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'Space Grotesk',sans-serif",
          animation: 'breatheGlow 2.5s ease-in-out infinite',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Khám phá ngay <ArrowRight size={17} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
};

/* ================================================================
   STUDENT HERO CHARACTER
   Effect 1: Spring Entrance  — Framer Motion spring on mount
   Effect 2: Zero-G Float     — CSS studentFloat keyframe + dynamic shadow
   Effect 3: Mouse Tilt       — onMouseMove perspective rotateX/Y
   ================================================================ */
const StudentHeroCharacter = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const py = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    setTiltY(px * 14);
    setTiltX(py * -11);
  }, []);

  const onLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setHovered(false);
  }, []);

  return (
    <motion.div
      id="student-hero-character"
      initial={{ opacity: 0, scale: 0.6, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 1.1, type: 'spring', stiffness: 110, damping: 13 }}
      style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Mouse-tilt wrapper */}
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: hovered ? 'transform 0.08s linear' : 'transform 0.65s cubic-bezier(0.16,1,0.3,1)',
          cursor: 'default',
          position: 'relative',
          width: 380,
          maxWidth: '90vw',
        }}
      >
        {/* Ambient glow behind image */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '75%',
            height: '75%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.18) 0%, rgba(155,77,255,0.10) 55%, transparent 80%)',
            filter: 'blur(45px)',
            animation: 'studentGlow 4s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Student image — Zero-G Float */}
        <img
          src={studentHeroImg}
          alt="UniPass sinh vien 3D"
          draggable={false}
          style={{
            width: '100%',
            objectFit: 'contain',
            display: 'block',
            position: 'relative',
            zIndex: 1,
            animation: 'studentFloat 4s ease-in-out infinite',
            filter: hovered
              ? 'drop-shadow(0 20px 50px rgba(0,245,255,0.55)) drop-shadow(0 0 80px rgba(155,77,255,0.3))'
              : 'drop-shadow(0 12px 30px rgba(0,245,255,0.30)) drop-shadow(0 0 50px rgba(155,77,255,0.15))',
            transition: 'filter 0.4s ease',
          }}
        />
      </div>

      {/* Dynamic ellipse shadow — breathes opposite to float for gravity illusion */}
      <div
        aria-hidden="true"
        style={{
          width: 200,
          height: 18,
          background: 'radial-gradient(ellipse, rgba(0,245,255,0.30) 0%, rgba(155,77,255,0.12) 50%, transparent 75%)',
          borderRadius: '50%',
          marginTop: '-6px',
          animation: 'shadowBreathe 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

/* ================================================================
   STAT BADGE
   ================================================================ */
const StatBadge = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.2rem',
      padding: '0.75rem 1.4rem',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(0,245,255,0.15)',
      borderRadius: '1rem',
      backdropFilter: 'blur(10px)',
    }}
  >
    <span
      style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontWeight: 700,
        fontSize: '1.45rem',
        background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {value}
    </span>
    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{label}</span>
  </motion.div>
);

/* ================================================================
   MINIMAL FOOTER
   ================================================================ */
const MinimalFooter = () => (
  <footer
    style={{
      borderTop: '1px solid rgba(0,245,255,0.07)',
      padding: '1.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      position: 'relative',
      zIndex: 1,
    }}
  >
    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
      © 2026 UniPass. All rights reserved. Made with ♥ for University Students.
    </p>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {[FaFacebook, FaInstagram, FaYoutube].map((Icon, i) => (
        <a
          key={i}
          href="#"
          style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s, filter 0.2s', display: 'flex' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#00F5FF';
            (e.currentTarget as HTMLAnchorElement).style.filter = 'drop-shadow(0 0 6px rgba(0,245,255,0.6))';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)';
            (e.currentTarget as HTMLAnchorElement).style.filter = 'none';
          }}
        >
          <Icon size={17} />
        </a>
      ))}
    </div>
  </footer>
);

/* ================================================================
   WELCOME3D — MAIN EXPORT
   ================================================================ */
export default function Welcome3D() {
  const navigate = useNavigate();

  // Auth state
  // const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  // const { isAuthenticated: isDemoAuth } = useAuth();
  // const isLoggedIn = isAuthenticated || isDemoAuth;

  // Local auth modal
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  // Sticky CTA: show after scrolling 60% of viewport height
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goMarket = () => navigate('/market');

  const features = [
    {
      id: 'f1',
      icon: <ShieldCheck size={26} color="#090418" strokeWidth={2.5} />,
      title: 'Xác thực sinh viên',
      desc: 'Chỉ sinh viên có email .edu đã xác thực mới được tham gia.',
      accent: '#00F5FF',
      delay: 0.1,
    },
    {
      id: 'f2',
      icon: <Users size={26} color="#090418" strokeWidth={2.5} />,
      title: 'Cộng đồng trường học',
      desc: 'Kết nối và giao dịch với hàng nghìn bạn sinh viên trong cùng khuôn viên.',
      accent: '#9B4DFF',
      delay: 0.22,
    },
    {
      id: 'f3',
      icon: <ShoppingBag size={26} color="#090418" strokeWidth={2.5} />,
      title: 'Giao dịch an toàn',
      desc: 'Hệ thống đánh giá, báo cáo và bảo vệ người mua giúp mọi giao dịch tin cậy.',
      accent: '#FF2D78',
      delay: 0.34,
    },
  ];

  return (
    <>
      {/* ── Injected keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* ── Root wrapper: NO overflow tricks, just min-h-screen ── */}
      <div
        id="welcome3d-root"
        style={{ minHeight: '100vh', background: '#090418', color: '#fff', position: 'relative', overflowX: 'hidden' }}
      >
        {/* Layer 0: Full-page starfield (fixed) */}
        <StarfieldCanvas />

        {/* Layer 0: Orbs (fixed position, behind all content) */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -22, 0], x: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            top: '-15%',
            left: '-8%',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,245,255,0.15) 0%,transparent 65%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 18, 0], x: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'fixed',
            top: '-5%',
            right: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(255,45,120,0.12) 0%,transparent 65%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut', delay: 6 }}
          style={{
            position: 'fixed',
            bottom: '-15%',
            left: '35%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(155,77,255,0.10) 0%,transparent 65%)',
            filter: 'blur(90px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 1: Floating pill navbar */}
        <WelcomeNav />

        {/* Layer 2: Page content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* ══ HERO ══ */}
          <section
            id="welcome-hero"
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7rem 2rem 4rem',
            }}
          >
            {/* Two-column layout: text left, character right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '3rem',
                maxWidth: 1200,
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              {/* ── LEFT: Text content ── */}
              <div style={{ flex: '1 1 400px', maxWidth: 580 }}>
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 1.1rem',
                    background: 'rgba(0,245,255,0.07)',
                    border: '1px solid rgba(0,245,255,0.22)',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: '#00F5FF',
                    marginBottom: '1.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  <Sparkles size={13} /> Chợ trường thế hệ mới · MarketPlace University
                </motion.div>

                {/* Headline */}
                <motion.h1
                  id="welcome-headline"
                  initial={{ opacity: 0, y: 60, rotateX: 18 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.22, duration: 1.05, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{
                    fontFamily: "'Space Grotesk','Inter',sans-serif",
                    fontSize: 'clamp(2.4rem,5.5vw,4.4rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(145deg,#FFFFFF 0%,#FFFFFF 30%,#00F5FF 62%,#9B4DFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1.25rem',
                  }}
                >
                  Chợ trường
                  <br />
                  an toàn của bạn
                </motion.h1>

                {/* Sub */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{
                    fontSize: 'clamp(0.95rem,1.8vw,1.1rem)',
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.75,
                    marginBottom: '2.25rem',
                  }}
                >
                  Nền tảng mua bán, trao đổi đồ dùng dành riêng cho sinh viên ĐH khu vực Hòa Lạc — xác thực, an toàn, và đầy cảm hứng.
                </motion.p>

                {/* CTA row */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58, duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
                >
                  <motion.button
                    id="welcome-cta-hero"
                    whileHover={{ scale: 1.07, boxShadow: '0 0 60px rgba(0,245,255,0.7),0 0 100px rgba(155,77,255,0.4)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={goMarket}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.9rem 2.2rem',
                      background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
                      color: '#090418',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: 800,
                      fontSize: '1rem',
                      border: 'none',
                      borderRadius: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 35px rgba(0,245,255,0.38)',
                      animation: 'breatheGlow 3.5s ease-in-out infinite',
                    }}
                  >
                    Khám phá ngay <ArrowRight size={18} strokeWidth={2.5} />
                  </motion.button>
                  <button
                    onClick={() => document.getElementById('welcome-slideshow')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{
                      padding: '0.9rem 1.6rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '1rem',
                      color: 'rgba(255,255,255,0.75)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.11)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                    }}
                  >
                    Tìm hiểu thêm ↓
                  </button>
                </motion.div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <StatBadge value="500+" label="Sinh viên đã tham gia" delay={0.75} />
                  <StatBadge value="1,000+" label="Sản phẩm được giao dịch" delay={0.85} />
                  <StatBadge value="99%" label="Giao dịch thành công" delay={0.95} />
                </div>
              </div>

              {/* ── RIGHT: Student Hero Character ── */}
              <StudentHeroCharacter />
            </div>
          </section>

          {/* ══ SLIDESHOW ══ */}
          <Slideshow onNavigate={goMarket} />

          {/* ══ FEATURES CARDS ══ */}
          <section id="welcome-features" style={{ padding: '4rem 1.5rem 6rem', maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <p
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#00F5FF',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                }}
              >
                <Zap size={12} /> Tại sao chọn UniPass?
              </p>
              <h2
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  background: 'linear-gradient(135deg,#fff 30%,#00F5FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Được xây dựng cho cộng đồng sinh viên
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
              {features.map(f => (
                <TiltCard key={f.id} {...f} />
              ))}
            </div>

            {/* Bottom CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.8 }}
              style={{
                marginTop: '3.5rem',
                padding: '2.5rem 2rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,245,255,0.12)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(14px)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: '#fff',
                    marginBottom: '0.4rem',
                  }}
                >
                  Sẵn sàng khám phá chợ sinh viên?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>
                  Hàng nghìn sản phẩm đang chờ bạn — sách, điện tử, nội thất và nhiều hơn nữa.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,245,255,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={goMarket}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
                  color: '#090418',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  fontFamily: "'Space Grotesk',sans-serif",
                  border: 'none',
                  borderRadius: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(0,245,255,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                Vào Marketplace <ArrowRight size={18} strokeWidth={2.5} />
              </motion.button>
            </motion.div>
          </section>

          {/* ══ MINIMAL FOOTER ══ */}
          <MinimalFooter />
        </div>

        {/* ══ STICKY CTA ══ */}
        <AnimatePresence>{showSticky && <StickyCTA key="sticky-cta" />}</AnimatePresence>

        {/* ══ LOCAL AUTH MODAL ══ */}
        {authModal && <AuthModal onClose={() => setAuthModal(null)} defaultTab={authModal} />}
      </div>
    </>
  );
}
