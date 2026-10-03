'use client';

import { useEffect, useState, useRef } from 'react';
import {
  ParticipantSubmission,
  saveSubmission,
  loadSubmission,
  isWeekReleased,
  isFinalReleased,
  WEEKS,
  TEST_MODE,
  CommonMissions,
  Week1Data,
  Week2Data,
  Week3Data,
  Week4Data,
  FinalData,
} from '@/lib/brandingBootcamp';
import {
  getOrCreateParticipant,
  getOrCreateSubmission,
  upsertSubmission,
} from '@/lib/supabaseBootcamp';
import { getSupabaseConfigError } from '@/lib/supabaseClient';

// 수강생 입장 비밀코드 – NEXT_PUBLIC_BOOTCAMP_SECRET_CODE 환경변수로 설정
// Vercel: Project Settings > Environment Variables > NEXT_PUBLIC_BOOTCAMP_SECRET_CODE
// 주의: NEXT_PUBLIC_ 변수는 클라이언트에 노출됩니다.
//       현재는 외부 유입 차단용 간단한 입장코드 용도입니다.
// TODO: 보안 강화 시 Supabase Auth 또는 서버 API 라우트로 검증 방식을 교체하세요.
const SECRET_CODE = (process.env.NEXT_PUBLIC_BOOTCAMP_SECRET_CODE ?? '').trim();

import BootcampHero from './BootcampHero';
import BootcampStructureTable from './BootcampStructureTable';
import CommonMissionForm from './CommonMissionForm';
import Week1Form from './Week1Form';
import Week2Form from './Week2Form';
import Week3Form from './Week3Form';
import Week4Form from './Week4Form';
import FinalMissionForm from './FinalMissionForm';
import BrandingFormula from './BrandingFormula';
import Toast from './Toast';
import KakaoVerification from './KakaoVerification';
import CompletionCelebrationModal from './CompletionCelebrationModal';

type ActiveTab = 'week1' | 'week2' | 'week3' | 'week4' | 'final';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const CACHE_KEY = 'bootcamp_current_participant';

function tabStyle(isActive: boolean) {
  return {
    background: isActive ? '#FFF2A8' : '#ffffff',
    color: isActive ? '#07152F' : '#08224A',
    border: `1px solid ${isActive ? '#E6D27A' : '#D1D9E6'}`,
    fontWeight: isActive ? '700' : '600',
  };
}

export default function ParticipantBootcampView() {
  // ── 로그인 상태 ────────────────────────────────────────────
  const [appState, setAppState] = useState<'login' | 'loading' | 'ready'>('login');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── 참가자 + 제출 데이터 ───────────────────────────────────
  const [participantDbId, setParticipantDbId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [submission, setSubmission] = useState<ParticipantSubmission | null>(null);

  // ── UI 상태 ────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('week1');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 5분 자동저장 interval에서 항상 최신 값 참조용 refs
  const submissionRef = useRef<ParticipantSubmission | null>(null);
  const participantDbIdRef = useRef<string>('');
  submissionRef.current = submission;
  participantDbIdRef.current = participantDbId;

  // ── 전체 미션 완주 감지 ────────────────────────────────────
  const isAllComplete = !!(
    submission &&
    submission.completedWeeks.week1 &&
    submission.completedWeeks.week2 &&
    submission.completedWeeks.week3 &&
    submission.completedWeeks.week4 &&
    submission.weeklyMissions.final.finalIntro.trim().length > 0
  );

  useEffect(() => {
    if (isAllComplete && !celebrationTriggered) {
      setShowCelebration(true);
      setCelebrationTriggered(true);
    }
  }, [isAllComplete, celebrationTriggered]);

  // ── 마운트 시 localStorage 캐시 확인 → Supabase 복원 ──────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;
    try {
      const { participantDbId: cachedId, participantName: cachedName } = JSON.parse(cached);
      if (!cachedId || !cachedName) return;
      setParticipantDbId(cachedId);
      setParticipantName(cachedName);
      setAppState('loading');
      getOrCreateSubmission(cachedId)
        .then((sub) => {
          // localStorage 데이터가 Supabase보다 최신이면 (예: 저장 전 브라우저 종료) localStorage 우선
          const localSub = loadSubmission(cachedId);
          const localTime = localSub.updatedAt ? new Date(localSub.updatedAt).getTime() : 0;
          const supabaseTime = sub.updatedAt ? new Date(sub.updatedAt).getTime() : 0;
          const useLocal = localTime > supabaseTime;
          // Supabase가 최신일 때만 localStorage 동기화 (불필요한 updatedAt 갱신 방지)
          if (!useLocal) saveSubmission(sub);
          setSubmission(useLocal ? localSub : sub);
          setAppState('ready');
        })
        .catch(() => {
          localStorage.removeItem(CACHE_KEY);
          setAppState('login');
        });
    } catch {
      setAppState('login');
    }
  }, []);

  // ── 5분마다 자동저장 ────────────────────────────────────────
  useEffect(() => {
    if (appState !== 'ready') return;
    autoSaveIntervalRef.current = setInterval(async () => {
      if (!submissionRef.current || !participantDbIdRef.current) return;
      try {
        await upsertSubmission(participantDbIdRef.current, submissionRef.current);
      } catch (e) {
        console.error('[Bootcamp] 5분 자동저장 실패:', e);
      }
    }, 5 * 60 * 1000);
    return () => {
      if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    };
  }, [appState]);

  // ── 타이머 정리 ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    };
  }, []);

  // ── 로그인 핸들러 ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const name = nameInput.trim();
    const phone = phoneInput.trim();
    const secret = secretCodeInput.trim();

    // 1. 이름 검증
    if (!name) { setLoginError('이름을 입력해주세요.'); return; }
    // 2. 전화번호 검증
    if (!/^\d{4}$/.test(phone)) { setLoginError('휴대폰 뒤 4자리를 숫자 4자리로 입력해주세요.'); return; }
    // 3. 비밀코드 비어있음
    if (!secret) { setLoginError('비밀코드를 입력해주세요.'); return; }
    // 4. 비밀코드 환경변수 미설정 (관리자에게 문의)
    if (!SECRET_CODE) {
      console.error('Missing NEXT_PUBLIC_BOOTCAMP_SECRET_CODE');
      setLoginError('입장 코드 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.');
      return;
    }
    // 5. 비밀코드 불일치
    if (secret !== SECRET_CODE) { setLoginError('비밀코드가 올바르지 않습니다.'); return; }
    // 6. Supabase 환경변수 검증
    const configErr = getSupabaseConfigError();
    if (configErr) {
      setLoginError('서비스 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.');
      return;
    }

    setLoginError('');
    setIsSubmitting(true);
    setAppState('loading');

    try {
      // 7. 참가자 생성/조회
      let participant;
      try {
        participant = await getOrCreateParticipant(name, phone);
      } catch (err) {
        console.error('[Bootcamp Entry] participant fetch/create failed:', err);
        setLoginError('참가자 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setIsSubmitting(false);
        setAppState('login');
        return;
      }

      // 8. 제출 데이터 생성/조회
      let sub;
      try {
        sub = await getOrCreateSubmission(participant.id);
      } catch (err) {
        console.error('[Bootcamp Entry] submission fetch/create failed:', err);
        setLoginError('미션 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setIsSubmitting(false);
        setAppState('login');
        return;
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        participantDbId: participant.id,
        participantName: participant.name,
      }));

      // localStorage 데이터가 Supabase보다 최신이면 (예: 저장 전 브라우저 종료) localStorage 우선
      const localSub = loadSubmission(participant.id);
      const localTime = localSub.updatedAt ? new Date(localSub.updatedAt).getTime() : 0;
      const supabaseTime = sub.updatedAt ? new Date(sub.updatedAt).getTime() : 0;
      const useLocal = localTime > supabaseTime;
      // Supabase가 최신일 때만 localStorage 동기화 (불필요한 updatedAt 갱신 방지)
      if (!useLocal) saveSubmission(sub);

      setParticipantDbId(participant.id);
      setParticipantName(participant.name);
      setSubmission(useLocal ? localSub : sub);
      setAppState('ready');
    } catch (err) {
      console.error('[Bootcamp Entry] unexpected error:', err);
      setLoginError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
      setAppState('login');
    }
  }

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg: string) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }

  // ── 저장 (debounce 800ms → Supabase) ───────────────────────
  function updateAndSave(newSubmission: ParticipantSubmission) {
    setSubmission(newSubmission);
    saveSubmission(newSubmission); // localStorage 캐시

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setSaveStatus('saving');

    saveTimerRef.current = setTimeout(async () => {
      try {
        await upsertSubmission(participantDbId, newSubmission);
        setSaveStatus('saved');
        idleTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Supabase save error:', e);
        setSaveStatus('error');
      }
    }, 800);
  }

  // ── 로딩 화면 ─────────────────────────────────────────────
  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBEA' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>데이터 불러오는 중...</p>
      </div>
    );
  }

  // ── 로그인 화면 ────────────────────────────────────────────
  if (appState === 'login') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#FFFBEA' }}
      >
        <div className="w-full max-w-sm">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-2"
              style={{ color: '#4A6080' }}
            >
              4주 음악인 브랜딩 부트캠프
            </p>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#07152F' }}>헬퍼지니</h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              이름과 휴대폰 뒤 4자리로 입장하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 rounded-2xl p-6 bg-white"
            style={{ border: '1px solid #EFE4B0', boxShadow: '0 2px 12px rgba(7,21,47,0.06)' }}
          >
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: '#07152F' }}
              >
                이름
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="홍길동"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: '#D1D9E6',
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': '#E6D27A',
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: '#07152F' }}
              >
                휴대폰 뒤 4자리
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={4}
                value={phoneInput}
                onChange={(e) =>
                  setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder="1234"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                style={{ borderColor: '#D1D9E6' }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: '#07152F' }}
              >
                비밀코드
              </label>
              <input
                type="password"
                autoComplete="off"
                value={secretCodeInput}
                onChange={(e) => setSecretCodeInput(e.target.value)}
                placeholder="강의에서 안내받은 비밀코드를 입력해주세요"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                style={{ borderColor: '#D1D9E6' }}
              />
              <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>
                강의에서 안내받은 비밀코드를 입력해야 입장할 수 있습니다.
              </p>
            </div>
            {loginError && (
              <p className="text-xs" style={{ color: '#DC2626' }}>{loginError}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm mt-1 disabled:opacity-60"
              style={{ background: '#08224A', color: '#FFF2A8' }}
            >
              {isSubmitting ? '입장 중...' : '입장하기'}
            </button>
            <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
              같은 정보로 다시 입장하면 기존 답변이 불러와집니다.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── submission 로드 대기 ────────────────────────────────────
  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBEA' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>데이터 로딩 중...</p>
      </div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────
  function completeWeek(weekKey: keyof ParticipantSubmission['completedWeeks']) {
    if (!submission) return;
    updateAndSave({
      ...submission,
      completedWeeks: { ...submission.completedWeeks, [weekKey]: true },
    });
    showToast('⭐ 미션 완료!');
  }

  function uncompleteWeek(weekKey: keyof ParticipantSubmission['completedWeeks']) {
    if (!submission) return;
    updateAndSave({
      ...submission,
      completedWeeks: { ...submission.completedWeeks, [weekKey]: false },
    });
  }

  const releasedWeeks = WEEKS.map((w) => isWeekReleased(w));

  // 다음 주차가 공개되면 해당 주차는 잠금(읽기 전용). TEST_MODE 에서는 항상 편집 가능.
  function isWeekLocked(weekId: string): boolean {
    if (TEST_MODE) return false;
    const idx = WEEKS.findIndex((w) => w.id === weekId);
    if (idx < 0 || idx >= WEEKS.length - 1) return false;
    return isWeekReleased(WEEKS[idx + 1]);
  }

  // ── 메인 렌더 ──────────────────────────────────────────────
  return (
    <div className="bg-[#FFFBEA] min-h-screen">
      {/* A. 히어로 */}
      <BootcampHero
        participantName={participantName}
        completedWeeks={submission.completedWeeks}
      />

      {/* B. 구조표 */}
      <BootcampStructureTable />

      {/* C. 탭 바 */}
      <div
        className="sticky top-0 z-20 border-b border-t w-full"
        style={{ background: '#FFE566', borderColor: '#D4B800', boxShadow: '0 2px 8px rgba(180,140,0,0.15)' }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {WEEKS.map((w, i) => {
              const isReleased = releasedWeeks[i];
              const isSelected = activeTab === w.id;
              const isCompleted = submission.completedWeeks[w.id as keyof typeof submission.completedWeeks];
              if (isReleased) {
                return (
                  <button
                    key={w.id}
                    onClick={() => setActiveTab(w.id as ActiveTab)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-150"
                    style={tabStyle(isSelected)}
                  >
                    {isCompleted ? '✅ ' : ''}{w.label}
                  </button>
                );
              }
              return (
                <button
                  key={w.id}
                  onClick={() => showToast('해당 미션은 아직 공개 전입니다.')}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.35)',
                    color: 'rgba(8,34,74,0.4)',
                    cursor: 'not-allowed',
                    border: '1px solid rgba(209,217,230,0.5)',
                    fontWeight: '600',
                  }}
                >
                  🔒 {w.label}
                </button>
              );
            })}
            {isFinalReleased() ? (
              <button
                onClick={() => setActiveTab('final')}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-150"
                style={tabStyle(activeTab === 'final')}
              >
                {submission.weeklyMissions.final.finalIntro.trim().length > 0 ? '✅ ' : ''}최종미션
              </button>
            ) : (
              <button
                onClick={() => showToast('최종미션은 2026년 11월 3일(화) 21:50에 공개됩니다.')}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  color: 'rgba(8,34,74,0.4)',
                  cursor: 'not-allowed',
                  border: '1px solid rgba(209,217,230,0.5)',
                  fontWeight: '600',
                }}
              >
                🔒 최종미션
              </button>
            )}
          </div>
        </div>
      </div>

      {/* D. 탭 컨텐츠 */}
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* ── 01. 공통미션 (주차 탭만) ── */}
        {activeTab !== 'final' && (
          <CommonMissionForm
            data={submission.commonMissions}
            activeWeek={activeTab as 'week1' | 'week2' | 'week3' | 'week4'}
            onUpdate={(cm: CommonMissions) =>
              updateAndSave({ ...submission, commonMissions: cm })
            }
            onShowToast={showToast}
            isLocked={isWeekLocked(activeTab as 'week1' | 'week2' | 'week3' | 'week4')}
          />
        )}

        {/* ── 02. 주차 미션 ── */}
        <div className="border-t pt-10" style={{ borderColor: '#EFE4B0' }}>
          <p className="font-bold mb-6" style={{ color: '#08224A', fontSize: '1.5rem' }}>
            {activeTab === 'week1' && '02. 1주차 미션'}
            {activeTab === 'week2' && '02. 2주차 미션'}
            {activeTab === 'week3' && '02. 3주차 미션'}
            {activeTab === 'week4' && '02. 4주차 미션'}
            {activeTab === 'final' && '02. 최종미션'}
          </p>

          {activeTab === 'week1' && (
            <Week1Form
              data={submission.weeklyMissions.week1}
              isReleased={releasedWeeks[0]}
              completedWeeks={submission.completedWeeks}
              isLocked={isWeekLocked('week1')}
              onUpdate={(d: Week1Data) =>
                updateAndSave({
                  ...submission,
                  weeklyMissions: { ...submission.weeklyMissions, week1: d },
                })
              }
              onComplete={() => completeWeek('week1')}
              onUncomplete={() => uncompleteWeek('week1')}
            />
          )}
          {activeTab === 'week2' && (
            <Week2Form
              data={submission.weeklyMissions.week2}
              isReleased={releasedWeeks[1]}
              completedWeeks={submission.completedWeeks}
              isLocked={isWeekLocked('week2')}
              onUpdate={(d: Week2Data) =>
                updateAndSave({
                  ...submission,
                  weeklyMissions: { ...submission.weeklyMissions, week2: d },
                })
              }
              onComplete={() => completeWeek('week2')}
              onUncomplete={() => uncompleteWeek('week2')}
              onShowToast={showToast}
            />
          )}
          {activeTab === 'week3' && (
            <Week3Form
              data={submission.weeklyMissions.week3}
              isReleased={releasedWeeks[2]}
              completedWeeks={submission.completedWeeks}
              isLocked={isWeekLocked('week3')}
              onUpdate={(d: Week3Data) =>
                updateAndSave({
                  ...submission,
                  weeklyMissions: { ...submission.weeklyMissions, week3: d },
                })
              }
              onComplete={() => completeWeek('week3')}
              onUncomplete={() => uncompleteWeek('week3')}
            />
          )}
          {activeTab === 'week4' && (
            <Week4Form
              data={submission.weeklyMissions.week4}
              isReleased={releasedWeeks[3]}
              completedWeeks={submission.completedWeeks}
              isLocked={isWeekLocked('week4')}
              onUpdate={(d: Week4Data) =>
                updateAndSave({
                  ...submission,
                  weeklyMissions: { ...submission.weeklyMissions, week4: d },
                })
              }
              onComplete={() => completeWeek('week4')}
              onUncomplete={() => uncompleteWeek('week4')}
            />
          )}
          {activeTab === 'final' && (
            isFinalReleased() ? (
              <FinalMissionForm
                finalData={submission.weeklyMissions.final}
                week1Data={submission.weeklyMissions.week1}
                commonMissions={submission.commonMissions}
                completedWeeks={submission.completedWeeks}
                onUpdate={(d: FinalData) =>
                  updateAndSave({
                    ...submission,
                    weeklyMissions: { ...submission.weeklyMissions, final: d },
                  })
                }
                onShowToast={showToast}
              />
            ) : (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
              >
                <p className="text-4xl mb-4">🔒</p>
                <p className="font-bold text-lg mb-2" style={{ color: '#08224A' }}>
                  최종미션은 아직 공개 전입니다
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  2026년 11월 3일(화) 21:50 공개 예정
                </p>
              </div>
            )
          )}
        </div>

        {/* ── 03. 카톡 인증 ── */}
        <div className="border-t pt-10" style={{ borderColor: '#EFE4B0' }}>
          <KakaoVerification
            activeTab={activeTab}
            participantName={participantName}
            submission={submission}
          />
        </div>

      </div>

      {/* 저장 상태 표시기 */}
      {saveStatus !== 'idle' && (
        <div
          className="fixed bottom-5 right-5 z-50 px-3 py-2 rounded-xl text-xs font-semibold shadow-md"
          style={{
            background:
              saveStatus === 'error'
                ? '#FEF2F2'
                : saveStatus === 'saving'
                ? '#FFFBEA'
                : '#F0FDF4',
            color:
              saveStatus === 'error'
                ? '#DC2626'
                : saveStatus === 'saving'
                ? '#6B7280'
                : '#16A34A',
            border: `1px solid ${
              saveStatus === 'error'
                ? '#FECACA'
                : saveStatus === 'saving'
                ? '#EFE4B0'
                : '#BBF7D0'
            }`,
          }}
        >
          {saveStatus === 'saving'
            ? '저장 중...'
            : saveStatus === 'saved'
            ? '저장됨 ✓'
            : '저장 실패. 다시 시도해주세요.'}
        </div>
      )}

      {/* 완주 카드 다시 보기 버튼 (전체 완료 시 좌측 하단에 표시) */}
      {isAllComplete && !showCelebration && (
        <button
          onClick={() => setShowCelebration(true)}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-opacity hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #0C2040, #07152F)',
            color: '#F3D96B',
            border: '1px solid rgba(243,217,107,0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          🎓 완주 카드 보기
        </button>
      )}

      {/* 완주 축하 모달 */}
      {showCelebration && (
        <CompletionCelebrationModal
          participantName={participantName}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* E. 브랜딩 공식 */}
      <BrandingFormula />

      {/* 푸터 */}
      <footer
        className="text-center py-10 px-6"
        style={{ background: '#04152D' }}
      >
        <p className="text-xs mb-5" style={{ color: '#6B7280' }}>음악인 브랜딩 부트캠프 · 헬퍼지니</p>
        <div className="flex items-center justify-center gap-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/musicianhelper_jiny/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ color: '#B8C5D9', textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span className="text-xs font-medium">Instagram</span>
          </a>
          {/* Threads */}
          <a
            href="https://www.threads.com/@musicianhelper_jiny?xmt=AQG0RbElUplrK_tw4WgA2XpWYZjN9fnT4Csyzr87phPxotM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ color: '#B8C5D9', textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7.5c-1-2-3-3.5-7-3.5C7.5 4 4 7.5 4 12s3.5 8 8 8c3.5 0 5.5-1.5 6.5-4"/>
              <path d="M14 12c0-2.5-1.5-4-4-4S6 10 6 12s1.5 4 4 4"/>
              <path d="M14 12c0 2.5-1 4-3.5 4"/>
            </svg>
            <span className="text-xs font-medium">Threads</span>
          </a>
        </div>
      </footer>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
