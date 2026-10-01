'use client';

import { useEffect, useState } from 'react';
import {
  Week2Data,
  CompletedWeeks,
  LOGO_BRIEF_QUESTIONS,
  LogoBriefData,
  CUSTOM_GPT_URL,
  generateLogoPrompt,
  copyToClipboard,
} from '@/lib/brandingBootcamp';
import MissionCard from './MissionCard';
import { CompleteButton } from './Week1Form';

interface Week2FormProps {
  data: Week2Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  isLocked: boolean;
  onUpdate: (data: Week2Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onShowToast: (msg: string) => void;
}

export default function Week2Form({
  data,
  isReleased,
  completedWeeks,
  isLocked,
  onUpdate,
  onComplete,
  onUncomplete,
  onShowToast,
}: Week2FormProps) {
  const isCompleted = completedWeeks.week2;

  const ALL_FIELDS = ['targetCustomer', 'feature1', 'feature2', 'feature3', 'oneSentenceBrand',
    ...LOGO_BRIEF_QUESTIONS.map(q => `logo_${q.id}`)];

  const [editingSet, setEditingSet] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (!data.targetCustomer) s.add('targetCustomer');
    if (!data.feature1) s.add('feature1');
    if (!data.feature2) s.add('feature2');
    if (!data.feature3) s.add('feature3');
    if (!data.oneSentenceBrand) s.add('oneSentenceBrand');
    LOGO_BRIEF_QUESTIONS.forEach(q => { if (!data.logoBrief[q.id]) s.add(`logo_${q.id}`); });
    return s;
  });

  useEffect(() => {
    if (isCompleted) setEditingSet(new Set());
  }, [isCompleted]);

  function startEdit(key: string) {
    setEditingSet(p => new Set(p).add(key));
  }
  function saveField(key: string) {
    setEditingSet(p => { const n = new Set(p); n.delete(key); return n; });
  }

  function updateLogoBrief(field: keyof LogoBriefData, value: string) {
    onUpdate({ ...data, logoBrief: { ...data.logoBrief, [field]: value } });
  }

  async function handlePromptCopy() {
    const text = generateLogoPrompt(data.logoBrief);
    const ok = await copyToClipboard(text);
    onShowToast(ok ? '프롬프트가 복사되었습니다' : '복사 실패. 직접 선택해주세요.');
  }

  function handleOpenGPT() {
    if (CUSTOM_GPT_URL) window.open(CUSTOM_GPT_URL, '_blank', 'noopener noreferrer');
    else onShowToast('GPT 링크가 아직 등록되지 않았습니다.');
  }

  if (!isReleased) {
    return (
      <MissionCard
        title="2주차: 나를 기억시키는 브랜드 만들기"
        subtitle="각인: 노출 + 특징"
        locked
      />
    );
  }

  // 편집 가능한 단일 텍스트 필드 렌더링 헬퍼
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

  function EditableInput(props: { fieldKey: string; label: string; value: string; placeholder?: string; onChange: (v: string) => void; }) {
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
            <input type="text" value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} className="w-full rounded-xl px-4 py-2.5 text-sm border border-[#E5E7EB] bg-[#FCFCFD] text-[#1F2937]" />
            <div className="flex justify-end mt-1.5">
              <button onClick={() => saveField(props.fieldKey)} className="text-xs px-4 py-1.5 rounded-lg font-semibold" style={{ background: '#08224A', color: '#FFF2A8' }}>저장하기</button>
            </div>
          </>
        ) : (
          <div className="rounded-xl px-4 py-2.5 min-h-[2.5rem]" style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            {props.value ? <p className="text-sm text-[#374151]">{props.value}</p> : <p className="text-sm text-[#D1D5DB]">—</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 주차 헤더 */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>2주차 미션</p>
        <h3 className="text-lg font-bold mb-1">나를 기억시키는 브랜드 만들기</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>각인: 노출 + 특징</p>
      </div>

      {isLocked && <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>🔒 지난 주차의 답변은 읽기 전용입니다.</p>}

      {/* 미션 ① 타깃 */}
      <MissionCard
        title="미션 ① 나의 타깃 정하기"
        guide={`내가 도움을 줄 수 있는 사람/주고싶은 사람은 누구인가?\n"모든 사람" 금지.\n\n• 누구에게?\n• 어떤 상황에서?\n• 어떤 문제를 가진 사람에게?\n화살촉처럼 뾰족하게 구체적으로 작성`}
      >
        <EditableTextarea fieldKey="targetCustomer" label="나의 타깃" value={data.targetCustomer} onChange={v => onUpdate({ ...data, targetCustomer: v })} placeholder="예: 음악을 오래 했지만 수익이 없는 20-30대 음악 강사" rows={3} />
      </MissionCard>

      {/* 미션 ② 특징 3개 */}
      <MissionCard
        title="미션 ② 나의 특징 3개 찾기"
        guide="경력 / 기술 / 경험 / 성격 / 방법론 / 결과 / 콘텐츠 중에서 나만의 특징이 될 수 있는 것 3개 찾기"
      >
        <EditableInput fieldKey="feature1" label="특징 1" value={data.feature1} onChange={v => onUpdate({ ...data, feature1: v })} placeholder="예: 10년 이상 성악 전공" />
        <EditableInput fieldKey="feature2" label="특징 2" value={data.feature2} onChange={v => onUpdate({ ...data, feature2: v })} placeholder="예: 발성 교정 전문" />
        <EditableInput fieldKey="feature3" label="특징 3" value={data.feature3} onChange={v => onUpdate({ ...data, feature3: v })} placeholder="예: 초보자도 3개월 안에 발표 가능" />
      </MissionCard>

      {/* 미션 ③ 한 문장 */}
      <MissionCard title="미션 ③ 나를 기억시키는 한 문장">
        <EditableTextarea fieldKey="oneSentenceBrand" label="나를 기억시키는 한 문장" value={data.oneSentenceBrand} onChange={v => onUpdate({ ...data, oneSentenceBrand: v })} placeholder="예: 발성이 고민인 직장인의 목소리를 3개월 안에 바꿔주는 성악 강사" rows={2} />
      </MissionCard>

      {/* 미션 ④ 로고 */}
      <MissionCard
        title="미션 ④ 로고 만들기"
        subtitle="아래 정보를 입력하면 GPTs 프롬프트를 자동 생성해드립니다."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {LOGO_BRIEF_QUESTIONS.map((q) => (
            <EditableInput
              key={q.id}
              fieldKey={`logo_${q.id}`}
              label={q.label}
              value={data.logoBrief[q.id]}
              onChange={(v) => updateLogoBrief(q.id, v)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2 pt-4 border-t border-[#F3F4F6]">
          <button onClick={handlePromptCopy} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#F3D96B', color: '#07152F', border: '1px solid #E6D27A' }}>
            <span>📋</span>GPTs 로고 제작 프롬프트 복사하기
          </button>
          <button onClick={handleOpenGPT} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#08224A', border: '1px solid rgba(255,255,255,0.16)' }}>
            <span>🤖</span>GPTs 열기
          </button>
        </div>
      </MissionCard>

      <CompleteButton isCompleted={isCompleted} isLocked={isLocked} weekLabel="2주차" onComplete={onComplete} onUncomplete={onUncomplete} />
    </div>
  );
}
