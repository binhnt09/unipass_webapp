import React, { useState } from 'react';
import { AIChatSupport } from './AIChatSupport';
import aiRobotImg from '../../../content/images/ai-robot.png';

/* ─── Keyframes injected once ─── */
const ROBOT_STYLES = `
  @keyframes robotFloat {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    50%      { transform: translateY(-12px) rotate(1deg); }
  }
  @keyframes robotGlow {
    0%,100% {
      filter: drop-shadow(0 8px 24px rgba(0,215,200,0.50))
              drop-shadow(0 0 40px rgba(0,215,200,0.20));
    }
    50% {
      filter: drop-shadow(0 16px 40px rgba(0,215,200,0.85))
              drop-shadow(0 0 70px rgba(0,215,200,0.40));
    }
  }
  @keyframes robotWiggle {
    0%,100% { transform: rotate(0deg)   scale(1.12); }
    20%      { transform: rotate(-8deg)  scale(1.12); }
    40%      { transform: rotate(7deg)   scale(1.12); }
    60%      { transform: rotate(-5deg)  scale(1.12); }
    80%      { transform: rotate(4deg)   scale(1.12); }
  }
  @keyframes pingRing {
    0%   { transform: scale(1);   opacity: 0.55; }
    100% { transform: scale(1.9); opacity: 0;    }
  }
`;

export function AIChatButton() {
  const [showChat, setShowChat] = useState(false);
  const [hovered, setHovered] = useState(false);

  React.useEffect(() => {
    const handleOpenChat = () => setShowChat(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ROBOT_STYLES }} />

      {/* ── Floating Robot Button ── */}
      {!showChat && (
        <div
          id="ai-robot-btn-wrapper"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 50,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setShowChat(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          role="button"
          aria-label="Mở hỗ trợ AI"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setShowChat(true)}
        >
          {/* Ping rings — visible only when not hovered */}
          {!hovered && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'rgba(0,215,200,0.25)',
                  animation: 'pingRing 2.2s ease-out infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '-18px',
                  borderRadius: '50%',
                  background: 'rgba(0,215,200,0.12)',
                  animation: 'pingRing 2.2s ease-out infinite 0.45s',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          {/* Robot image */}
          <img
            src={aiRobotImg}
            alt="UniPass AI Assistant"
            draggable={false}
            style={{
              width: 80,
              height: 80,
              objectFit: 'contain',
              display: 'block',
              // Wiggle on hover, breathing float when idle
              animation: hovered
                ? 'robotWiggle 0.55s ease-in-out'
                : 'robotFloat 3.8s ease-in-out infinite, robotGlow 3.8s ease-in-out infinite',
              transition: 'transform 0.2s ease',
              // Subtle drop-shadow always on
              filter: hovered ? 'drop-shadow(0 12px 30px rgba(0,215,200,0.9)) drop-shadow(0 0 60px rgba(0,215,200,0.5))' : undefined,
            }}
          />

          {/* Online dot */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2.5px solid #fff',
              boxShadow: '0 0 8px rgba(34,197,94,0.7)',
            }}
          />

          {/* Tooltip */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                right: 0,
                background: 'rgba(9,4,24,0.92)',
                border: '1px solid rgba(0,215,200,0.3)',
                borderRadius: '0.65rem',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                pointerEvents: 'none',
              }}
            >
              💬 Hỏi AI của UniPass
            </div>
          )}
        </div>
      )}

      {/* ── Chat Window ── */}
      {showChat && <AIChatSupport onClose={() => setShowChat(false)} />}
    </>
  );
}
