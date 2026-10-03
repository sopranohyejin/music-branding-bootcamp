// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
/** true: 참가자도 완료 취소 가능 / false: 관리자만 취소 가능 */
export const ALLOW_PARTICIPANT_UNCOMPLETE = true;

/** Custom GPT URL – 값이 있으면 새 탭으로 열고, 없으면 안내 표시 */
export const CUSTOM_GPT_URL = '';

/**
 * 테스트 모드 플래그
 * true  → 모든 주차 즉시 공개, 최종 미션 잠금 해제 (검수/테스트 용도)
 * false → 실제 releaseDate 기준으로 잠금 운영
 */
export const TEST_MODE = true;

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────
export interface Participant {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'participant';
}

export interface LogoBriefData {
  name: string;
  major: string;
  product: string;
  nameLength: string;
  favoriteColor: string;
  adjectives: string;
  nickname: string;
  emphasis: string;
}

export interface Week1Data {
  currentIntro: string;
}

export interface Week2Data {
  targetCustomer: string;
  oneSentenceBrand: string;
  feature1: string;
  feature2: string;
  feature3: string;
  logoBrief: LogoBriefData;
}

export interface Week3Data {
  customerProblems: string[];
  selectedProblem: string;
  selfPitchScript: string;
  recordingDone: boolean;
  recordingNote: string;
}

export interface Week4Data {
  career: string;
  certification: string;
  education: string;
  performances: string;
  awards: string;
  studentResults: string;
  reviews: string;
  customerCases: string;
  works: string;
  measurableResults: string;
  missingEvidence1: string;
  missingEvidence2: string;
  missingEvidence3: string;
}

export interface FinalData {
  finalIntro: string;
}

export interface WeeklyMissions {
  week1: Week1Data;
  week2: Week2Data;
  week3: Week3Data;
  week4: Week4Data;
  final: FinalData;
}

export interface CommonMissionWeekData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
}

export interface CommonMissions {
  week1: CommonMissionWeekData;
  week2: CommonMissionWeekData;
  week3: CommonMissionWeekData;
  week4: CommonMissionWeekData;
}

export interface CompletedWeeks {
  week1: boolean;
  week2: boolean;
  week3: boolean;
  week4: boolean;
}

export interface ParticipantSubmission {
  participantId: string;
  commonMissions: CommonMissions;
  weeklyMissions: WeeklyMissions;
  completedWeeks: CompletedWeeks;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Mock 참가자 데이터
// ─────────────────────────────────────────────
// p001~p050 슬롯 (이름은 관리자가 직접 수정)
export const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p001', name: '김혜민', phone: '', email: '', role: 'participant' },
  ...Array.from({ length: 49 }, (_, i) => ({
    id: `p${String(i + 2).padStart(3, '0')}`,
    name: `참가자 ${i + 2}`,
    phone: '',
    email: '',
    role: 'participant' as const,
  })),
];

// ─────────────────────────────────────────────
// 주차 데이터 – releaseDate / lectureDate만 바꾸면 운영 가능
// ─────────────────────────────────────────────
export type WeekId = 'week1' | 'week2' | 'week3' | 'week4';

export interface WeekData {
  id: WeekId;
  label: string;
  title: string;
  lectureTitle: string;
  individualMissionTitle: string;
  releaseDate: string; // ISO 8601, Asia/Seoul
  lectureDate: string; // ISO 8601, Asia/Seoul
}

export const WEEKS: WeekData[] = [
  {
    id: 'week1',
    label: '1주차',
    title: '나는 음악가인가, 사업가인가?',
    lectureTitle: '브랜딩 전략 이해 / 음악가 → 사업가 사고전환',
    individualMissionTitle: '현재 자기소개 작성',
    releaseDate: '2026-10-06T00:00:00+09:00',
    lectureDate: '2026-10-06T21:00:00+09:00',
  },
  {
    id: 'week2',
    label: '2주차',
    title: '나를 기억시키는 브랜드 만들기',
    lectureTitle: '각인: 노출 + 특징',
    individualMissionTitle: '나를 기억시키는 한 문장',
    releaseDate: '2026-10-13T00:00:00+09:00',
    lectureDate: '2026-10-13T21:00:00+09:00',
  },
  {
    id: 'week3',
    label: '3주차',
    title: '고객 문제와 30초 셀 스피치',
    lectureTitle: '가치 + 셀 스피치: 고객 중심 사고',
    individualMissionTitle: '30초 셀 스피치',
    releaseDate: '2026-10-20T00:00:00+09:00',
    lectureDate: '2026-10-20T21:00:00+09:00',
  },
  {
    id: 'week4',
    label: '4주차',
    title: '나의 신용 자산 만들기',
    lectureTitle: '신용: 신뢰를 자산으로 만드는 법',
    individualMissionTitle: '신용 자산 리스트',
    releaseDate: '2026-10-27T00:00:00+09:00',
    lectureDate: '2026-10-27T21:00:00+09:00',
  },
];

// ─────────────────────────────────────────────
// 전체 구조표 데이터
// ─────────────────────────────────────────────
export interface StructureRow {
  week: string;
  schedule: string;
  lecture: string;
  individualMission: string;
  commonMission: string;
}

export const STRUCTURE_TABLE: StructureRow[] = [
  {
    week: '1주',
    schedule: '10/06 (화)',
    lecture: '브랜딩 전략 이해 / 음악가 → 사업가 사고전환',
    individualMission: '현재 자기소개 작성',
    commonMission: '비즈니스 점검표 1차',
  },
  {
    week: '2주',
    schedule: '10/13 (화)',
    lecture: '각인: 노출 + 특징',
    individualMission: '나를 기억시키는 한 문장',
    commonMission: '비즈니스 점검표 2차',
  },
  {
    week: '3주',
    schedule: '10/20 (화)',
    lecture: '가치 + 셀 스피치: 고객 중심 사고',
    individualMission: '30초 셀 스피치',
    commonMission: '비즈니스 점검표 3차',
  },
  {
    week: '4주',
    schedule: '10/27 (화)',
    lecture: '신용: 신뢰를 자산으로 만드는 법',
    individualMission: '신용 자산 리스트',
    commonMission: '비즈니스 점검표 4차',
  },
  {
    week: '졸업',
    schedule: '11/03 (화)',
    lecture: '-',
    individualMission: '4주 답변을 바탕으로 최종 자기소개',
    commonMission: '-',
  },
];

// ─────────────────────────────────────────────
// 공통 미션 질문
// ─────────────────────────────────────────────
export const COMMON_MISSION_QUESTIONS = [
  {
    id: 'q1' as const,
    number: '①',
    question: '나는 누구인가?',
    sub: '나는 어떤 일을 하는 사람인가?',
  },
  {
    id: 'q2' as const,
    number: '②',
    question: '나는 누구를 위한 사람인가?',
    sub: '내가 가장 도움을 줄 수 있는 사람은 누구인가?',
  },
  {
    id: 'q3' as const,
    number: '③',
    question: '그 사람에게 어떤 문제가 있는가?',
    sub: '그 사람은 무엇 때문에 나를 필요로 하는가?',
  },
  {
    id: 'q4' as const,
    number: '④',
    question: '나는 무엇을 제공하는가?',
    sub: '나는 그 사람에게 무엇을 해줄 수 있는가?',
  },
  {
    id: 'q5' as const,
    number: '⑤',
    question: '그래서 고객은 무엇을 얻는가?',
    sub: '나를 선택했을 때 고객의 무엇이 달라지는가?',
  },
  {
    id: 'q6' as const,
    number: '⑥',
    question: '왜 하필 나인가?',
    sub: '비슷한 일을 하는 다른 사람과 비교했을 때 나를 선택할 이유는 무엇인가?',
  },
  {
    id: 'q7' as const,
    number: '⑦',
    question: '내가 그것을 잘한다고 어떻게 증명할 수 있는가?',
    sub: '내가 가진 경험·결과·사례·기록은 무엇인가?',
  },
  {
    id: 'q8' as const,
    number: '⑧',
    question: '지금 고객이 나를 선택하지 않는다면 그 이유는 무엇일까?',
    sub: '내 비즈니스에서 현재 부족한 것은 무엇인가?',
  },
];

// ─────────────────────────────────────────────
// 로고 브리프 질문
// ─────────────────────────────────────────────
export const LOGO_BRIEF_QUESTIONS: Array<{ id: keyof LogoBriefData; label: string }> = [
  { id: 'name', label: '나의 이름은?' },
  { id: 'major', label: '나의 전공은?' },
  { id: 'product', label: '내가 판매하는 상품은?' },
  { id: 'nameLength', label: '내가 원하는 이름의 글자수는?' },
  { id: 'favoriteColor', label: '내가 좋아하는 색상은?' },
  { id: 'adjectives', label: '나를 표현하는 형용사는?' },
  { id: 'nickname', label: '내가 자주 듣는 별명은?' },
  { id: 'emphasis', label: '내가 내세우고 싶은 것은?' },
];

// ─────────────────────────────────────────────
// 기본값 구조 (빈 문자열 fallback)
// ─────────────────────────────────────────────
export const DEFAULT_COMMON_WEEK: CommonMissionWeekData = {
  q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '',
};

export const DEFAULT_LOGO_BRIEF: LogoBriefData = {
  name: '', major: '', product: '', nameLength: '',
  favoriteColor: '', adjectives: '', nickname: '', emphasis: '',
};

export function createDefaultSubmission(participantId: string): ParticipantSubmission {
  return {
    participantId,
    commonMissions: {
      week1: { ...DEFAULT_COMMON_WEEK },
      week2: { ...DEFAULT_COMMON_WEEK },
      week3: { ...DEFAULT_COMMON_WEEK },
      week4: { ...DEFAULT_COMMON_WEEK },
    },
    weeklyMissions: {
      week1: { currentIntro: '' },
      week2: {
        targetCustomer: '',
        oneSentenceBrand: '',
        feature1: '', feature2: '', feature3: '',
        logoBrief: { ...DEFAULT_LOGO_BRIEF },
      },
      week3: {
        customerProblems: Array(10).fill('') as string[],
        selectedProblem: '',
        selfPitchScript: '',
        recordingDone: false,
        recordingNote: '',
      },
      week4: {
        career: '', certification: '', education: '', performances: '',
        awards: '', studentResults: '', reviews: '', customerCases: '',
        works: '', measurableResults: '',
        missingEvidence1: '', missingEvidence2: '', missingEvidence3: '',
      },
      final: { finalIntro: '' },
    },
    completedWeeks: { week1: false, week2: false, week3: false, week4: false },
    updatedAt: '',
  };
}

// ─────────────────────────────────────────────
// 데이터 정규화 – 필드 누락/타입 오류 방어
// ─────────────────────────────────────────────
function strVal(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function boolVal(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false;
}

function mergeCommonWeek(raw: unknown): CommonMissionWeekData {
  const d = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    q1: strVal(d.q1), q2: strVal(d.q2), q3: strVal(d.q3), q4: strVal(d.q4),
    q5: strVal(d.q5), q6: strVal(d.q6), q7: strVal(d.q7), q8: strVal(d.q8),
  };
}

function mergeLogoBrief(raw: unknown): LogoBriefData {
  const d = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    name: strVal(d.name), major: strVal(d.major), product: strVal(d.product),
    nameLength: strVal(d.nameLength), favoriteColor: strVal(d.favoriteColor),
    adjectives: strVal(d.adjectives), nickname: strVal(d.nickname),
    emphasis: strVal(d.emphasis),
  };
}

export function normalizeSubmission(raw: unknown, participantId: string): ParticipantSubmission {
  const defaults = createDefaultSubmission(participantId);
  if (!raw || typeof raw !== 'object') return defaults;
  const d = raw as Record<string, unknown>;

  const cm = (d.commonMissions && typeof d.commonMissions === 'object'
    ? d.commonMissions : {}) as Record<string, unknown>;
  const wm = (d.weeklyMissions && typeof d.weeklyMissions === 'object'
    ? d.weeklyMissions : {}) as Record<string, unknown>;
  const cw = (d.completedWeeks && typeof d.completedWeeks === 'object'
    ? d.completedWeeks : {}) as Record<string, unknown>;

  const w2 = (wm.week2 && typeof wm.week2 === 'object' ? wm.week2 : {}) as Record<string, unknown>;
  const w3 = (wm.week3 && typeof wm.week3 === 'object' ? wm.week3 : {}) as Record<string, unknown>;
  const w4 = (wm.week4 && typeof wm.week4 === 'object' ? wm.week4 : {}) as Record<string, unknown>;
  const w1 = (wm.week1 && typeof wm.week1 === 'object' ? wm.week1 : {}) as Record<string, unknown>;
  const wf = (wm.final && typeof wm.final === 'object' ? wm.final : {}) as Record<string, unknown>;

  const rawProblems = w3.customerProblems;
  const customerProblems: string[] = Array.isArray(rawProblems)
    ? Array.from({ length: 10 }, (_, i) => strVal(rawProblems[i]))
    : Array(10).fill('');

  return {
    participantId,
    commonMissions: {
      week1: mergeCommonWeek(cm.week1),
      week2: mergeCommonWeek(cm.week2),
      week3: mergeCommonWeek(cm.week3),
      week4: mergeCommonWeek(cm.week4),
    },
    weeklyMissions: {
      week1: { currentIntro: strVal(w1.currentIntro) },
      week2: {
        targetCustomer: strVal(w2.targetCustomer),
        oneSentenceBrand: strVal(w2.oneSentenceBrand),
        feature1: strVal(w2.feature1),
        feature2: strVal(w2.feature2),
        feature3: strVal(w2.feature3),
        logoBrief: mergeLogoBrief(w2.logoBrief),
      },
      week3: {
        customerProblems,
        selectedProblem: strVal(w3.selectedProblem),
        selfPitchScript: strVal(w3.selfPitchScript),
        recordingDone: boolVal(w3.recordingDone),
        recordingNote: strVal(w3.recordingNote),
      },
      week4: {
        career: strVal(w4.career), certification: strVal(w4.certification),
        education: strVal(w4.education), performances: strVal(w4.performances),
        awards: strVal(w4.awards), studentResults: strVal(w4.studentResults),
        reviews: strVal(w4.reviews), customerCases: strVal(w4.customerCases),
        works: strVal(w4.works), measurableResults: strVal(w4.measurableResults),
        missingEvidence1: strVal(w4.missingEvidence1),
        missingEvidence2: strVal(w4.missingEvidence2),
        missingEvidence3: strVal(w4.missingEvidence3),
      },
      final: { finalIntro: strVal(wf.finalIntro) },
    },
    completedWeeks: {
      week1: boolVal(cw.week1), week2: boolVal(cw.week2),
      week3: boolVal(cw.week3), week4: boolVal(cw.week4),
    },
    updatedAt: strVal(d.updatedAt),
  };
}

// ─────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────
function storageKey(participantId: string): string {
  return `brandingBootcampProgress:${participantId}`;
}

export function loadSubmission(participantId: string): ParticipantSubmission {
  if (typeof window === 'undefined') return createDefaultSubmission(participantId);
  try {
    const raw = localStorage.getItem(storageKey(participantId));
    if (!raw) return createDefaultSubmission(participantId);
    return normalizeSubmission(JSON.parse(raw), participantId);
  } catch {
    return createDefaultSubmission(participantId);
  }
}

export function saveSubmission(submission: ParticipantSubmission): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave = { ...submission, updatedAt: new Date().toISOString() };
    localStorage.setItem(storageKey(submission.participantId), JSON.stringify(toSave));
  } catch {
    // storage full
  }
}

export interface AllProgressData {
  participants: Participant[];
  submissions: Record<string, ParticipantSubmission>;
}

export function loadAllProgress(): AllProgressData {
  const submissions: Record<string, ParticipantSubmission> = {};
  if (typeof window !== 'undefined') {
    for (const p of MOCK_PARTICIPANTS) {
      submissions[p.id] = loadSubmission(p.id);
    }
  }
  return { participants: MOCK_PARTICIPANTS, submissions };
}

// ─────────────────────────────────────────────
// 진행률 계산
// ─────────────────────────────────────────────
export function calcFlameCount(completedWeeks: CompletedWeeks): number {
  return Object.values(completedWeeks).filter(Boolean).length;
}

// ─────────────────────────────────────────────
// 날짜 / 카운트다운 (클라이언트 전용으로 사용)
// ─────────────────────────────────────────────
export function safeParseDate(dateStr: string): Date | null {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export function isWeekReleased(week: WeekData): boolean {
  if (TEST_MODE) return true; // 테스트 모드: 전체 주차 즉시 공개
  const releaseDate = safeParseDate(week.releaseDate);
  if (!releaseDate) return false;
  return new Date() >= releaseDate;
}

export function getNextLectureDate(): Date | null {
  const now = new Date();
  for (const week of WEEKS) {
    const d = safeParseDate(week.lectureDate);
    if (d && d > now) return d;
  }
  return null;
}

export function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return '강의 시작!';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return days > 0 ? `D-${days}  ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

// ─────────────────────────────────────────────
// 복사 텍스트 생성
// ─────────────────────────────────────────────
export function generateCommonMissionText(
  weekLabel: string,
  data: CommonMissionWeekData
): string {
  const lines: string[] = [`[${weekLabel} 비즈니스 점검표]\n`];
  for (const q of COMMON_MISSION_QUESTIONS) {
    lines.push(`${q.number} ${q.question}`);
    lines.push(q.sub);
    lines.push(`→ ${data[q.id] || '(미작성)'}`);
    lines.push('');
  }
  return lines.join('\n');
}

export function generateLogoPrompt(logoBrief: LogoBriefData): string {
  return `아래 정보를 바탕으로 음악인 개인 브랜드 로고 콘셉트를 5개 제안해주세요.
각 콘셉트마다 브랜드명, 로고 방향, 컬러 팔레트, 폰트 분위기, 심볼 아이디어, 인스타 프로필 적용 문구까지 제안해주세요.

이름: ${logoBrief.name || '(미입력)'}
전공: ${logoBrief.major || '(미입력)'}
판매 상품: ${logoBrief.product || '(미입력)'}
원하는 이름 글자수: ${logoBrief.nameLength || '(미입력)'}
좋아하는 색상: ${logoBrief.favoriteColor || '(미입력)'}
표현 형용사: ${logoBrief.adjectives || '(미입력)'}
자주 듣는 별명: ${logoBrief.nickname || '(미입력)'}
내세우고 싶은 점: ${logoBrief.emphasis || '(미입력)'}`;
}

// ─────────────────────────────────────────────
// 클립보드 복사 유틸
// ─────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // fallback
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}
