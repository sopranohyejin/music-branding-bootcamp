'use client';

import { useEffect, useState } from 'react';
import { Week4Data, CompletedWeeks } from '@/lib/brandingBootcamp';
import MissionCard from './MissionCard';
import { CompleteButton } from './Week1Form';

interface Week4FormProps {
  data: Week4Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  isLocked: boolean;
  onUpdate: (data: Week4Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

const EVIDENCE_FIELDS: Array<{ key: keyof Week4Data; label: string; placeholder: string }> = [
  { key: 'career', label: '경력', placeholder: '예: 피아노 교습 15년, 유명 오케스트라 단원 5년' },
  { key: 'certification', label: '자격', placeholder: '예: 음악교육 2급 자격증, 음대 출신' },
  { key: 'education', label: '학력', placeholder: '예: ○○대학교 성악과 졸업' },
  { key: 'performances', label: '공연', placeholder: '예: 정기 독창회 10회, 협연 20회' },
  { key: 'awards', label: '수상', placeholder: '예: ○○ 콩쿠르 1위' },
  { key: 'studentResults', label: '학생 결과 영상/사진 개수', placeholder: '예: 50개' },
  { key: 'reviews', label: '후기 개수', placeholder: '예: 100개+' },
  { key: 'customerCases', label: '고객 사례', placeholder: '예: 3개월 만에 첫 무대 선 수강생 5명' },
  { key: 'works', label: '작업물 개수', placeholder: '예: 유튜브 영상 80편' },
  { key: 'measurableResults', label: '숫자로 표현할 수 있는 성과', placeholder: '예: 수강생 합격률 90%' },
];

const MISSING_FIELDS: Array<{ key: keyof Week4Data; label: string }> = [
  { key: 'missingEvidence1', label: '부족한 증거 1' },
  { key: 'missingEvidence2', label: '부족한 증거 2' },
  { key: 'missingEvidence3', label: '부족한 증거 3' },
];

export default function Week4Form({
  data,
  isReleased,
  completedWeeks,
  isLocked,
  onUpdate,
  onComplete,
  onUncomplete,
}: Week4FormProps) {
  const isCompleted = completedWeeks.week4;

  const [editingSet, setEditingSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    EVIDENCE_FIELDS.forEach(({ key }) => { if (!data[key]) s.add(key as string); });
    MISSING_FIELDS.forEach(({ key }) => { if (!data[key]) s.add(key as string); });
    return s;
  });

  useEffect(() => {
    if (isCompleted) setEditingSet(new Set());
  }, [isCompleted]);

  function startEdit(key: string) { setEditingSet(p => new Set(p).add(key)); }
  function saveField(key: string) { setEditingSet(p => { const n = new Set(p); n.delete(key); return n; }); }

  if (!isReleased) {
    return (
      <MissionCard
        title="4주차: 나의 신용 자산 만들기"
        subtitle="신용: 신뢰를 자산으로 만드는 법"
        locked
      />
    );
  }

  function EditableTextarea(props: {
    fieldKey: string; label: string; value: string; placeholder?: string; rows?: number;
    onChange: (v: string) => void;
  }) {
    const editing = !isLocked && editingSet.has(props.fieldKey);
    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-[#374151]">{props.label}</p>
          {!isLocked && !editing && (
            <button onClick={() => startEdit(props.fieldKey)} className="text-xs px-3 py-1 rounded-lg font-semibold" style={{ border: '1px solid #D1D9E6', color: '#374151', background: '#F9FAFB' }}>수정하기</button>
          )}
        </div>
        {editing ? (
          <>
            <textarea value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} rows={props.rows ?? 2} className="w-full rounded-xl px-4 py-3 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#07152F]" />
            <div className="flex justify-end mt-1.5">
              <button onClick={() => saveField(props.fieldKey)} className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#08224A', color: '#FFF2A8' }}>저장하기</button>
            </div>
          </>
        ) : (
          <div className="rounded-xl px-4 py-3 min-h-[2.5rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            {props.value ? <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{props.value}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 주차 헤더 */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>4주차 미션</p>
        <h3 className="text-lg font-bold mb-1">나의 신용 자산 만들기</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>신용: 신뢰를 자산으로 만드는 법</p>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6B7280' }}>
          신용을 끌어올리기 위해서는 "저 잘합니다."보다 실제 증거가 필요합니다.
        </p>
      </div>

      {isLocked && (
        <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>🔒 지난 주차의 답변은 읽기 전용입니다.</p>
      )}

      {/* 미션 ① 신용 증거 찾기 */}
      <MissionCard
        title="미션 ① 나의 신용 증거 찾기"
        subtitle="현재 가지고 있는 증거를 최대한 많이 찾기"
        guide="이걸 매달 업데이트해서 내가 얼만큼의 신용을 찾고 있는지 확인합니다."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {EVIDENCE_FIELDS.map(({ key, label, placeholder }) => (
            <EditableTextarea
              key={key}
              fieldKey={key as string}
              label={label}
              value={data[key] as string}
              onChange={(v) => onUpdate({ ...data, [key]: v })}
              placeholder={placeholder}
              rows={2}
            />
          ))}
        </div>
        <div className="mt-2 rounded-xl p-4 text-xs leading-relaxed" style={{ background: '#FFFBEA', border: '1px solid #EFE4B0', color: '#374151' }}>
          <p className="font-semibold mb-1">⚠️ 주의</p>
          <p>단, 실제로 확인 가능한 것만 사용하기.</p>
          <p>고객 입장에서의 신용 증거를 찾기.</p>
          <p>고객에게 와닿지 않는 증거는 불필요하며 오히려 이탈될 수 있습니다.</p>
        </div>
      </MissionCard>

      {/* 미션 ② 부족한 신용 찾기 */}
      <MissionCard
        title="미션 ② 부족한 신용 찾기"
        guide="내가 지금 고객이라면 무엇을 보고 나를 믿을까?"
      >
        {MISSING_FIELDS.map(({ key, label }) => (
          <EditableTextarea
            key={key}
            fieldKey={key as string}
            label={label}
            value={data[key] as string}
            onChange={(v) => onUpdate({ ...data, [key]: v })}
            placeholder={key === 'missingEvidence1' ? '아직 없는 신용 증거는 무엇인가요?' : ''}
            rows={2}
          />
        ))}
      </MissionCard>

      <CompleteButton isCompleted={isCompleted} isLocked={isLocked} weekLabel="4주차" onComplete={onComplete} onUncomplete={onUncomplete} />
    </div>
  );
}
