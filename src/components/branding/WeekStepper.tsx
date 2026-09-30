'use client';

import { WEEKS, CompletedWeeks, isWeekReleased } from '@/lib/brandingBootcamp';
import { useEffect, useState } from 'react';

interface WeekStepperProps {
  completedWeeks: CompletedWeeks;
  onWeekClick?: (weekId: string) => void;
}

export default function WeekStepper({ completedWeeks, onWeekClick }: WeekStepperProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-4">
      <div className="flex items-start justify-between gap-1 relative">
        {/* Connector line */}
        <div
          className="absolute top-6 left-8 right-8 h-px bg-[#E5E7EB] -z-0"
          style={{ display: WEEKS.length > 1 ? 'block' : 'none' }}
        />

        {WEEKS.map((week, idx) => {
          const isCompleted = completedWeeks[week.id];
          const isReleased = mounted ? isWeekReleased(week) : false;
          const isActive = isReleased && !isCompleted;

          return (
            <button
              key={week.id}
              onClick={() => onWeekClick?.(week.id)}
              className="flex flex-col items-center gap-2 z-10 group flex-1 min-w-0 cursor-pointer"
            >
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-[#E86A92] border-[#E86A92] text-white'
                    : isActive
                    ? 'bg-white border-[#E86A92] text-[#E86A92] group-hover:bg-[#FCE7EF]'
                    : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'
                }`}
              >
                {isCompleted ? '🔥' : idx + 1}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${
                    isCompleted
                      ? 'text-[#E86A92]'
                      : isActive
                      ? 'text-[#1F2937]'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  {week.label}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5 hidden sm:block leading-tight max-w-[80px]">
                  {isCompleted ? '완료' : isReleased && mounted ? '진행 중' : '미공개'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
