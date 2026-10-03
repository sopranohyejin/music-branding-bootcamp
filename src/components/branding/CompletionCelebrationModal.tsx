'use client';

import { useEffect, useRef } from 'react';

interface Props {
  participantName: string;
  onClose: () => void;
}

export default function CompletionCelebrationModal({ participantName, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    // 열릴 때 닫기 버튼에 포커스
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes celebrate-in {
          from { opacity: 0; transform: scale(0.82) translateY(28px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);     }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6) rotate(0deg);  }
          50%       { opacity: 1;   transform: scale(1.4) rotate(20deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 12px rgba(243,217,107,0.3); }
          50%       { text-shadow: 0 0 28px rgba(243,217,107,0.7); }
        }
        .celebrate-card { animation: celebrate-in 0.48s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .star-a { animation: twinkle 1.9s ease-in-out 0.0s infinite; }
        .star-b { animation: twinkle 2.2s ease-in-out 0.4s infinite; }
        .star-c { animation: twinkle 1.7s ease-in-out 0.7s infinite; }
        .star-d { animation: twinkle 2.4s ease-in-out 0.2s infinite; }
        .star-e { animation: twinkle 2.0s ease-in-out 0.9s infinite; }
        .star-f { animation: twinkle 1.6s ease-in-out 0.5s infinite; }
        .title-glow { animation: glow-pulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
        style={{ background: 'rgba(4,12,28,0.9)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        role="presentation"
      >
        {/* 카드 */}
        <div
          className="celebrate-card relative w-full max-w-sm rounded-3xl overflow-hidden text-center"
          style={{
            background: 'linear-gradient(160deg, #0C2040 0%, #060E22 60%, #040C1C 100%)',
            border: '1px solid rgba(243,217,107,0.22)',
            boxShadow:
              '0 0 0 1px rgba(243,217,107,0.08), 0 0 60px rgba(243,217,107,0.10), 0 24px 64px rgba(0,0,0,0.7)',
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="부트캠프 완주 축하"
        >
          {/* 닫기 버튼 */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#6B7F99', fontSize: '0.9rem' }}
          >
            ✕
          </button>

          {/* 상단 금빛 선 */}
          <div
            className="w-full h-0.5"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #F3D96B 50%, transparent 100%)' }}
          />

          {/* 반짝임 장식 */}
          <span className="star-a absolute pointer-events-none select-none" style={{ top: '13%', left: '8%',  color: '#F3D96B', fontSize: '0.75rem' }}>✦</span>
          <span className="star-b absolute pointer-events-none select-none" style={{ top: '19%', right: '9%', color: '#FFE566', fontSize: '0.7rem'  }}>★</span>
          <span className="star-c absolute pointer-events-none select-none" style={{ top: '6%',  left: '48%', color: '#F3D96B', fontSize: '0.9rem'  }}>✦</span>
          <span className="star-d absolute pointer-events-none select-none" style={{ bottom: '24%', left: '7%',  color: '#F3D96B', fontSize: '0.65rem', opacity: 0.8 }}>★</span>
          <span className="star-e absolute pointer-events-none select-none" style={{ bottom: '30%', right: '8%', color: '#FFE566', fontSize: '0.7rem'  }}>✦</span>
          <span className="star-f absolute pointer-events-none select-none" style={{ top: '52%', left: '4%',  color: '#F3D96B', fontSize: '0.6rem', opacity: 0.6 }}>✦</span>

          <div className="px-8 pt-8 pb-7">
            {/* 배지 */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(243,217,107,0.10)',
                border: '1px solid rgba(243,217,107,0.28)',
              }}
            >
              <span style={{ color: '#F3D96B', fontSize: '0.62rem', letterSpacing: '0.18em', fontWeight: 700 }}>
                ✦ BOOTCAMP COMPLETE ✦
              </span>
            </div>

            {/* 아이콘 */}
            <div className="text-5xl mb-1 leading-none">🎵</div>
            <div className="flex justify-center gap-1.5 mb-5 text-base">
              <span>🎶</span>
              <span>🎼</span>
              <span>🎶</span>
            </div>

            {/* 이름 */}
            <p className="mb-1 font-medium" style={{ color: '#7A90AD', fontSize: '0.875rem' }}>
              {participantName} 님
            </p>

            {/* 메인 타이틀 */}
            <h2
              className="title-glow text-2xl font-black mb-3 leading-tight"
              style={{ color: '#F3D96B' }}
            >
              헬퍼지니 음악인<br />브랜딩 부트캠프 완주!
            </h2>

            {/* 구분선 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(243,217,107,0.15)' }} />
              <span style={{ color: '#F3D96B', fontSize: '0.65rem' }}>✦</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(243,217,107,0.15)' }} />
            </div>

            {/* 서브 문구 */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: '#7A90AD' }}
            >
              소득없는 음악인에서 소득있는 음악인으로<br />
              가는 첫 걸음을 완성했어요.<br />
              <span style={{ color: '#8A9EB8' }}>헬퍼지니와 함께한 4주, 정말 잘 해내셨어요.</span>
            </p>

            {/* 주차별 완료 표시 */}
            <div className="flex justify-center gap-2 mb-5">
              {[
                { key: 'w1', label: '1주' },
                { key: 'w2', label: '2주' },
                { key: 'w3', label: '3주' },
                { key: 'w4', label: '4주' },
                { key: 'f',  label: '최종' },
              ].map((item) => (
                <div key={item.key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #F3D96B, #E6C84A)',
                      color: '#07152F',
                      boxShadow: '0 2px 8px rgba(243,217,107,0.35)',
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ color: '#4A5E78', fontSize: '0.58rem', fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 완료 상태 배지 */}
            <div
              className="rounded-xl px-4 py-2 mb-6"
              style={{
                background: 'rgba(243,217,107,0.07)',
                border: '1px solid rgba(243,217,107,0.14)',
              }}
            >
              <p style={{ color: '#D4AA30', fontSize: '0.72rem', fontWeight: 600 }}>
                전체 미션 완료 ✓
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #F3D96B, #E8CC40)',
                  color: '#07152F',
                  boxShadow: '0 4px 16px rgba(243,217,107,0.25)',
                }}
              >
                내 답변 다시 보기
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-60"
                style={{ color: '#4A5E78', background: 'transparent' }}
              >
                닫기
              </button>
            </div>
          </div>

          {/* 하단 금빛 선 */}
          <div
            className="w-full h-0.5"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #F3D96B 50%, transparent 100%)' }}
          />
        </div>
      </div>
    </>
  );
}
