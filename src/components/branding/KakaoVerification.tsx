'use client';

import { useState } from 'react';
import {
  ParticipantSubmission,
  COMMON_MISSION_QUESTIONS,
  copyToClipboard,
} from '@/lib/brandingBootcamp';

type ActiveTab = 'week1' | 'week2' | 'week3' | 'week4' | 'final';

interface KakaoVerificationProps {
  activeTab: ActiveTab;
  participantName: string;
  submission: ParticipantSubmission;
}

function getWeekLabel(tab: ActiveTab): string {
  const map: Record<ActiveTab, string> = {
    week1: '1주차', week2: '2주차', week3: '3주차', week4: '4주차', final: '최종미션',
  };
  return map[tab];
}

/** 빈 답변 대신 "미작성" 반환 */
function ans(v: string | undefined): string {
  return v?.trim() ? v.trim() : '미작성';
}

function buildKakaoText(
  tab: ActiveTab,
  name: string,
  submission: ParticipantSubmission,
): string {
  const parts: string[] = [];
  const label = getWeekLabel(tab);

  // ── 제목 ──
  if (tab === 'final') {
    parts.push('🔥 [헬퍼지니 부트캠프] 최종미션 인증');
  } else {
    parts.push(`🔥 [헬퍼지니 부트캠프] ${label} 인증`);
  }
  parts.push(`이름: ${name}`);

  // ── 01. 공통미션 (주차 탭만) ──
  if (tab !== 'final') {
    const cm = submission.commonMissions[tab];
    const cmLines: string[] = ['[01. 공통미션]'];
    COMMON_MISSION_QUESTIONS.forEach((q) => {
      cmLines.push(`${q.number} ${q.question}`);
      cmLines.push(`→ ${ans(cm[q.id])}`);
    });
    parts.push(cmLines.join('\n'));
  }

  // ── 02. 주차 미션 ──
  if (tab === 'week1') {
    const d = submission.weeklyMissions.week1;
    parts.push(
      ['[02. 1주차 미션]', '현재 자기소개', `→ ${ans(d.currentIntro)}`].join('\n')
    );

  } else if (tab === 'week2') {
    const d = submission.weeklyMissions.week2;
    parts.push(
      [
        '[02. 2주차 미션]',
        `나의 타깃\n→ ${ans(d.targetCustomer)}`,
        `특징 1\n→ ${ans(d.feature1)}`,
        `특징 2\n→ ${ans(d.feature2)}`,
        `특징 3\n→ ${ans(d.feature3)}`,
        `나를 기억시키는 한 문장\n→ ${ans(d.oneSentenceBrand)}`,
      ].join('\n\n')
    );

  } else if (tab === 'week3') {
    const d = submission.weeklyMissions.week3;
    const problems = d.customerProblems
      .map((p, i) => `${i + 1}. ${p?.trim() || '미작성'}`)
      .join('\n');
    parts.push(
      [
        '[02. 3주차 미션]',
        `고객 문제 10개\n${problems}`,
        `선택한 고객 문제\n→ ${ans(d.selectedProblem)}`,
        `30초 셀프 스피치 대본\n→ ${ans(d.selfPitchScript)}`,
        `녹음 완료: ${d.recordingDone ? 'O' : '미완료'}`,
      ].join('\n\n')
    );

  } else if (tab === 'week4') {
    const d = submission.weeklyMissions.week4;
    parts.push(
      [
        '[02. 4주차 미션]',
        `경력: ${ans(d.career)}`,
        `자격: ${ans(d.certification)}`,
        `학력: ${ans(d.education)}`,
        `공연: ${ans(d.performances)}`,
        `수상: ${ans(d.awards)}`,
        `학생 결과: ${ans(d.studentResults)}`,
        `후기: ${ans(d.reviews)}`,
        `고객 사례: ${ans(d.customerCases)}`,
        `작업물: ${ans(d.works)}`,
        `숫자 성과: ${ans(d.measurableResults)}`,
        `부족한 증거 1: ${ans(d.missingEvidence1)}`,
        `부족한 증거 2: ${ans(d.missingEvidence2)}`,
        `부족한 증거 3: ${ans(d.missingEvidence3)}`,
      ].join('\n')
    );

  } else if (tab === 'final') {
    const d = submission.weeklyMissions.final;
    parts.push(
      ['[02. 최종미션]', '최종 자기소개', `→ ${ans(d.finalIntro)}`].join('\n')
    );
  }

  return parts.join('\n\n');
}

function KakaoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="10" rx="10" ry="7.5" fill="#3B1E08" />
      <path
        d="M8.2 17.5 C7.8 17.5 7.9 17.1 8.1 16.7 L9.4 13.8 C7.0 12.9 5.5 11.2 5.5 9.3 C5.5 6.4 8.4 4.0 12 4.0 C15.6 4.0 18.5 6.4 18.5 9.3 C18.5 12.2 15.6 14.6 12 14.6 C11.2 14.6 10.4 14.5 9.7 14.3 L8.7 17.2 C8.6 17.4 8.4 17.5 8.2 17.5 Z"
        fill="#FFE566"
      />
      <ellipse cx="9" cy="9.3" rx="0.9" ry="0.9" fill="#3B1E08" />
      <ellipse cx="12" cy="9.3" rx="0.9" ry="0.9" fill="#3B1E08" />
      <ellipse cx="15" cy="9.3" rx="0.9" ry="0.9" fill="#3B1E08" />
    </svg>
  );
}

export default function KakaoVerification({
  activeTab,
  participantName,
  submission,
}: KakaoVerificationProps) {
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  function handleGenerate() {
    const text = buildKakaoText(activeTab, participantName, submission);
    setGeneratedText(text);
  }

  async function handleCopy() {
    const text = generatedText ?? buildKakaoText(activeTab, participantName, submission);
    if (!generatedText) setGeneratedText(text);
    const ok = await copyToClipboard(text);
    if (ok) {
      setShowToast(true);
      setCopyFailed(false);
      setTimeout(() => setShowToast(false), 2500);
    } else {
      setCopyFailed(true);
    }
  }

  return (
    <div>
      {/* 복사 완료 팝업 토스트 */}
      {showToast && (
        <div
          className="fixed top-6 left-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg"
          style={{
            transform: 'translateX(-50%)',
            background: '#08224A',
            color: '#FFF2A8',
            pointerEvents: 'none',
          }}
        >
          ✅ 복사되었습니다! 카톡 단톡방에 붙여넣어주세요.
        </div>
      )}

      {/* 섹션 헤더 */}
      <div className="mb-5">
        <p className="font-bold mb-1" style={{ color: '#08224A', fontSize: '1.5rem' }}>
          03. 카톡 인증
        </p>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: '#6B7280' }}>
          보고서를 먼저 확인한 뒤, 카톡 인증하기를 눌러 복사하세요.
        </p>
      </div>

      {/* 버튼 2개 */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* 보고서 만들기 */}
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95"
          style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB' }}
        >
          📄 보고서 만들기
        </button>

        {/* 카톡 인증하기 */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ background: '#FFE566', color: '#07152F', border: '1px solid #D4B800' }}
        >
          <KakaoIcon size={20} />
          카톡 인증하기
        </button>
      </div>

      {/* 복사 실패 메시지 */}
      {copyFailed && (
        <p className="text-xs mt-2" style={{ color: '#DC2626' }}>
          복사에 실패했습니다. 아래 텍스트를 직접 드래그해서 복사해주세요.
        </p>
      )}

      {/* 보고서 영역 - 보고서 만들기 클릭 후에만 표시 */}
      {generatedText && (
        <div
          className="rounded-2xl p-5 mt-5"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: '#9CA3AF' }}>
            카톡방 인증 내용
          </p>
          <pre
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: '#374151', fontFamily: 'inherit' }}
          >
            {generatedText}
          </pre>
        </div>
      )}
    </div>
  );
}
