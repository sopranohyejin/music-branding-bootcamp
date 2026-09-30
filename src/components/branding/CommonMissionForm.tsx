'use client';

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
}

export default function CommonMissionForm({
  data,
  activeWeek,
  onUpdate,
  onShowToast,
}: CommonMissionFormProps) {
  const weekData: CommonMissionWeekData = data[activeWeek];

  function handleChange(field: keyof CommonMissionWeekData, value: string) {
    onUpdate({
      ...data,
      [activeWeek]: { ...weekData, [field]: value },
    });
  }

  async function handleCopyCommon() {
    const weekLabel = WEEKS.find((w) => w.id === activeWeek)?.label ?? String(activeWeek);
    const text = generateCommonMissionText(weekLabel, weekData);
    const ok = await copyToClipboard(text);
    onShowToast(ok ? '점검표가 복사되었습니다' : '복사에 실패했습니다. 직접 선택해주세요.');
  }

  const cardStyle = {
    border: `1px solid #EFE4B0`,
    boxShadow: '0 1px 4px rgba(7,21,47,0.06)',
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-6">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-1"
          style={{ color: WARM_YELLOW }}
        >
          공통 미션
        </p>
        <h2 className="text-xl font-bold" style={{ color: '#07152F' }}>
          매주 작성: 나의 비즈니스 점검표
        </h2>
        <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
          매주 같은 질문에 답하면서 성장해나가는 나를 느껴보세요
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {COMMON_MISSION_QUESTIONS.map((q) => (
          <div key={q.id} className="rounded-2xl bg-white p-5" style={cardStyle}>
            <label className="block mb-3">
              <p className="font-semibold text-sm" style={{ color: '#07152F' }}>
                {q.number} {q.question}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{q.sub}</p>
            </label>
            <textarea
              value={weekData[q.id]}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="답변을 입력하세요..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm transition-colors"
              style={{ border: '1px solid #E5E7EB', background: '#FCFCFD', color: '#07152F' }}
            />
          </div>
        ))}
      </div>

      {/* Copy button */}
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
