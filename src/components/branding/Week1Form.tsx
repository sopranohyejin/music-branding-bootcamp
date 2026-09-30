'use client';

import {
  Week1Data,
  ALLOW_PARTICIPANT_UNCOMPLETE,
  CompletedWeeks,
} from '@/lib/brandingBootcamp';
import MissionCard, { TextareaField } from './MissionCard';

interface Week1FormProps {
  data: Week1Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  onUpdate: (data: Week1Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

export default function Week1Form({
  data,
  isReleased,
  completedWeeks,
  onUpdate,
  onComplete,
  onUncomplete,
}: Week1FormProps) {
  const isCompleted = completedWeeks.week1;

  if (!isReleased) {
    return (
      <MissionCard
        title="1주차: 나는 음악가인가, 사업가인가?"
        subtitle="브랜딩 전략 이해 / 음악가 → 사업가 사고전환"
        locked
      />
    );
  }

  return (
    <div>
      {/* Week header */}
      <div
        className="rounded-2xl text-white p-6 mb-4"
        style={{ background: '#08224A' }}
      >
        <p
          className="text-xs uppercase tracking-wider font-semibold mb-2"
          style={{ color: '#F3D96B' }}
        >
          1주차 미션
        </p>
        <h3 className="text-lg font-bold mb-1">나는 음악가인가, 사업가인가?</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>브랜딩 전략 이해 / 음악가 → 사업가 사고전환</p>
        <p className="text-xs mt-3" style={{ color: '#6B7280' }}>
          소득 없는 음악인을 소득있는 음악인으로 만드는 현재 상태 진단
        </p>
      </div>

      {/* Mission */}
      <MissionCard
        title="현재 자기소개 작성"
        subtitle="현재 내가 하고 있는 일을 자기소개하기"
        guide={`브랜딩 부트캠프에서는 비즈니스 점검질문을 매주 업그레이드할 겁니다.\nBefore → After 결과물이 확실해지는 것을 목표로 사고하세요.`}
        locked={isCompleted}
      >
        <TextareaField
          label="현재 자기소개"
          value={data.currentIntro}
          onChange={(v) => onUpdate({ ...data, currentIntro: v })}
          placeholder="지금 현재 자신을 어떻게 소개하시나요? 솔직하게 작성해보세요."
          rows={5}
          disabled={isCompleted}
        />
      </MissionCard>

      {/* Complete button */}
      <CompleteButton
        isCompleted={isCompleted}
        weekLabel="1주차"
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    </div>
  );
}

// ─── Shared complete button ────────────────────────────────────────────────
interface CompleteButtonProps {
  isCompleted: boolean;
  weekLabel: string;
  onComplete: () => void;
  onUncomplete: () => void;
}

export function CompleteButton({
  isCompleted,
  weekLabel,
  onComplete,
  onUncomplete,
}: CompleteButtonProps) {
  if (isCompleted) {
    return (
      <div
        className="mt-4 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3"
        style={{ background: '#FFFBEA', border: '1px solid rgba(230,210,122,0.5)' }}
      >
        <div>
          <p className="font-bold" style={{ color: '#07152F' }}>✅ {weekLabel} 완료!</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">카톡 인증 완료</p>
        </div>
        {ALLOW_PARTICIPANT_UNCOMPLETE && (
          <button
            onClick={onUncomplete}
            className="text-xs border rounded-lg px-3 py-1.5 transition-colors"
            style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = '#374151';
              el.style.borderColor = '#374151';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = '#9CA3AF';
              el.style.borderColor = '#E5E7EB';
            }}
          >
            완료 취소
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-2xl bg-white p-5"
      style={{ border: '1px solid #EFE4B0' }}
    >
      <p className="text-xs text-[#9CA3AF] mb-3">
        카톡으로 인증 후 완료 버튼을 눌러주세요.
      </p>
      <button
        onClick={onComplete}
        className="w-full font-semibold py-3 rounded-xl transition-colors text-sm"
        style={{ background: '#F3D96B', color: '#07152F' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#E6C959'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3D96B'; }}
      >
        {weekLabel} 미션 완료하기
      </button>
    </div>
  );
}
