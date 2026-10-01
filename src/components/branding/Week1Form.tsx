'use client';

import { useEffect, useState } from 'react';
import {
  Week1Data,
  ALLOW_PARTICIPANT_UNCOMPLETE,
  CompletedWeeks,
} from '@/lib/brandingBootcamp';
import MissionCard from './MissionCard';

interface Week1FormProps {
  data: Week1Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  isLocked: boolean;
  onUpdate: (data: Week1Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

export default function Week1Form({
  data,
  isReleased,
  completedWeeks,
  isLocked,
  onUpdate,
  onComplete,
  onUncomplete,
}: Week1FormProps) {
  const isCompleted = completedWeeks.week1;

  // 편집 중인 필드 Set
  const [editingSet, setEditingSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (!data.currentIntro) s.add('currentIntro');
    return s;
  });

  // 완료 시 전체 읽기모드로
  useEffect(() => {
    if (isCompleted) setEditingSet(new Set());
  }, [isCompleted]);

  if (!isReleased) {
    return (
      <MissionCard
        title="1주차: 나는 음악가인가, 사업가인가?"
        subtitle="브랜딩 전략 이해 / 음악가 → 사업가 사고전환"
        locked
      />
    );
  }

  const isEditing = !isLocked && editingSet.has('currentIntro');

  return (
    <div>
      {/* 주차 헤더 */}
      <div className="rounded-2xl text-white p-6 mb-4" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>
          1주차 미션
        </p>
        <h3 className="text-lg font-bold mb-1">나는 음악가인가, 사업가인가?</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>브랜딩 전략 이해 / 음악가 → 사업가 사고전환</p>
        <p className="text-xs mt-3" style={{ color: '#6B7280' }}>
          소득 없는 음악인을 소득있는 음악인으로 만드는 현재 상태 진단
        </p>
      </div>

      {isLocked && (
        <p className="text-xs mb-3 font-medium" style={{ color: '#9CA3AF' }}>
          🔒 지난 주차의 답변은 읽기 전용입니다.
        </p>
      )}

      {/* 미션 카드 */}
      <MissionCard
        title="현재 자기소개 작성"
        subtitle="현재 내가 하고 있는 일을 자기소개하기"
        guide={`브랜딩 부트캠프에서는 비즈니스 점검질문을 매주 업그레이드할 겁니다.\nBefore → After 결과물이 확실해지는 것을 목표로 사고하세요.`}
      >
        {/* 라벨 + 수정 버튼 */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#374151]">현재 자기소개</p>
          {!isLocked && !isEditing && (
            <button
              onClick={() => setEditingSet((p) => new Set(p).add('currentIntro'))}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}
            >
              수정하기
            </button>
          )}
        </div>

        {isEditing ? (
          <>
            <textarea
              value={data.currentIntro}
              onChange={(e) => onUpdate({ ...data, currentIntro: e.target.value })}
              placeholder="지금 현재 자신을 어떻게 소개하시나요? 솔직하게 작성해보세요."
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#07152F] transition-colors"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  onUpdate({ ...data, currentIntro: data.currentIntro });
                  setEditingSet((p) => { const n = new Set(p); n.delete('currentIntro'); return n; });
                }}
                className="text-xs px-4 py-1.5 rounded-lg font-semibold"
                style={{ background: '#08224A', color: '#FFF2A8' }}
              >
                저장하기
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl px-4 py-3 min-h-[5rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            {data.currentIntro ? (
              <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{data.currentIntro}</p>
            ) : (
              <p className="text-sm text-[#D1D5DB]">—</p>
            )}
          </div>
        )}
      </MissionCard>

      {/* 완료 버튼 */}
      <CompleteButton
        isCompleted={isCompleted}
        isLocked={isLocked}
        weekLabel="1주차"
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    </div>
  );
}

// ─── 공유 완료 버튼 ──────────────────────────────────────────────────────────
interface CompleteButtonProps {
  isCompleted: boolean;
  isLocked: boolean;
  weekLabel: string;
  onComplete: () => void;
  onUncomplete: () => void;
}

export function CompleteButton({
  isCompleted,
  isLocked,
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
        {ALLOW_PARTICIPANT_UNCOMPLETE && !isLocked && (
          <button
            onClick={onUncomplete}
            className="text-xs border rounded-lg px-3 py-1.5 transition-colors"
            style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = '#374151'; el.style.borderColor = '#374151'; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = '#9CA3AF'; el.style.borderColor = '#E5E7EB'; }}
          >
            완료 취소
          </button>
        )}
      </div>
    );
  }

  if (isLocked) return null;

  return (
    <div className="mt-4 rounded-2xl bg-white p-5" style={{ border: '1px solid #EFE4B0' }}>
      <p className="text-xs text-[#9CA3AF] mb-3">카톡으로 인증 후 완료 버튼을 눌러주세요.</p>
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
