import { supabase } from './supabaseClient';
import {
  ParticipantSubmission,
  normalizeSubmission,
  createDefaultSubmission,
} from './brandingBootcamp';

// ─────────────────────────────────────────────────────────────
// DB 타입
// ─────────────────────────────────────────────────────────────

export interface DbParticipant {
  id: string;           // uuid
  name: string;
  phone_last4: string;
  participant_key: string;
  created_at: string;
  updated_at: string;
}

interface DbSubmission {
  id: string;
  participant_id: string;
  common_missions: unknown;
  weekly_missions: unknown;
  completed_weeks: unknown;
  final_mission: unknown;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// 프로젝트/기수 타입
// ─────────────────────────────────────────────────────────────

export interface DbProject {
  id: string;
  title: string;
  slug: string;
  status: string; // 'active' | 'upcoming' | 'ended'
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

/** 현재 활성 프로젝트 조회 (getOrCreateParticipant 내부 사용) */
export async function getActiveProject(): Promise<DbProject | null> {
  const { data, error } = await supabase
    .from('branding_projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('[Bootcamp] getActiveProject 실패:', error);
    throw error;
  }
  return data as DbProject | null;
}

// ─────────────────────────────────────────────────────────────
// participant_key 생성 (이름 + 휴대폰 뒤 4자리)
// ─────────────────────────────────────────────────────────────

export function makeParticipantKey(name: string, phoneLast4: string): string {
  // 공백 제거 + 소문자 정규화 → 같은 사람이 다시 입력해도 동일 키
  const normalizedName = name.trim().replace(/\s+/g, '').toLowerCase();
  return `${normalizedName}_${phoneLast4.trim()}`;
}

// ─────────────────────────────────────────────────────────────
// DB row → ParticipantSubmission 변환
// ─────────────────────────────────────────────────────────────

function dbRowToSubmission(row: DbSubmission): ParticipantSubmission {
  const wm =
    row.weekly_missions && typeof row.weekly_missions === 'object'
      ? (row.weekly_missions as Record<string, unknown>)
      : {};
  const fm =
    row.final_mission && typeof row.final_mission === 'object'
      ? (row.final_mission as Record<string, unknown>)
      : {};

  return normalizeSubmission(
    {
      participantId: row.participant_id,
      commonMissions: row.common_missions,
      weeklyMissions: { ...wm, final: fm },
      completedWeeks: row.completed_weeks,
      updatedAt: row.updated_at,
    },
    row.participant_id,
  );
}

// ─────────────────────────────────────────────────────────────
// 참가자 생성 or 조회
// ─────────────────────────────────────────────────────────────

export async function getOrCreateParticipant(
  name: string,
  phoneLast4: string,
): Promise<DbParticipant> {
  const key = makeParticipantKey(name, phoneLast4);

  // 1. 기존 참가자 조회 (project_id 유지를 위해 upsert 대신 SELECT 먼저)
  const { data: existing, error: selErr } = await supabase
    .from('branding_participants')
    .select('*')
    .eq('participant_key', key)
    .maybeSingle();

  if (selErr) {
    console.error('[Bootcamp] getOrCreateParticipant - select 실패:', selErr);
    throw selErr;
  }
  if (existing) return existing as DbParticipant;

  // 2. 신규 참가자: 활성 프로젝트 ID 조회
  let projectId: string | null = null;
  try {
    const activeProject = await getActiveProject();
    projectId = activeProject?.id ?? null;
  } catch {
    // 프로젝트 조회 실패 시 null로 진행
  }

  // 3. 새 참가자 생성
  const { data, error } = await supabase
    .from('branding_participants')
    .insert({
      name: name.trim(),
      phone_last4: phoneLast4.trim(),
      participant_key: key,
      project_id: projectId,
    })
    .select()
    .single();

  if (error) {
    // 동시 삽입 경합 시 기존 row 재조회
    if (error.code === '23505') {
      const { data: retry, error: retryErr } = await supabase
        .from('branding_participants')
        .select('*')
        .eq('participant_key', key)
        .single();
      if (retryErr) throw retryErr;
      return retry as DbParticipant;
    }
    console.error('[Bootcamp] getOrCreateParticipant - insert 실패:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
  return data as DbParticipant;
}

// ─────────────────────────────────────────────────────────────
// submission 생성 or 조회
// ─────────────────────────────────────────────────────────────

export async function getOrCreateSubmission(
  participantId: string,
): Promise<ParticipantSubmission> {
  // 기존 row 조회
  const { data: existing, error: selectError } = await supabase
    .from('branding_submissions')
    .select('*')
    .eq('participant_id', participantId)
    .maybeSingle();

  if (selectError) {
    console.error('[Bootcamp] getOrCreateSubmission - select 실패:', {
      message: selectError.message,
      code: selectError.code,
      details: selectError.details,
      hint: selectError.hint,
    });
    throw selectError;
  }

  if (existing) return dbRowToSubmission(existing as DbSubmission);

  // 없으면 기본값으로 생성
  const defaults = createDefaultSubmission(participantId);
  const { data: created, error: insertError } = await supabase
    .from('branding_submissions')
    .insert({
      participant_id: participantId,
      common_missions: defaults.commonMissions,
      weekly_missions: {
        week1: defaults.weeklyMissions.week1,
        week2: defaults.weeklyMissions.week2,
        week3: defaults.weeklyMissions.week3,
        week4: defaults.weeklyMissions.week4,
      },
      completed_weeks: defaults.completedWeeks,
      final_mission: defaults.weeklyMissions.final,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[Bootcamp] getOrCreateSubmission - insert 실패:', {
      message: insertError.message,
      code: insertError.code,
      details: insertError.details,
      hint: insertError.hint,
    });
    throw insertError;
  }
  return dbRowToSubmission(created as DbSubmission);
}

// ─────────────────────────────────────────────────────────────
// submission 저장 (upsert)
// ─────────────────────────────────────────────────────────────

export async function upsertSubmission(
  participantId: string,
  submission: ParticipantSubmission,
): Promise<void> {
  const { error } = await supabase
    .from('branding_submissions')
    .upsert(
      {
        participant_id: participantId,
        common_missions: submission.commonMissions,
        weekly_missions: {
          week1: submission.weeklyMissions.week1,
          week2: submission.weeklyMissions.week2,
          week3: submission.weeklyMissions.week3,
          week4: submission.weeklyMissions.week4,
        },
        completed_weeks: submission.completedWeeks,
        final_mission: submission.weeklyMissions.final,
      },
      { onConflict: 'participant_id' },
    );

  if (error) {
    console.error('[Bootcamp] upsertSubmission 실패:', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// 관리자: completed_weeks 만 업데이트
// ─────────────────────────────────────────────────────────────

export async function updateCompletedWeeks(
  participantId: string,
  completedWeeks: Record<string, boolean>,
): Promise<void> {
  const { error } = await supabase
    .from('branding_submissions')
    .update({ completed_weeks: completedWeeks })
    .eq('participant_id', participantId);

  if (error) {
    console.error('[Bootcamp] updateCompletedWeeks 실패:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// 관리자: 전체 참가자 + submission 조회
// ─────────────────────────────────────────────────────────────

export interface AdminParticipantRow {
  participantDbId: string;
  name: string;
  phoneLast4: string;
  participantKey: string;
  createdAt: string;
  updatedAt: string;
  submission: ParticipantSubmission;
}

// ─────────────────────────────────────────────────────────────
// 프로젝트/기수 추가 함수 (DbProject, getActiveProject는 파일 상단 정의)
// ─────────────────────────────────────────────────────────────

/** 모든 프로젝트/기수 조회 (최신순) */
export async function loadProjects(): Promise<DbProject[]> {
  const { data, error } = await supabase
    .from('branding_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[Bootcamp] loadProjects 실패:', error);
    throw error;
  }
  return (data || []) as DbProject[];
}

/** 프로젝트별 참가자 수 조회 */
export async function loadParticipantCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('branding_participants')
    .select('project_id');
  if (error) return {};
  const counts: Record<string, number> = {};
  (data || []).forEach((row: { project_id: string | null }) => {
    if (row.project_id) {
      counts[row.project_id] = (counts[row.project_id] ?? 0) + 1;
    }
  });
  return counts;
}

/** 프로젝트별 참가자 + submission 조회 */
export async function loadAdminDataByProject(projectId: string): Promise<AdminParticipantRow[]> {
  const { data: participants, error: pErr } = await supabase
    .from('branding_participants')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (pErr) {
    console.error('[Bootcamp] loadAdminDataByProject - participants 조회 실패:', pErr);
    throw pErr;
  }

  if (!participants || participants.length === 0) return [];

  const participantIds = (participants as DbParticipant[]).map((p) => p.id);
  const { data: submissions, error: sErr } = await supabase
    .from('branding_submissions')
    .select('*')
    .in('participant_id', participantIds);

  if (sErr) {
    console.error('[Bootcamp] loadAdminDataByProject - submissions 조회 실패:', sErr);
    throw sErr;
  }

  const submissionMap = new Map(
    (submissions as DbSubmission[]).map((s) => [s.participant_id, s]),
  );

  return (participants as DbParticipant[]).map((p) => {
    const subRow = submissionMap.get(p.id);
    return {
      participantDbId: p.id,
      name: p.name,
      phoneLast4: p.phone_last4,
      participantKey: p.participant_key,
      createdAt: p.created_at,
      updatedAt: subRow?.updated_at ?? p.created_at,
      submission: subRow
        ? dbRowToSubmission(subRow)
        : createDefaultSubmission(p.id),
    };
  });
}

/** 참가자 + 해당 제출 데이터 삭제 */
export async function deleteParticipant(participantId: string): Promise<void> {
  const { error: sErr } = await supabase
    .from('branding_submissions')
    .delete()
    .eq('participant_id', participantId);
  if (sErr) {
    console.error('[Bootcamp] deleteParticipant - submissions 삭제 실패:', sErr);
    throw sErr;
  }
  const { error: pErr } = await supabase
    .from('branding_participants')
    .delete()
    .eq('id', participantId);
  if (pErr) {
    console.error('[Bootcamp] deleteParticipant - participant 삭제 실패:', pErr);
    throw pErr;
  }
}

// ─────────────────────────────────────────────────────────────
// 관리자: 전체 참가자 + submission 조회 (기존 호환용 유지)
// ─────────────────────────────────────────────────────────────
export async function loadAdminData(): Promise<AdminParticipantRow[]> {
  const { data: participants, error: pErr } = await supabase
    .from('branding_participants')
    .select('*')
    .order('created_at', { ascending: true });

  if (pErr) {
    console.error('[Bootcamp] loadAdminData - participants 조회 실패:', {
      message: pErr.message,
      code: pErr.code,
      details: pErr.details,
      hint: pErr.hint,
    });
    throw pErr;
  }

  const { data: submissions, error: sErr } = await supabase
    .from('branding_submissions')
    .select('*');

  if (sErr) {
    console.error('[Bootcamp] loadAdminData - submissions 조회 실패:', {
      message: sErr.message,
      code: sErr.code,
      details: sErr.details,
      hint: sErr.hint,
    });
    throw sErr;
  }

  const submissionMap = new Map(
    (submissions as DbSubmission[]).map((s) => [s.participant_id, s]),
  );

  return (participants as DbParticipant[]).map((p) => {
    const subRow = submissionMap.get(p.id);
    return {
      participantDbId: p.id,
      name: p.name,
      phoneLast4: p.phone_last4,
      participantKey: p.participant_key,
      createdAt: p.created_at,
      updatedAt: subRow?.updated_at ?? p.created_at,
      submission: subRow
        ? dbRowToSubmission(subRow)
        : createDefaultSubmission(p.id),
    };
  });
}
