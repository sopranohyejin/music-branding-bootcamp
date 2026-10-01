'use client';

import { useEffect, useState } from 'react';
import {
  CommonMissions,
  CommonMissionWeekData,
  COMMON_MISSION_QUESTIONS,
  WEEKS,
  generateCommonMissionText,
  copyToClipboard,
} from '@/lib/brandingBootcamp';

const WARM_YELLOW = '#F3D96B';
const GOLD_LINE = '#E6D27A';

interface CommonMissionFormProps {
  data: CommonMissions;
  activeWeek: keyof CommonMissions;
  onUpdate: (data: CommonMissions) => void;
  onShowToast: (msg: string) => void;
  isLocked: boolean;
}

export default function CommonMissionForm({
  data,
  activeWeek,
  onUpdate,
  onShowToast,
  isLocked,
}: CommonMissionFormProps) {
  const weekData: CommonMissionWeekData = data[activeWeek];

  // 편집 중인 질문 인덱스 Set (값이 없으면 자동으로 편집 모드)
  const [editingSet, setEditingSet] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    COMMON_MISSION_QUESTIONS.forEach((q, i) => {
      if (!data[activeWeek][q.id]) initial.add(i);
    });
    return initial;
  });

  // 탭(주차) 전환 시 편집 상태 초기화
  useEffect(() => {
    const next = new Set<number>();
    COMMON_MISSION_QUESTIONS.forEach((q, i) => {
      if (!data[activeWeek][q.id]) next.add(i);
    });
    setEditingSet(next);
  }, [activeWeek]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(field: keyof CommonMissionWeekData, value: string) {
    onUpdate({ ...data, [activeWeek]: { ...weekData, [field]: value } });
  }

  function startEdit(index: number) {
    setEditingSet((prev) => new Set(prev).add(index));
  }

  function saveField(index: number, field: keyof CommonMissionWeekData, value: string) {
    // 최신값 반영 후 읽기모드 전환
    onUpdate({ ...data, [activeWeek]: { ...weekData, [field]: value } });
    setEditingSet((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  async function handleCopyCommon() {
    const weekLabel = WEEKS.find((w) => w.id === activeWeek)?.label ?? String(activeWeek);
    const text = generateCommonMissionText(weekLabel, weekData);
    const ok = await copyToClipboard(text);
    onShowToast(ok ? '점검표가 복사되었습니다' : '복사에 실패했습니다. 직접 선택해주세요.');
  }

  const cardStyle = {
    border: '1px solid #EFE4B0',
    boxShadow: '0 1px 4px rgba(7,21,47,0.06)',
  };

  return (
    <div>
      {/* 섹션 헤더 */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: WARM_YELLOW }}>
          공통 미션
        </p>
        <h2 className="text-xl font-bold" style={{ color: '#07152F' }}>
          매주 작성: 나의 비즈니스 점검표
        </h2>
        <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
          매주 같은 질문에 답하면서 성장해나가는 나를 느껴보세요
        </p>
        {isLocked && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#9CA3AF' }}>
            🔒 지난 주차의 답변은 읽기 전용입니다.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {COMMON_MISSION_QUESTIONS.map((q, i) => {
          const isEditing = !isLocked && editingSet.has(i);
          const value = weekData[q.id];

          return (
            <div key={q.id} className="rounded-2xl bg-white p-5" style={cardStyle}>
              {/* 질문 라벨 + 수정 버튼 */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <label>
                  <p className="font-semibold text-sm" style={{ color: '#07152F' }}>
                    {q.number} {q.question}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{q.sub}</p>
                </label>
                {!isLocked && !isEditing && (
                  <button
                    onClick={() => startEdit(i)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}
                  >
                    수정하기
                  </button>
                )}
              </div>

              {isEditing ? (
                /* 편집 모드 */
                <>
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="답변을 입력하세요..."
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm transition-colors"
                    style={{ border: '1px solid #E5E7EB', background: '#FCFCFD', color: '#07152F' }}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => saveField(i, q.id, value)}
                      className="text-xs px-4 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#08224A', color: '#FFF2A8' }}
                    >
                      저장하기
                    </button>
                  </div>
                </>
              ) : (
                /* 읽기 모드 */
                <div
                  className="rounded-xl px-4 py-3 min-h-[3rem]"
                  style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
                >
                  {value ? (
                    <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{value}</p>
                  ) : (
                    <p className="text-sm text-[#D1D5DB]">—</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 전체 복사 버튼 */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCopyCommon}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: WARM_YELLOW, color: '#07152F', border: `1px solid ${GOLD_LINE}` }}
        >
          <span>📋</span>
          전체 점검표 복사하기
        </button>
      </div>
    </div>
  );
}
