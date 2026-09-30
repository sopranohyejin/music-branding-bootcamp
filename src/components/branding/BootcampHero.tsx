'use client';

import { useEffect, useState } from 'react';
import FlameProgress from './FlameProgress';
import {
  getNextLectureDate,
  formatCountdown,
  CompletedWeeks,
  calcFlameCount,
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
        try {
          return new Date(w.lectureDate).getTime() === nextDate.getTime();
        } catch {
          return false;
        }
      });
      setNextLectureLabel(week ? `다음 강의 (${week.label}) 까지` : '다음 강의까지');
      setCountdown(formatCountdown(nextDate));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const flameCount = calcFlameCount(completedWeeks);
  const releasedCount = mounted ? WEEKS.filter(isWeekReleased).length : 0;

  const currentWeek =
    WEEKS.find((w) => {
      if (!mounted) return false;
      return isWeekReleased(w) && !completedWeeks[w.id];
    }) ?? (mounted ? WEEKS.find((w) => isWeekReleased(w)) : null);

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: '#04152D' }}
    >
      {/* ── 배경 광원 레이어 1: 좌상단 크림 옐로우 글로우 ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-5%',
          width: '60%',
          height: '70%',
          background:
            'radial-gradient(ellipse at center, rgba(243,217,107,0.12) 0%, rgba(230,210,122,0.06) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* ── 배경 광원 레이어 2: 우하단 네이비 글로우 ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-8%',
          width: '55%',
          height: '65%',
          background:
            'radial-gradient(ellipse at center, rgba(8,34,74,0.6) 0%, rgba(4,21,45,0.3) 50%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── 배경 광원 레이어 3: 우상단 크림 포인트 ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          right: '10%',
          width: '28%',
          height: '35%',
          background:
            'radial-gradient(ellipse at center, rgba(255,242,168,0.08) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />

      {/* ── 도트 그리드 텍스처 ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── 골드 글로우 라인 (수평 구분선 느낌) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '42%',
          left: '0',
          right: '0',
          height: '1px',
          background:
            'linear-gradient(to right, transparent 0%, rgba(230,210,122,0.20) 30%, rgba(230,210,122,0.10) 70%, transparent 100%)',
        }}
      />

      {/* ── 음악 사인파 SVG (하단) ── */}
      <svg
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '80px', opacity: 0.15 }}
        aria-hidden="true"
      >
        <path
          d="M0,40 C60,10 120,70 180,40 C240,10 300,70 360,40 C420,10 480,70 540,40 C600,10 660,70 720,40 C780,10 840,70 900,40 C960,10 1020,70 1080,40 C1140,10 1180,55 1200,40"
          fill="none"
          stroke="#E6D27A"
          strokeWidth="2.5"
        />
        <path
          d="M0,45 C80,5 160,75 240,45 C320,5 400,75 480,45 C560,5 640,75 720,45 C800,5 880,75 960,45 C1040,5 1120,75 1200,45"
          fill="none"
          stroke="rgba(230,210,122,0.35)"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── 이퀄라이저 바 SVG (우측) ── */}
      <svg
        className="absolute right-8 top-1/2 pointer-events-none hidden md:block"
        viewBox="0 0 60 120"
        style={{ width: '60px', height: '120px', transform: 'translateY(-50%)', opacity: 0.15 }}
        aria-hidden="true"
      >
        {[0, 12, 24, 36, 48].map((x, i) => {
          const heights = [60, 90, 45, 75, 55];
          const h = heights[i];
          return (
            <rect
              key={i}
              x={x}
              y={120 - h}
              width="8"
              height={h}
              rx="4"
              fill="#E6D27A"
            />
          );
        })}
      </svg>

      <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Label badges */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5"
            style={{
              color: '#FFF2A8',
              border: '1px solid rgba(230,210,122,0.55)',
              background: 'rgba(230,210,122,0.08)',
            }}
          >
            4주 음악인 브랜딩 부트캠프
          </span>
          <span
            className="inline-block text-xs font-semibold rounded-full px-4 py-1.5"
            style={{
              color: '#07152F',
              background: '#FFF2A8',
              border: '1px solid rgba(230,210,122,0.8)',
            }}
          >
            헬퍼지니
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
          <span className="text-white">소득없는 음악인,</span>
          <br />
          <span style={{ color: '#FFF2A8' }}>소득있는 음악인</span>
          <span className="text-white">으로!</span>
        </h1>

        {/* Description */}
        <p className="text-[#B8C5D9] text-base md:text-lg leading-relaxed mb-8 max-w-xl">
          음악가가 자기 실력을 상품으로 연결하고, 고객을 이해하고,
          <br className="hidden md:block" />
          선택받는 구조를 만드는 비즈니스 사고 훈련입니다.
        </p>

        {/* Schedule info */}
        <p className="text-xs mb-3 leading-relaxed" style={{ color: '#7A8FA8' }}>
          📅 10/6(화) 시작 &nbsp;·&nbsp; 매주 화요일 21:00 강의 &nbsp;·&nbsp; 22:00 미션 공개
        </p>

        {/* Participant name */}
        <p className="text-sm mb-10" style={{ color: '#4A6080' }}>
          참가자:{' '}
          <span className="text-white font-semibold">{participantName}</span>
        </p>

        {/* Divider */}
        <div
          className="mb-10"
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.06) 60%, transparent)',
          }}
        />

        {/* Grid: progress + countdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Growth badge progress */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-xs uppercase tracking-widest" style={{ color: '#4A6080' }}>진행률</p>
            <FlameProgress count={flameCount} releasedCount={releasedCount} size="lg" />
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center md:items-end">
            {mounted && countdown ? (
              <>
                <div className="flex flex-col gap-0.5 text-center md:text-right mb-5">
                  <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: '#4A6080' }}>
                    매주 화요일 21:00 강의
                  </p>
                  <p className="text-xs leading-snug" style={{ color: '#4A6080' }}>{nextLectureLabel}</p>
                </div>
                <p
                  className="text-2xl md:text-3xl font-mono font-bold tabular-nums"
                  style={{ color: '#FFF2A8' }}
                >
                  {countdown}
                </p>
              </>
            ) : mounted ? (
              <p className="text-sm" style={{ color: '#4A6080' }}>모든 강의 완료 🎉</p>
            ) : (
              <>
                <div className="flex flex-col gap-0.5 text-center md:text-right mb-5">
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
        </div>

        {/* Current week card */}
        {mounted && currentWeek && (
          <div
            className="mt-10 rounded-2xl p-5"
            style={{
              border: '1px solid rgba(230,210,122,0.30)',
              background:
                'linear-gradient(135deg, rgba(255,242,168,0.06) 0%, rgba(255,242,168,0.02) 100%)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: '#F3D96B' }}
            >
              현재 진행 중
            </p>
            <p className="font-bold text-white text-lg">
              {currentWeek.label} · {currentWeek.title}
            </p>
            <p className="text-sm mt-1" style={{ color: '#B8C5D9' }}>{currentWeek.lectureTitle}</p>
            <p className="text-xs mt-3" style={{ color: '#4A6080' }}>
              별도 미션: {currentWeek.individualMissionTitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
