'use client';

import { useEffect, useState } from 'react';
import {
  getNextLectureDate,
  formatCountdown,
  CompletedWeeks,
  WEEKS,
  isWeekReleased,
} from '@/lib/brandingBootcamp';

interface BootcampHeroProps {
  participantName: string;
  completedWeeks: CompletedWeeks;
}

export default function BootcampHero({ participantName, completedWeeks }: BootcampHeroProps) {
  const [countdown, setCountdown] = useState('');
  const [nextLectureLabel, setNextLectureLabel] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const nextDate = getNextLectureDate();
      if (!nextDate) {
        setCountdown('');
        setNextLectureLabel('');
        return;
      }
      const week = WEEKS.find((w) => {
        try { return new Date(w.lectureDate).getTime() === nextDate.getTime(); }
        catch { return false; }
      });
      setNextLectureLabel(week ? `다음 강의 (${week.label}) 까지` : '다음 강의까지');
      setCountdown(formatCountdown(nextDate));
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentWeek =
    WEEKS.find((w) => {
      if (!mounted) return false;
      return isWeekReleased(w) && !completedWeeks[w.id];
    }) ?? (mounted ? WEEKS.find((w) => isWeekReleased(w)) : null);

  return (
    <section className="relative text-white overflow-hidden" style={{ backgroundColor: '#04152D' }}>

      {/* ── 배경 광원 1: 좌상단 ── */}
      <div className="absolute pointer-events-none" style={{ top: '-10%', left: '-5%', width: '60%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(243,217,107,0.12) 0%, rgba(230,210,122,0.06) 40%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* ── 배경 광원 2: 우하단 ── */}
      <div className="absolute pointer-events-none" style={{ bottom: '-10%', right: '-8%', width: '55%', height: '65%', background: 'radial-gradient(ellipse at center, rgba(8,34,74,0.6) 0%, rgba(4,21,45,0.3) 50%, transparent 75%)', filter: 'blur(40px)' }} />

      {/* ── 배경 광원 3: 우상단 ── */}
      <div className="absolute pointer-events-none" style={{ top: '5%', right: '10%', width: '28%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(255,242,168,0.08) 0%, transparent 65%)', filter: 'blur(30px)' }} />

      {/* ── 도트 그리드 텍스처 ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* ── 골드 글로우 라인 ── */}
      <div className="absolute pointer-events-none" style={{ top: '42%', left: '0', right: '0', height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(230,210,122,0.20) 30%, rgba(230,210,122,0.10) 70%, transparent 100%)' }} />

      {/* ── 음악 사인파 (하단) ── */}
      <svg className="absolute bottom-0 left-0 right-0 pointer-events-none" viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ width: '100%', height: '80px', opacity: 0.15 }} aria-hidden="true">
        <path d="M0,40 C60,10 120,70 180,40 C240,10 300,70 360,40 C420,10 480,70 540,40 C600,10 660,70 720,40 C780,10 840,70 900,40 C960,10 1020,70 1080,40 C1140,10 1180,55 1200,40" fill="none" stroke="#E6D27A" strokeWidth="2.5" />
        <path d="M0,45 C80,5 160,75 240,45 C320,5 400,75 480,45 C560,5 640,75 720,45 C800,5 880,75 960,45 C1040,5 1120,75 1200,45" fill="none" stroke="rgba(230,210,122,0.35)" strokeWidth="1.5" />
      </svg>

      {/* ── 이퀄라이저 (우측 중앙) ── */}
      <svg className="absolute right-8 top-1/2 pointer-events-none hidden md:block" viewBox="0 0 60 120" style={{ width: '60px', height: '120px', transform: 'translateY(-50%)', opacity: 0.15 }} aria-hidden="true">
        {[0, 12, 24, 36, 48].map((x, i) => {
          const h = [60, 90, 45, 75, 55][i];
          return <rect key={i} x={x} y={120 - h} width="8" height={h} rx="4" fill="#E6D27A" />;
        })}
      </svg>

      {/* ── 지니 램프 배경 장식 (우하단) ── */}
      <svg
        className="absolute pointer-events-none hidden sm:block"
        viewBox="0 0 300 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ bottom: '-10px', right: '30px', width: '260px', height: 'auto', opacity: 0.08 }}
        aria-hidden="true"
      >
        {/* 램프 몸통 */}
        <path d="M92,172 C87,142 98,112 128,97 C158,82 200,85 222,106 C244,127 240,158 222,175 C204,192 168,200 138,197 C108,194 97,202 92,172Z" stroke="#E6D27A" strokeWidth="2.2" />
        {/* 목 */}
        <path d="M122,97 C118,82 126,67 138,59 C150,51 166,50 174,61 C182,72 170,85 155,97" stroke="#E6D27A" strokeWidth="2" fill="none" />
        {/* 뚜껑 */}
        <ellipse cx="148" cy="58" rx="28" ry="9" stroke="#E6D27A" strokeWidth="2" />
        <path d="M128,49 C128,40 137,33 148,33 C159,33 168,40 168,49" stroke="#E6D27A" strokeWidth="1.8" fill="none" />
        {/* 주둥이 (좌) */}
        <path d="M92,152 C74,140 53,120 37,100 C24,85 33,68 48,77 C59,84 69,108 85,140" stroke="#E6D27A" strokeWidth="2" fill="none" />
        {/* 손잡이 (우) */}
        <path d="M222,138 C252,125 264,96 247,78 C236,66 218,73 222,93" stroke="#E6D27A" strokeWidth="2" fill="none" />
        {/* 받침 */}
        <path d="M102,197 C102,216 118,228 145,228 C172,228 190,216 190,197" stroke="#E6D27A" strokeWidth="1.8" fill="none" />
        <ellipse cx="146" cy="229" rx="44" ry="7" stroke="#E6D27A" strokeWidth="1.4" opacity="0.55" />
        {/* 불꽃 */}
        <path d="M142,33 C138,17 146,5 149,-2 C152,5 158,12 155,24 C152,33 144,37 142,33Z" stroke="#E6D27A" strokeWidth="1.5" fill="none" opacity="0.75" />
      </svg>

      <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">

        {/* ── 배지: 헬퍼지니 먼저 ── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span
            className="inline-block text-xs font-semibold rounded-full px-4 py-1.5"
            style={{ color: '#07152F', background: '#FFF2A8', border: '1px solid rgba(230,210,122,0.8)' }}
          >
            헬퍼지니
          </span>
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5"
            style={{ color: '#FFF2A8', border: '1px solid rgba(230,210,122,0.55)', background: 'rgba(230,210,122,0.08)' }}
          >
            4주 음악인 브랜딩 부트캠프
          </span>
        </div>

        {/* ── 타이틀 ── */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
          <span className="text-white">소득없는 음악인,</span>
          <br />
          <span style={{ color: '#FFF2A8' }}>소득있는 음악인</span>
          <span className="text-white">으로!</span>
        </h1>

        {/* ── 본문 설명 (수정됨: 고객을 이해하며) ── */}
        <p className="text-[#B8C5D9] text-base md:text-lg leading-relaxed mb-6 max-w-xl">
          음악가가 자기 실력을 상품으로 연결하고, 고객을 이해하며
          <br className="hidden md:block" />
          선택받는 구조를 만드는 비즈니스 사고 훈련입니다.
        </p>

        {/* ── 일정 강조 배지 ── */}
        <div
          className="inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 mb-5"
          style={{ background: 'rgba(230,210,122,0.09)', border: '1px solid rgba(230,210,122,0.30)' }}
        >
          <span className="text-base leading-none select-none">📅</span>
          <span className="text-sm font-semibold leading-snug" style={{ color: '#D4BC6A' }}>
            10/6(화) 시작&nbsp;·&nbsp;매주 화요일 21:00 강의&nbsp;·&nbsp;22:00 미션 공개
          </span>
        </div>

        {/* ── 참가자 이름 ── */}
        <p className="text-sm mb-10" style={{ color: '#7A8FA8' }}>
          음악인으로 반드시 성공할{' '}
          <span className="font-bold" style={{ color: '#FFF2A8' }}>{participantName}</span>
        </p>

        {/* ── 구분선 ── */}
        <div className="mb-8" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.06) 60%, transparent)' }} />

        {/* ── 미션 진행 현황 (주차별 스텝) ── */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-6 text-center" style={{ color: '#4A6080' }}>
            미션 진행 현황
          </p>

          <div className="relative flex justify-between items-start px-2">
            {/* 연결선 */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '26px',
                left: '12.5%',
                right: '12.5%',
                height: '1px',
                background: 'linear-gradient(to right, rgba(230,210,122,0.12), rgba(230,210,122,0.28), rgba(230,210,122,0.12))',
              }}
            />

            {WEEKS.map((week, i) => {
              const released = mounted && isWeekReleased(week);
              const completed = completedWeeks[week.id as keyof CompletedWeeks];

              return (
                <div key={week.id} className="flex flex-col items-center text-center z-10" style={{ width: '25%' }}>

                  {/* 아이콘 영역 */}
                  <div className="mb-3" style={{ width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!released ? (
                      /* 잠금 */
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    ) : completed ? (
                      /* 완료 – 골드 별 + 글로우 */
                      <div style={{ filter: 'drop-shadow(0 0 8px rgba(255,228,80,0.55))' }}>
                        <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
                          <defs>
                            <radialGradient id={`sg${i}`} cx="50%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#FFEE80" />
                              <stop offset="55%" stopColor="#F3D96B" />
                              <stop offset="100%" stopColor="#C9A227" />
                            </radialGradient>
                          </defs>
                          <polygon
                            points="26,4 32.8,18.4 47.5,19 38.3,30.5 43.1,45.4 26,38.4 8.9,45.4 13.7,30.5 4.5,19 19.2,18.4"
                            fill={`url(#sg${i})`}
                            stroke="rgba(255,242,168,0.65)"
                            strokeWidth="0.8"
                          />
                        </svg>
                      </div>
                    ) : (
                      /* 열림·미완료 – 흐린 골드 윤곽 별 */
                      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
                        <polygon
                          points="26,4 32.8,18.4 47.5,19 38.3,30.5 43.1,45.4 26,38.4 8.9,45.4 13.7,30.5 4.5,19 19.2,18.4"
                          fill="rgba(230,210,122,0.08)"
                          stroke="rgba(230,210,122,0.38)"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </div>

                  {/* 주차 레이블 */}
                  <p
                    className="text-xs font-bold mb-1"
                    style={{
                      color: completed
                        ? '#FFF2A8'
                        : released
                        ? 'rgba(255,242,168,0.52)'
                        : 'rgba(255,255,255,0.20)',
                    }}
                  >
                    {week.label}
                  </p>

                  {/* 주차 제목 */}
                  <p
                    className="text-xs leading-snug hidden sm:block"
                    style={{
                      color: completed
                        ? 'rgba(184,197,217,0.85)'
                        : released
                        ? 'rgba(184,197,217,0.42)'
                        : 'rgba(255,255,255,0.14)',
                      maxWidth: '88px',
                    }}
                  >
                    {week.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 카운트다운 ── */}
        <div className="flex flex-col items-center md:items-end">
          {mounted && countdown ? (
            <>
              <div className="flex flex-col gap-0.5 text-center md:text-right mb-4">
                <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: '#4A6080' }}>
                  매주 화요일 21:00 강의
                </p>
                <p className="text-xs leading-snug" style={{ color: '#4A6080' }}>{nextLectureLabel}</p>
              </div>
              <p className="text-2xl md:text-3xl font-mono font-bold tabular-nums" style={{ color: '#FFF2A8' }}>
                {countdown}
              </p>
            </>
          ) : mounted ? (
            <p className="text-sm" style={{ color: '#4A6080' }}>모든 강의 완료 🎉</p>
          ) : (
            <>
              <div className="flex flex-col gap-0.5 text-center md:text-right mb-4">
                <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: '#4A6080' }}>
                  매주 화요일 21:00 강의
                </p>
              </div>
              <p className="text-2xl font-mono tabular-nums" style={{ color: 'rgba(255,242,168,0.35)' }}>
                ––:––:––
              </p>
            </>
          )}
        </div>

        {/* ── 현재 진행 중 카드 ── */}
        {mounted && currentWeek && (
          <div
            className="mt-10 rounded-2xl p-5"
            style={{ border: '1px solid rgba(230,210,122,0.30)', background: 'linear-gradient(135deg, rgba(255,242,168,0.06) 0%, rgba(255,242,168,0.02) 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#F3D96B' }}>
              현재 진행 중
            </p>
            <p className="font-bold text-white text-lg">{currentWeek.label} · {currentWeek.title}</p>
            <p className="text-sm mt-1" style={{ color: '#B8C5D9' }}>{currentWeek.lectureTitle}</p>
            <p className="text-xs mt-3" style={{ color: '#4A6080' }}>별도 미션: {currentWeek.individualMissionTitle}</p>
          </div>
        )}
      </div>
    </section>
  );
}
