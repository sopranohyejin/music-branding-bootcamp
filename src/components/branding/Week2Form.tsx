'use client';

import {
  Week2Data,
  CompletedWeeks,
  LOGO_BRIEF_QUESTIONS,
  LogoBriefData,
  CUSTOM_GPT_URL,
  generateLogoPrompt,
  copyToClipboard,
} from '@/lib/brandingBootcamp';
import MissionCard, { TextareaField, InputField } from './MissionCard';
import { CompleteButton } from './Week1Form';

interface Week2FormProps {
  data: Week2Data;
  isReleased: boolean;
  completedWeeks: CompletedWeeks;
  onUpdate: (data: Week2Data) => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onShowToast: (msg: string) => void;
}

export default function Week2Form({
  data,
  isReleased,
  completedWeeks,
  onUpdate,
  onComplete,
  onUncomplete,
  onShowToast,
}: Week2FormProps) {
  const isCompleted = completedWeeks.week2;

  if (!isReleased) {
    return (
      <MissionCard
        title="2주차: 나를 기억시키는 브랜드 만들기"
        subtitle="각인: 노출 + 특징"
        locked
      />
    );
  }

  function updateLogoBrief(field: keyof LogoBriefData, value: string) {
    onUpdate({
      ...data,
      logoBrief: { ...data.logoBrief, [field]: value },
    });
  }

  async function handlePromptCopy() {
    const text = generateLogoPrompt(data.logoBrief);
    const ok = await copyToClipboard(text);
    onShowToast(ok ? '프롬프트가 복사되었습니다' : '복사 실패. 직접 선택해주세요.');
  }

  function handleOpenGPT() {
    if (CUSTOM_GPT_URL) {
      window.open(CUSTOM_GPT_URL, '_blank', 'noopener noreferrer');
    } else {
      onShowToast('GPT 링크가 아직 등록되지 않았습니다.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Week header */}
      <div className="rounded-2xl text-white p-6" style={{ background: '#08224A' }}>
        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#F3D96B' }}>
          2주차 미션
        </p>
        <h3 className="text-lg font-bold mb-1">나를 기억시키는 브랜드 만들기</h3>
        <p className="text-sm" style={{ color: '#B8C5D9' }}>각인: 노출 + 특징</p>
      </div>

      {/* Mission 1: Target */}
      <MissionCard
        title="미션 ① 나의 타깃 정하기"
        guide={`내가 도움을 줄 수 있는 사람/주고싶은 사람은 누구인가?\n"모든 사람" 금지.\n\n• 누구에게?\n• 어떤 상황에서?\n• 어떤 문제를 가진 사람에게?\n화살촉처럼 뾰족하게 구체적으로 작성`}
        locked={isCompleted}
      >
        <TextareaField
          label="나의 타깃"
          value={data.targetCustomer}
          onChange={(v) => onUpdate({ ...data, targetCustomer: v })}
          placeholder="예: 음악을 오래 했지만 수익이 없는 20-30대 음악 강사"
          rows={3}
          disabled={isCompleted}
        />
      </MissionCard>

      {/* Mission 2: Features */}
      <MissionCard
        title="미션 ② 나의 특징 3개 찾기"
        guide="경력 / 기술 / 경험 / 성격 / 방법론 / 결과 / 콘텐츠 중에서 나만의 특징이 될 수 있는 것 3개 찾기"
        locked={isCompleted}
      >
        <InputField
          label="특징 1"
          value={data.feature1}
          onChange={(v) => onUpdate({ ...data, feature1: v })}
          placeholder="예: 10년 이상 성악 전공"
          disabled={isCompleted}
        />
        <InputField
          label="특징 2"
          value={data.feature2}
          onChange={(v) => onUpdate({ ...data, feature2: v })}
          placeholder="예: 발성 교정 전문"
          disabled={isCompleted}
        />
        <InputField
          label="특징 3"
          value={data.feature3}
          onChange={(v) => onUpdate({ ...data, feature3: v })}
          placeholder="예: 초보자도 3개월 안에 발표 가능"
          disabled={isCompleted}
        />
      </MissionCard>

      {/* Mission 3: One sentence */}
      <MissionCard
        title="미션 ③ 나를 기억시키는 한 문장"
        locked={isCompleted}
      >
        <TextareaField
          label="나를 기억시키는 한 문장"
          value={data.oneSentenceBrand}
          onChange={(v) => onUpdate({ ...data, oneSentenceBrand: v })}
          placeholder="예: 발성이 고민인 직장인의 목소리를 3개월 안에 바꿔주는 성악 강사"
          rows={2}
          disabled={isCompleted}
        />
      </MissionCard>

      {/* Mission 4: Logo */}
      <MissionCard
        title="미션 ④ 로고 만들기"
        subtitle="아래 정보를 입력하면 GPTs 프롬프트를 자동 생성해드립니다."
        locked={isCompleted}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {LOGO_BRIEF_QUESTIONS.map((q) => (
            <InputField
              key={q.id}
              label={q.label}
              value={data.logoBrief[q.id]}
              onChange={(v) => updateLogoBrief(q.id, v)}
              disabled={isCompleted}
            />
          ))}
        </div>

        {/* GPTs buttons */}
        <div className="flex flex-wrap gap-3 mt-2 pt-4 border-t border-[#F3F4F6]">
          <button
            onClick={handlePromptCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#F3D96B', color: '#07152F', border: '1px solid #E6D27A' }}
          >
            <span>📋</span>
            GPTs 로고 제작 프롬프트 복사하기
          </button>
          <button
            onClick={handleOpenGPT}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
            style={{ background: '#08224A', border: '1px solid rgba(255,255,255,0.16)' }}
          >
            <span>🤖</span>
            GPTs 열기
          </button>
        </div>
        {/* TODO: 추후 OpenAI API 연동 시 /api/generate-logo-ideas 엔드포인트 추가 가능 */}
      </MissionCard>

      <CompleteButton
        isCompleted={isCompleted}
        weekLabel="2주차"
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    </div>
  );
}
