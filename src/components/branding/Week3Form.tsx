'use client';

import { useEffect, useState } from 'react';
import { Week3Data, CompletedWeeks } from '@/lib/brandingBootcamp';
import MissionCard from './MissionCard';
import { CompleteButton } from './Week1Form';

interface Week3FormProps {
  data: Week3Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  isLocked: boolean;
  onUpdate: (data: Week3Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

const PROBLEM_EXAMPLES = [
  '노래만 하면 목이 아픔',
  '아이의 발달에 필요한 예체능 뭘 고를지 고민',
  '특별한 행사자리가 삭막할까봐 고민',
  '피아노 악보 읽기가 어려움',
];

export default function Week3Form({
  data,
  isReleased,
  completedWeeks,
  isLocked,
  onUpdate,
  onComplete,
  onUncomplete,
}: Week3FormProps) {
  const isCompleted = completedWeeks.week3;

  // 문제 10개 + 텍스트 필드들 편집 상태
  const problemKeys = Array.from({ length: 10 }, (_, i) => `problem_${i}`);
  const textKeys = ['selectedProblem', 'selfPitchScript', 'recordingNote'];

  const [editingSet, setEditingSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    data.customerProblems.forEach((v, i) => { if (!v) s.add(`problem_${i}`); });
    if (!data.selectedProblem) s.add('selectedProblem');
    if (!data.selfPitchScript) s.add('selfPitchScript');
    if (!data.recordingNote) s.add('recordingNote');
    return s;
  });

  useEffect(() => {
    if (isCompleted) setEditingSet(new Set());
  }, [isCompleted]);

  function startEdit(key: string) { setEditingSet(p => new Set(p).add(key)); }
  function saveField(key: string) { setEditingSet(p => { const n = new Set(p); n.delete(key); return n; }); }

  function updateProblem(index: number, value: string) {
    const updated = [...data.customerProblems];
    updated[index] = value;
    onUpdate({ ...data, customerProblems: updated });
  }

  if (!isReleased) {
    return (
      <MissionCard
        title="3주차: 고객 문제와 30초 셀 스피치"
        subtitle="가치 + 셀 스피치: 고객 중심 사고"
        locked
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 주차 헤더 */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>
          3주차 미션
        </p>
        <h3 className="text-lg font-bold mb-1">고객 문제와 30초 셀 스피치</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>가치 + 셀 스피치: 고객 중심 사고</p>
      </div>

      {isLocked && (
        <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
          🔒 지난 주차의 답변은 읽기 전용입니다.
        </p>
      )}

      {/* 미션 ① 고객 문제 10개 */}
      <MissionCard
        title="미션 ① 고객 문제 10개 찾기"
        subtitle="자신의 고객이 실제로 가지고 있을 법한 문제를 10개 작성"
        guide={`예시:\n• ${PROBLEM_EXAMPLES.join('\n• ')}`}
      >
        <div className="flex flex-col gap-2">
          {data.customerProblems.map((problem, i) => {
            const key = `problem_${i}`;
            const editing = !isLocked && editingSet.has(key);
            return (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#FFF2A8', color: '#07152F' }}>
                    {i + 1}
                  </span>
                  {!isLocked && !editing && problem && (
                    <button onClick={() => startEdit(key)} className="text-xs px-2 py-0.5 rounded-md font-semibold ml-auto" style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}>수정</button>
                  )}
                </div>
                {editing || (!problem && !isLocked) ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => updateProblem(i, e.target.value)}
                      placeholder={`고객 문제 ${i + 1}`}
                      className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937]"
                    />
                    {editing && (
                      <button onClick={() => saveField(key)} className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0" style={{ background: '#08224A', color: '#FFF2A8' }}>저장</button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl px-4 py-2.5 min-h-[2.5rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                    {problem ? <p className="text-sm text-[#374151]">{problem}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </MissionCard>

      {/* 미션 ② 30초 셀 스피치 */}
      <MissionCard
        title="미션 ② 1가지 문제 선정 후 30초 셀 스피치 작성 + 녹음"
        guide="공식: 고객의 문제 → 공감 → 내가 줄 수 있는 도움(나의 계획) → 기대할 변화"
      >
        {/* 선택한 문제 */}
        {(() => {
          const key = 'selectedProblem';
          const editing = !isLocked && editingSet.has(key);
          return (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-[#374151]">선택한 고객 문제</p>
                {!isLocked && !editing && (
                  <button onClick={() => startEdit(key)} className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}>수정하기</button>
                )}
              </div>
              {editing ? (
                <>
                  <textarea value={data.selectedProblem} onChange={e => onUpdate({ ...data, selectedProblem: e.target.value })} placeholder="위에서 작성한 10개 중 1가지를 선택하여 입력하세요." rows={2} className="w-full rounded-xl px-4 py-3 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#07152F]" />
                  <div className="flex justify-end mt-1.5">
                    <button onClick={() => saveField(key)} className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#08224A', color: '#FFF2A8' }}>저장하기</button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl px-4 py-3 min-h-[2.5rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                  {data.selectedProblem ? <p className="text-sm text-[#374151] whitespace-pre-wrap">{data.selectedProblem}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
                </div>
              )}
            </div>
          );
        })()}

        {/* 스피치 대본 */}
        {(() => {
          const key = 'selfPitchScript';
          const editing = !isLocked && editingSet.has(key);
          return (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-[#374151]">30초 셀 스피치 대본</p>
                {!isLocked && !editing && (
                  <button onClick={() => startEdit(key)} className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}>수정하기</button>
                )}
              </div>
              {editing ? (
                <>
                  <textarea value={data.selfPitchScript} onChange={e => onUpdate({ ...data, selfPitchScript: e.target.value })} placeholder={`고객 문제: ...\n공감: ...\n내 도움: ...\n기대 변화: ...`} rows={6} className="w-full rounded-xl px-4 py-3 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#07152F]" />
                  <div className="flex justify-end mt-1.5">
                    <button onClick={() => saveField(key)} className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#08224A', color: '#FFF2A8' }}>저장하기</button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl px-4 py-3 min-h-[6rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                  {data.selfPitchScript ? <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{data.selfPitchScript}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
                </div>
              )}
            </div>
          );
        })()}

        {/* 녹음 체크 + 메모 */}
        <div className="rounded-xl p-4 mt-2" style={{ background: '#FFFBEA', border: '1px solid #EFE4B0' }}>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.recordingDone}
                onChange={(e) => onUpdate({ ...data, recordingDone: e.target.checked })}
                disabled={isLocked}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-[#374151]">녹음 완료</span>
            </label>
          </div>
          {(() => {
            const key = 'recordingNote';
            const editing = !isLocked && editingSet.has(key);
            return (
              <>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[#374151]">녹음 인증 메모 (카톡 인증 후 완료)</p>
                  {!isLocked && !editing && (
                    <button onClick={() => startEdit(key)} className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}>수정하기</button>
                  )}
                </div>
                {editing ? (
                  <>
                    <textarea value={data.recordingNote} onChange={e => onUpdate({ ...data, recordingNote: e.target.value })} placeholder="카톡 인증 완료 날짜나 메모를 남겨두세요." rows={2} className="w-full rounded-xl px-4 py-3 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#07152F]" />
                    <div className="flex justify-end mt-1.5">
                      <button onClick={() => saveField(key)} className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#08224A', color: '#FFF2A8' }}>저장하기</button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl px-4 py-3 min-h-[2.5rem]" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                    {data.recordingNote ? <p className="text-sm text-[#374151] whitespace-pre-wrap">{data.recordingNote}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </MissionCard>

      <CompleteButton isCompleted={isCompleted} isLocked={isLocked} weekLabel="3주차" onComplete={onComplete} onUncomplete={onUncomplete} />
    </div>
  );
}
