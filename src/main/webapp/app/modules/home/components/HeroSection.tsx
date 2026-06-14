import '../home.scss';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Shield, Users, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import studentHeroImg from '../../../../content/images/student-hero.png';

/* ============================================================
   LOCAL KEYFRAMES (scoped to hero section)
   ============================================================ */
const HERO_STYLES = `
  @keyframes heroFloat {
    0%,100% { transform: translateY(0px) rotate(-0.4deg); }
    50%      { transform: translateY(-14px) rotate(0.4deg); }
  }
  @keyframes heroShadow {
    0%,100% { transform: scaleX(1);    opacity: 0.40; filter: blur(7px); }
    50%      { transform: scaleX(0.70); opacity: 0.18; filter: blur(13px); }
  }
  @keyframes heroGlow {
    0%,100% { opacity: 0.50; }
    50%      { opacity: 0.80; }
  }
  /* Mobile responsive tweaks */
  @media (max-width: 640px) {
    #hero-section-wrapper .hero-slide-inner {
      padding: 1rem 1.25rem 1.5rem !important;
    }
    #hero-section-wrapper .hero-student-col {
      display: none !important;
    }
  }
`;

/* ============================================================
   SLIDE DATA
   ============================================================ */
interface Slide {
  id: string;
  tag: string;
  headline: string;
  sub: string;
  cta: string;
  color: string;
  colorB: string;
  badge1: string;
  badge2: string;
  icon: React.ElementType;
}

const SLIDES: Slide[] = [
  {
    id: 'slide-verified',
    tag: 'Xác thực & Tin cậy',
    headline: 'Chỉ sinh viên 100% xác thực .edu',
    sub: 'Mỗi tài khoản đều được xác thực qua email sinh viên. Mua bán an tâm, không lo gian lận.',
    cta: 'Khám phá ngay',
    color: '#00F5FF',
    colorB: '#0099AA',
    badge1: '500+ sinh viên',
    badge2: 'Email .edu verified',
    icon: Shield,
  },
  {
    id: 'slide-community',
    tag: 'Cộng đồng trường học',
    headline: 'Kết nối với bạn bè\ncùng khuôn viên',
    sub: 'Trao đổi sách, đồ dùng, thiết bị điện tử với người bạn thực sự tin tưởng — cùng trường.',
    cta: 'Xem sản phẩm',
    color: '#9B4DFF',
    colorB: '#6A1FCC',
    badge1: '1,000+ giao dịch',
    badge2: 'Trong khuôn viên',
    icon: Users,
  },
  {
    id: 'slide-deals',
    tag: 'Mua bán thông minh',
    headline: 'Tiết kiệm đến 70%\nso với mua mới',
    sub: 'Từ sách giáo trình đến laptop, tai nghe — hàng nghìn sản phẩm chất lượng giá cực tốt.',
    cta: 'Mua ngay',
    color: '#FF2D78',
    colorB: '#BB0050',
    badge1: '1,500+ sản phẩm',
    badge2: 'Cập nhật mỗi ngày',
    icon: ShoppingBag,
  },
];

const SLIDE_VARIANTS = {
  enter: (d: number) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-55%' : '55%', opacity: 0, scale: 0.95 }),
};

/* ============================================================
   MINI STUDENT CHARACTER — floats inside each slide
   ============================================================ */
interface MiniStudentProps {
  color: string;
}

const MiniStudentHero = ({ color }: MiniStudentProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTiltY(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 12);
    setTiltX(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -9);
  }, []);

  const onLeave = useCallback(() => {
    setTiltX(0);
    setTiltY(0);
    setHov(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.08, duration: 0.75, type: 'spring', stiffness: 120, damping: 14 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
    >
      {/* Mouse-tilt + float wrapper */}
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: hov ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          width: 220,
          cursor: 'default',
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '80%',
            background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`,
            filter: 'blur(30px)',
            animation: 'heroGlow 3.5s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Student image — Zero-G Float */}
        <img
          src={studentHeroImg}
          alt="UniPass sinh viên"
          draggable={false}
          style={{
            width: '100%',
            objectFit: 'contain',
            display: 'block',
            position: 'relative',
            zIndex: 1,
            animation: 'heroFloat 3.8s ease-in-out infinite',
            filter: hov
              ? `drop-shadow(0 14px 36px ${color}88) drop-shadow(0 0 55px ${color}44)`
              : `drop-shadow(0 8px 22px ${color}55) drop-shadow(0 0 35px ${color}22)`,
            transition: 'filter 0.35s ease',
          }}
        />
      </div>

      {/* Dynamic ellipse shadow */}
      <div
        aria-hidden="true"
        style={{
          width: 110,
          height: 12,
          background: `radial-gradient(ellipse, ${color}44 0%, ${color}18 50%, transparent 75%)`,
          borderRadius: '50%',
          marginTop: '-4px',
          animation: 'heroShadow 3.8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

/* ============================================================
   HERO SLIDESHOW SECTION
   ============================================================ */
interface HeroSectionProps {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const navigate = useNavigate();
  const [[idx, dir], setPage] = useState([0, 0]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = useCallback((newDir: number) => {
    setPage(([cur]) => [(cur + newDir + SLIDES.length) % SLIDES.length, newDir]);
  }, []);

  const resetAndGo = (d: number) => {
    clearInterval(timerRef.current);
    goTo(d);
    timerRef.current = setInterval(() => goTo(1), 5500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(1), 5500);
    return () => clearInterval(timerRef.current);
  }, [goTo]);

  const slide = SLIDES[idx];
  const Icon = slide.icon;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_STYLES }} />

      <section
        id="hero-section-wrapper"
        className="relative overflow-hidden text-[#1e293b]"
        style={{
          background: 'linear-gradient(160deg, #F8FAFC 0%, #F0F9FF 35%, #EDE9FE 70%, #FDF2F8 100%)',
          /* ── 1/3 smaller: was padding ~4.5rem top/bottom → now 1.5rem ── */
          minHeight: 0,
        }}
        aria-label="Hero slideshow"
      >
        {/* Ambient colour orb */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${slide.color}14 0%, transparent 65%)`,
            filter: 'blur(60px)',
            transition: 'background 0.7s ease',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Slide stage */}
        <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={idx}
              custom={dir}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="hero-slide-inner"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap',
                padding: '1.5rem 3.5rem 2rem',
                maxWidth: 1100,
                margin: '0 auto',
              }}
            >
              {/* ── LEFT: text content ── */}
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                {/* Tag chip */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.45 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.28rem 0.8rem',
                    background: `${slide.color}18`,
                    border: `1px solid ${slide.color}44`,
                    borderRadius: 999,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: slide.color,
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Sparkles size={10} /> {slide.tag}
                </motion.div>

                {/* Headline */}
                <motion.h2
                  id={`hero-headline-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{
                    fontFamily: "'Space Grotesk','Inter',sans-serif",
                    fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    background: `linear-gradient(135deg, #1e293b 30%, ${slide.color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    whiteSpace: 'pre-line',
                    marginBottom: '0.6rem',
                  }}
                >
                  {slide.headline}
                </motion.h2>

                {/* Sub — hidden on very small screens, shown md+ */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.5 }}
                  style={{
                    color: '#475569',
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    marginBottom: '0.9rem',
                    maxWidth: 400,
                  }}
                >
                  {slide.sub}
                </motion.p>

                {/* Badges + CTA row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.5 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
                >
                  {/* Badge pills */}
                  {[slide.badge1, slide.badge2].map((b, i) => (
                    <span
                      key={b}
                      style={{
                        padding: '0.28rem 0.7rem',
                        background: '#fff',
                        border: `1px solid ${slide.color}40`,
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#334155',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      }}
                    >
                      {i === 0 ? (
                        <Star size={9} fill={slide.color} stroke={slide.color} />
                      ) : (
                        <Zap size={9} fill={slide.color} stroke={slide.color} />
                      )}
                      {b}
                    </span>
                  ))}

                  {/* CTA button */}
                  <motion.button
                    id={`hero-cta-${idx}`}
                    whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${slide.color}88` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCtaClick ?? (() => navigate('/market'))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1.2rem',
                      background: `linear-gradient(135deg, ${slide.color}, ${slide.colorB})`,
                      color: '#090418',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      fontFamily: "'Space Grotesk',sans-serif",
                      border: 'none',
                      borderRadius: '0.6rem',
                      cursor: 'pointer',
                      boxShadow: `0 0 18px ${slide.color}44`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={14} strokeWidth={2.5} />
                    {slide.cta}
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              </div>

              {/* ── RIGHT: mini student character — hidden on mobile via CSS ── */}
              <div className="hero-student-col">
                <MiniStudentHero key={`student-${idx}`} color={slide.color} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {(['prev', 'next'] as const).map(d_ => (
          <button
            key={d_}
            onClick={() => resetAndGo(d_ === 'prev' ? -1 : 1)}
            aria-label={d_ === 'prev' ? 'Slide trước' : 'Slide tiếp theo'}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [d_ === 'prev' ? 'left' : 'right']: '0.75rem',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              border: `1px solid ${slide.color}40`,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 15px ${slide.color}40`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }}
          >
            {d_ === 'prev' ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        ))}

        {/* Dot indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.6rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 10,
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                clearInterval(timerRef.current);
                setPage([i, i > idx ? 1 : -1]);
                timerRef.current = setInterval(() => goTo(1), 5500);
              }}
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: i === idx ? slide.color : 'rgba(0,0,0,0.1)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
                boxShadow: i === idx ? `0 0 8px ${slide.color}90` : 'none',
              }}
              aria-label={`Đến slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
