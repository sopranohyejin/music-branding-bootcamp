'use client';

import { useEffect, useState } from 'react';
import {
  calcFlameCount,
  ParticipantSubmission,
  COMMON_MISSION_QUESTIONS,
  WEEKS,
  LOGO_BRIEF_QUESTIONS,
} from '@/lib/brandingBootcamp';
import {
  AdminParticipantRow,
  loadAdminData,
  updateCompletedWeeks,
} from '@/lib/supabaseBootcamp';

// ─────────────────────────────────────────────────────────────
// 관리자 코드 (환경변수 NEXT_PUBLIC_BOOTCAMP_ADMIN_CODE)
// ─────────────────────────────────────────────────────────────
const ADMIN_CODE = process.env.NEXT_PUBLIC_BOOTCAMP_ADMIN_CODE ?? '';
const SESSION_KEY = 'bootcamp_admin_authed';

// ─────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────
export default function AdminView() {
  const [authed, setAuthed] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [rows, setRows] = useState<AdminParticipantRow[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 세션 복원
  useEffect(() => {
    if (typeof window !== 'undefined' &&
        sessionStorage.getItem(SESSION_KEY) === 'true') {
      setAuthed(true);
    }
  }, []);

  // 인증 후 데이터 로드
  useEffect(() => {
    if (!authed) return;
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function refresh() {
    setLoadError('');
    try {
      const data = await loadAdminData();
      setRows(data);
    } catch (e) {
      console.error('Admin load error:', e);
      setLoadError('데이터 불러오기 실패. Supabase 연결 및 환경변수를 확인해주세요.');
    }
  }

  async function toggleComplete(
    participantDbId: string,
    weekKey: keyof ParticipantSubmission['completedWeeks'],
  ) {
    if (!rows) return;
    const row = rows.find((r) => r.participantDbId === participantDbId);
    if (!row) return;
    const newCompleted = {
      ...row.submission.completedWeeks,
      [weekKey]: !row.submission.completedWeeks[weekKey],
    };
    try {
      await updateCompletedWeeks(participantDbId, newCompleted);
      await refresh();
    } catch (e) {
      console.error('Toggle complete error:', e);
    }
  }

  function handleAuthSubmit() {
    if (ADMIN_CODE && codeInput === ADMIN_CODE) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
    } else {
      setAuthError('관리자 코드가 올바르지 않습니다.');
    }
  }

  // ── 관리자 코드 인증 화면 ──────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#FFF8F9]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-xs text-[#6D284A] uppercase tracking-widest mb-2">관리자</p>
            <h1 className="text-xl font-bold text-[#1F2937]">음악인 브랜딩 부트캠프</h1>
            <p className="text-sm text-[#6B7280] mt-1">관리자 코드를 입력하세요</p>
          </div>
          <div
            className="rounded-2xl bg-white p-6"
            style={{ border: '1px solid #FCE7EF', boxShadow: '0 2px 12px rgba(109,40,74,0.06)' }}
          >
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAuthSubmit(); }}
              placeholder="관리자 코드"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm mb-3"
            />
            {authError && (
              <p className="text-xs text-red-500 mb-3">{authError}</p>
            )}
            <button
              onClick={handleAuthSubmit}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#6D284A] text-white hover:bg-[#5a1f3b] transition-colors"
            >
              입장
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 로딩 / 에러 ────────────────────────────────────────────
  if (!rows) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F9]">
        {loadError ? (
          <div className="text-center px-6">
            <p className="text-sm mb-4" style={{ color: '#DC2626' }}>{loadError}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-lg bg-[#6D284A] text-white text-sm"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <p className="text-[#6B7280] text-sm">로딩 중...</p>
        )}
      </div>
    );
  }

  const selectedRow = selectedId
    ? rows.find((r) => r.participantDbId === selectedId)
    : null;

  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      {/* 관리자 헤더 */}
      <div className="bg-[#6D284A] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-start justify-between">
          <div>
            <p className="text-xs text-[#FCE7EF]/60 uppercase tracking-widest mb-1">관리자</p>
            <h1 className="text-2xl font-bold">음악인 브랜딩 부트캠프</h1>
            <p className="text-[#FCE7EF]/70 text-sm mt-1">참가자 현황 및 답변 조회</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthed(false);
              setRows(null);
              setSelectedId(null);
            }}
            className="text-xs text-[#FCE7EF]/70 hover:text-white border border-[#FCE7EF]/30 px-3 py-1.5 rounded-lg transition-colors mt-1"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {selectedRow ? (
          <AdminDetail
            row={selectedRow}
            onBack={() => setSelectedId(null)}
            onToggleComplete={(wk) => toggleComplete(selectedRow.participantDbId, wk)}
          />
        ) : (
          <AdminList
            rows={rows}
            onSelect={(id) => setSelectedId(id)}
            onToggleComplete={toggleComplete}
            onRefresh={refresh}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 목록 화면
// ─────────────────────────────────────────────────────────────
interface AdminListProps {
  rows: AdminParticipantRow[];
  onSelect: (id: string) => void;
  onToggleComplete: (id: string, wk: keyof ParticipantSubmission['completedWeeks']) => void;
  onRefresh: () => void;
}

function AdminList({ rows, onSelect, onToggleComplete, onRefresh }: AdminListProps) {
  const weekKeys: Array<keyof ParticipantSubmission['completedWeeks']> = [
    'week1', 'week2', 'week3', 'week4',
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#1F2937]">
          참가자 목록 ({rows.length}명)
        </h2>
        <button
          onClick={onRefresh}
          className="text-xs text-[#6B7280] border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:text-[#374151] transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FCE7EF] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#6D284A] text-white">
              <th className="px-4 py-4 text-left font-semibold">이름</th>
              <th className="px-4 py-4 text-left font-semibold">번호 끝</th>
              <th className="px-4 py-4 text-center font-semibold">진행률</th>
              <th className="px-4 py-4 text-center font-semibold">1주</th>
              <th className="px-4 py-4 text-center font-semibold">2주</th>
              <th className="px-4 py-4 text-center font-semibold">3주</th>
              <th className="px-4 py-4 text-center font-semibold">4주</th>
              <th className="px-4 py-4 text-left font-semibold">마지막 수정</th>
              <th className="px-4 py-4 text-center font-semibold">상세</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const flames = calcFlameCount(row.submission.completedWeeks);
              return (
                <tr
                  key={row.participantDbId}
                  className="border-t border-[#FCE7EF] hover:bg-[#FFF8F9]"
                >
                  <td className="px-4 py-4 font-semibold text-[#1F2937]">{row.name}</td>
                  <td className="px-4 py-4 text-[#9CA3AF] font-mono text-xs">
                    ****{row.phoneLast4}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm">
                      {'🔥'.repeat(flames)}{'⬜'.repeat(4 - flames)}
                    </span>
                    <span className="text-xs text-[#9CA3AF] ml-1">{flames}/4</span>
                  </td>
                  {weekKeys.map((wk) => (
                    <td key={wk} className="px-4 py-4 text-center">
                      <button
                        onClick={() => onToggleComplete(row.participantDbId, wk)}
                        title="클릭하면 완료 상태 토글"
                        className={`w-7 h-7 rounded-full text-sm transition-all hover:scale-110 ${
                          row.submission.completedWeeks[wk]
                            ? 'bg-[#E86A92] text-white'
                            : 'bg-[#F3F4F6] text-[#D1D5DB]'
                        }`}
                      >
                        {row.submission.completedWeeks[wk] ? '🔥' : '○'}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-[#9CA3AF] text-xs">
                    {row.updatedAt
                      ? new Date(row.updatedAt).toLocaleString('ko-KR', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onSelect(row.participantDbId)}
                      className="px-3 py-1.5 rounded-lg bg-[#6D284A] text-white text-xs font-semibold hover:bg-[#5a1f3b] transition-colors"
                    >
                      상세 보기
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="md:hidden flex flex-col gap-4">
        {rows.map((row) => {
          const flames = calcFlameCount(row.submission.completedWeeks);
          return (
            <div
              key={row.participantDbId}
              className="rounded-2xl border border-[#FCE7EF] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-[#1F2937]">{row.name}</p>
                  <p className="text-xs text-[#9CA3AF] font-mono">****{row.phoneLast4}</p>
                </div>
                <span className="text-lg">
                  {'🔥'.repeat(flames)}{'⬜'.repeat(4 - flames)}
                </span>
              </div>
              <div className="flex gap-2 mb-3">
                {weekKeys.map((wk, i) => (
                  <button
                    key={wk}
                    onClick={() => onToggleComplete(row.participantDbId, wk)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      row.submission.completedWeeks[wk]
                        ? 'bg-[#E86A92] text-white'
                        : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    }`}
                  >
                    {i + 1}주
                  </button>
                ))}
              </div>
              <button
                onClick={() => onSelect(row.participantDbId)}
                className="w-full py-2 rounded-xl bg-[#6D284A] text-white text-sm font-semibold hover:bg-[#5a1f3b] transition-colors"
              >
                답변 상세 보기
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 상세 화면
// ─────────────────────────────────────────────────────────────
interface AdminDetailProps {
  row: AdminParticipantRow;
  onBack: () => void;
  onToggleComplete: (wk: keyof ParticipantSubmission['completedWeeks']) => void;
}

function AdminDetail({ row, onBack, onToggleComplete }: AdminDetailProps) {
  const { submission } = row;
  const flames = calcFlameCount(submission.completedWeeks);
  const weekKeys: Array<keyof ParticipantSubmission['completedWeeks']> = [
    'week1', 'week2', 'week3', 'week4',
  ];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#6D284A] hover:text-[#5a1f3b] mb-6 font-semibold"
      >
        ← 목록으로
      </button>

      <div className="rounded-2xl bg-[#111827] text-white p-6 mb-6">
        <p className="text-xs text-[#E86A92] uppercase tracking-wider mb-1">참가자 상세</p>
        <h2 className="text-xl font-bold">{row.name}</h2>
        <p className="text-[#9CA3AF] text-sm font-mono">
          휴대폰 끝자리: ****{row.phoneLast4}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl">
            {'🔥'.repeat(flames)}{'⬜'.repeat(4 - flames)}
          </span>
          <span className="text-[#9CA3AF] text-sm">{flames}/4 완료</span>
        </div>
        {row.updatedAt && (
          <p className="text-xs text-[#6B7280] mt-2">
            마지막 수정: {new Date(row.updatedAt).toLocaleString('ko-KR')}
          </p>
        )}
      </div>

      {/* 완료 상태 */}
      <div className="rounded-2xl border border-[#FCE7EF] bg-white p-5 mb-6">
        <p className="font-bold text-[#1F2937] mb-4">완료 상태 (클릭하여 수정)</p>
        <div className="flex flex-wrap gap-3">
          {weekKeys.map((wk, i) => (
            <button
              key={wk}
              onClick={() => onToggleComplete(wk)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                submission.completedWeeks[wk]
                  ? 'bg-[#E86A92] text-white'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB]'
              }`}
            >
              {i + 1}주차 {submission.completedWeeks[wk] ? '🔥 완료' : '○ 미완료'}
            </button>
          ))}
        </div>
      </div>

      {/* 주차별 답변 */}
      {WEEKS.map((week) => (
        <div key={week.id} className="mb-8">
          <h3 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
            {submission.completedWeeks[week.id] && <span>🔥</span>}
            {week.label}: {week.title}
          </h3>

          {/* 공통 미션 */}
          <div className="rounded-2xl border border-[#FCE7EF] bg-white p-5 mb-3">
            <p className="text-xs font-bold text-[#6D284A] uppercase tracking-wider mb-4">
              공통 미션 - 비즈니스 점검표
            </p>
            {COMMON_MISSION_QUESTIONS.map((q) => {
              const answer = submission.commonMissions[week.id][q.id];
              return (
                <div key={q.id} className="mb-4">
                  <p className="text-xs font-semibold text-[#374151]">
                    {q.number} {q.question}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mb-1">{q.sub}</p>
                  <p className="text-sm text-[#1F2937] bg-[#FFF8F9] rounded-lg px-3 py-2 whitespace-pre-wrap min-h-[36px]">
                    {answer || <span className="text-[#D1D5DB] italic">미작성</span>}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 별도 미션 */}
          <AdminWeekAnswers week={week.id} submission={submission} />
        </div>
      ))}

      {/* 최종 미션 */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#1F2937] mb-3">
          🎓 졸업 과제 - 최종 자기소개
        </h3>
        <div className="rounded-2xl border border-[#FCE7EF] bg-white p-5">
          <p className="text-sm text-[#1F2937] whitespace-pre-wrap min-h-[60px]">
            {submission.weeklyMissions.final.finalIntro || (
              <span className="text-[#D1D5DB] italic">미작성</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 주차별 개별 답변
// ─────────────────────────────────────────────────────────────
function AdminWeekAnswers({
  week,
  submission,
}: {
  week: keyof ParticipantSubmission['completedWeeks'];
  submission: ParticipantSubmission;
}) {
  const wm = submission.weeklyMissions;

  const answerBlock = (label: string, value: string | boolean | string[]) => {
    if (typeof value === 'boolean') {
      return <AnswerRow key={label} label={label} value={value ? '✅ 완료' : '미완료'} />;
    }
    if (Array.isArray(value)) {
      return (
        <div key={label} className="mb-3">
          <p className="text-xs font-semibold text-[#374151] mb-1">{label}</p>
          <div className="flex flex-col gap-1">
            {value.map((v, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-[#9CA3AF] w-5">{i + 1}.</span>
                <span className="text-[#1F2937]">
                  {v || <span className="text-[#D1D5DB] italic">미작성</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <AnswerRow key={label} label={label} value={value} />;
  };

  let content: React.ReactNode = null;

  if (week === 'week1') {
    content = answerBlock('현재 자기소개', wm.week1.currentIntro);
  } else if (week === 'week2') {
    content = (
      <>
        {answerBlock('나의 타깃', wm.week2.targetCustomer)}
        {answerBlock('특징 1', wm.week2.feature1)}
        {answerBlock('특징 2', wm.week2.feature2)}
        {answerBlock('특징 3', wm.week2.feature3)}
        {answerBlock('나를 기억시키는 한 문장', wm.week2.oneSentenceBrand)}
        <div className="mb-3">
          <p className="text-xs font-semibold text-[#374151] mb-2">로고 브리프</p>
          <div className="bg-[#FFF8F9] rounded-xl p-3 grid grid-cols-2 gap-2">
            {LOGO_BRIEF_QUESTIONS.map((q) => (
              <div key={q.id}>
                <p className="text-xs text-[#9CA3AF]">{q.label}</p>
                <p className="text-xs text-[#1F2937]">
                  {wm.week2.logoBrief[q.id] || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else if (week === 'week3') {
    content = (
      <>
        {answerBlock('고객 문제 10개', wm.week3.customerProblems)}
        {answerBlock('선택한 고객 문제', wm.week3.selectedProblem)}
        {answerBlock('30초 셀 스피치 대본', wm.week3.selfPitchScript)}
        {answerBlock('녹음 완료', wm.week3.recordingDone)}
        {answerBlock('녹음 인증 메모', wm.week3.recordingNote)}
      </>
    );
  } else if (week === 'week4') {
    content = (
      <>
        {answerBlock('경력', wm.week4.career)}
        {answerBlock('자격', wm.week4.certification)}
        {answerBlock('학력', wm.week4.education)}
        {answerBlock('공연', wm.week4.performances)}
        {answerBlock('수상', wm.week4.awards)}
        {answerBlock('학생 결과', wm.week4.studentResults)}
        {answerBlock('후기', wm.week4.reviews)}
        {answerBlock('고객 사례', wm.week4.customerCases)}
        {answerBlock('작업물', wm.week4.works)}
        {answerBlock('숫자 성과', wm.week4.measurableResults)}
        {answerBlock('부족한 증거 1', wm.week4.missingEvidence1)}
        {answerBlock('부족한 증거 2', wm.week4.missingEvidence2)}
        {answerBlock('부족한 증거 3', wm.week4.missingEvidence3)}
      </>
    );
  }

  if (!content) return null;

  return (
    <div className="rounded-2xl border border-[#F3F4F6] bg-white p-5">
      <p className="text-xs font-bold text-[#E86A92] uppercase tracking-wider mb-4">
        별도 미션
      </p>
      {content}
    </div>
  );
}

function AnswerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold text-[#374151] mb-1">{label}</p>
      <p className="text-sm text-[#1F2937] bg-[#FFF8F9] rounded-lg px-3 py-2 whitespace-pre-wrap min-h-[36px]">
        {value || <span className="text-[#D1D5DB] italic">미작성</span>}
      </p>
    </div>
  );
}
