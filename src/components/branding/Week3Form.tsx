'use client';

import { Week3Data, CompletedWeeks } from '@/lib/brandingBootcamp';
import MissionCard, { TextareaField } from './MissionCard';
import { CompleteButton } from './Week1Form';

interface Week3FormProps {
  data: Week3Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
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
  onUpdate,
  onComplete,
  onUncomplete,
}: Week3FormProps) {
  const isCompleted = completedWeeks.week3;

  if (!isReleased) {
    return (
      <MissionCard
        title="3주차: 고객 문제와 셀프 스피치 만들기"
        subtitle="가치 + 셀프 스피치: 고객 중심 사고"
        locked
      />
    );
  }

  function updateProblem(index: number, value: string) {
    const updated = [...data.customerProblems];
    updated[index] = value;
    onUpdate({ ...data, customerProblems: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Week header */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>
          3주차 미션
        </p>
        <h3 className="text-lg font-bold mb-1">고객 문제와 셀프 스피치 만들기</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>가치 + 셀프 스피치: 고객 중심 사고</p>
      </div>

      {/* Mission 1: 10 problems */}
      <MissionCard
        title="미션 ① 고객 문제 10개 찾기"
        subtitle="자신의 고객이 실제로 가지고 있을 법한 문제를 10개 작성"
        guide={`예시:\n• ${PROBLEM_EXAMPLES.join('\n• ')}`}
        locked={isCompleted}
      >
        <div className="flex flex-col gap-2">
          {data.customerProblems.map((problem, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#FFF2A8', color: '#07152F' }}>
                {i + 1}
              </span>
              <input
                type="text"
                value={problem}
                onChange={(e) => updateProblem(i, e.target.value)}
                placeholder={`고객 문제 ${i + 1}`}
                disabled={isCompleted}
                className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] placeholder-[#D1D5DB] disabled:bg-[#F9FAFB] transition-colors"
              />
            </div>
          ))}
        </div>
      </MissionCard>

      {/* Mission 2: Selfpitch */}
      <MissionCard
        title="미션 ② 1가지 문제 선정 후 셀프 스피치 30초 작성 + 녹음"
        guide="공식: 고객의 문제 → 공감 → 내가 줄 수 있는 도움(나의 계획) → 기대할 변화"
        locked={isCompleted}
      >
        <TextareaField
          label="선택한 고객 문제"
          value={data.selectedProblem}
          onChange={(v) => onUpdate({ ...data, selectedProblem: v })}
          placeholder="위에서 작성한 10개 중 1가지를 선택하여 입력하세요."
          rows={2}
          disabled={isCompleted}
        />
        <TextareaField
          label="30초 셀프 스피치 대본"
          value={data.selfPitchScript}
          onChange={(v) => onUpdate({ ...data, selfPitchScript: v })}
          placeholder={`고객 문제: ...\n공감: ...\n내 도움: ...\n기대 변화: ...`}
          rows={6}
          disabled={isCompleted}
        />

        {/* Recording */}
        <div className="rounded-xl p-4 mt-2" style={{ background: '#FFFBEA', border: '1px solid #EFE4B0' }}>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.recordingDone}
                onChange={(e) => onUpdate({ ...data, recordingDone: e.target.checked })}
                disabled={isCompleted}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-[#374151]">녹음 완료</span>
            </label>
          </div>
          <TextareaField
            label="녹음 인증 메모 (카톡 인증 후 완료)"
            value={data.recordingNote}
            onChange={(v) => onUpdate({ ...data, recordingNote: v })}
            placeholder="카톡 인증 완료 날짜나 메모를 남겨두세요."
            rows={2}
            disabled={isCompleted}
          />
          {/* TODO: 추후 파일 업로드 기능 추가 가능 (/api/upload-recording) */}
        </div>
      </MissionCard>

      <CompleteButton
        isCompleted={isCompleted}
        weekLabel="3주차"
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    </div>
  );
}
