'use client';

import { useState } from 'react';
import {
  FinalData,
  Week1Data,
  CompletedWeeks,
  CommonMissions,
  COMMON_MISSION_QUESTIONS,
  copyToClipboard,
  TEST_MODE,
} from '@/lib/brandingBootcamp';

interface FinalMissionFormProps {
  finalData: FinalData;
  week1Data: Week1Data;
  commonMissions: CommonMissions;
  completedWeeks: CompletedWeeks;
  bypassLock?: boolean;
  onUpdate: (data: FinalData) => void;
  onShowToast: (msg: string) => void;
}

const WEEK_LABELS: Record<keyof CommonMissions, string> = {
  week1: '1주차',
  week2: '2주차',
  week3: '3주차',
  week4: '4주차',
};

export default function FinalMissionForm({
  finalData,
  week1Data,
  commonMissions,
  completedWeeks,
  bypassLock = false,
  onUpdate,
  onShowToast,
}: FinalMissionFormProps) {
  const allCompleted = Object.values(completedWeeks).every(Boolean);
  const [recordTab, setRecordTab] = useState<keyof CommonMissions>('week1');

  // 테스트 모드 또는 테스트 계정(bypassLock)이면 잠금 우회 / 운영 모드에서는 4주 완료 필요
  if (!TEST_MODE && !allCompleted && !bypassLock) {
    const completedCount = Object.values(completedWeeks).filter(Boolean).length;
    return (
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="font-bold text-[#1F2937] text-lg mb-2">최종 미션 · 졸업 과제</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed mb-5">
            4주차 미션을 모두 완료하면 최종 과제가 공개됩니다.
          </p>
          <div className="flex justify-center gap-2">
            {(['week1', 'week2', 'week3', 'week4'] as const).map((wk, i) => (
              <div
                key={wk}
                style={
                  completedWeeks[wk]
                    ? { background: '#F3D96B', color: '#07152F', border: '2px solid #E6D27A' }
                    : { background: '#F3F4F6', color: '#D1D5DB', border: '1px solid #E5E7EB' }
                }
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">{completedCount}/4 완료</p>
        </div>
      </section>
    );
  }

  async function handleCopy() {
    const ok = await copyToClipboard(finalData.finalIntro);
    onShowToast(ok ? '최종 자기소개가 복사되었습니다' : '복사 실패. 직접 선택해주세요.');
  }

  const cardStyle = { border: '1px solid #EFE4B0', boxShadow: '0 1px 4px rgba(7,21,47,0.06)' };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#F3D96B' }}>
          최종 미션 · 졸업 과제
        </p>
        <h2 className="text-xl font-bold mb-1">나를 선택해야 하는 이유</h2>
        <p className="text-sm leading-relaxed" style={{ color: '#B8C5D9' }}>
          처음 1주차에 작성했던 자기소개를 꺼내 4주 동안 배운 각인 + 가치 + 셀 스피치 + 신용을
          모두 적용해서 최종 자기소개를 작성합니다.
        </p>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5" style={cardStyle}>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">
            Before (1주차)
          </p>
          {week1Data.currentIntro ? (
            <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">
              {week1Data.currentIntro}
            </p>
          ) : (
            <p className="text-sm text-[#D1D5DB] italic">1주차 자기소개가 없습니다.</p>
          )}
        </div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid #EFE4B0', background: '#FFFBEA' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#C9A830' }}>
            After (최종)
          </p>
          {finalData.finalIntro ? (
            <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">
              {finalData.finalIntro}
            </p>
          ) : (
            <p className="text-sm text-[#D1D5DB] italic">아직 작성되지 않았습니다.</p>
          )}
        </div>
      </div>

      {/* Guide */}
      <div className="rounded-xl p-4" style={{ background: '#FFFBEA', border: '1px solid #EFE4B0' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#07152F' }}>After에 들어가야 할 요소</p>
        <ul className="text-xs text-[#6B7280] space-y-1">
          <li>• 나는 누구에게 필요한 사람인지</li>
          <li>• 어떤 문제를 해결하는지</li>
          <li>• 무엇이 다른지</li>
          <li>• 어떤 가치를 제공하는지</li>
          <li>• 왜 나를 믿어도 되는지</li>
        </ul>
      </div>

      {/* Textarea */}
      <div className="rounded-2xl bg-white p-6" style={cardStyle}>
        <label className="block mb-2">
          <p className="text-sm font-bold text-[#1F2937] mb-1">최종 자기소개</p>
          <p className="text-xs text-[#9CA3AF]">
            4주 동안 배운 모든 것을 담아 새로운 자기소개를 작성해보세요.
          </p>
        </label>
        <textarea
          value={finalData.finalIntro}
          onChange={(e) => onUpdate({ finalIntro: e.target.value })}
          placeholder="안녕하세요. 저는 ○○○입니다. [새로운 자기소개 작성]"
          rows={8}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-[#D1D5DB] transition-colors"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#F3D96B', color: '#07152F', border: '1px solid #E6D27A' }}
          >
            <span>📋</span>
            최종 자기소개 복사하기
          </button>
        </div>
      </div>

      {/* ── 성장 기록 섹션 ── */}
      <div>
        {/* Section header */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#F3D96B' }}>
            나의 성장 기록
          </p>
          <h3 className="text-lg font-bold" style={{ color: '#07152F' }}>
            나의 비즈니스 점검표 성장 기록
          </h3>
          <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
            1주차부터 4주차까지 같은 질문에 답한 기록을 펼쳐보며, 내 생각이 어떻게 구체화되었는지 확인해보세요.
          </p>
        </div>

        {/* Week tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {(['week1', 'week2', 'week3', 'week4'] as const).map((wk) => {
            const isActive = recordTab === wk;
            return (
              <button
                key={wk}
                onClick={() => setRecordTab(wk)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-150"
                style={{
                  background: isActive ? '#FFF2A8' : '#ffffff',
                  color: isActive ? '#07152F' : '#08224A',
                  border: `1px solid ${isActive ? '#E6D27A' : '#D1D9E6'}`,
                  fontWeight: isActive ? '700' : '600',
                }}
              >
                {WEEK_LABELS[wk]} 기록
              </button>
            );
          })}
        </div>

        {/* Q&A list for selected week */}
        <div className="flex flex-col gap-3">
          {COMMON_MISSION_QUESTIONS.map((q) => {
            const answer = commonMissions[recordTab][q.id];
            return (
              <div
                key={q.id}
                className="rounded-2xl bg-white p-5"
                style={cardStyle}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: '#08224A' }}>
                  {q.number} {q.question}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-2">{q.sub}</p>
                {answer ? (
                  <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">{answer}</p>
                ) : (
                  <p className="text-sm text-[#D1D5DB] italic">아직 작성하지 않았습니다.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Graduation card */}
      <div className="rounded-2xl text-white p-6 text-center" style={{ background: '#08224A' }}>
        <p className="text-3xl mb-3">🎓</p>
        <p className="text-lg font-bold" style={{ color: '#F3D96B' }}>4주 부트캠프 수료!</p>
        <p className="text-sm mt-2" style={{ color: '#B8C5D9' }}>
          소득있는 음악인이 되는 여정을 함께해주셔서 감사합니다.
        </p>
      </div>
    </section>
  );
}
