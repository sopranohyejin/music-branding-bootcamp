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

  // upsert: participant_key 중복 시 name/phone_last4 업데이트 후 반환
  const { data, error } = await supabase
    .from('branding_participants')
    .upsert(
      { name: name.trim(), phone_last4: phoneLast4.trim(), participant_key: key },
      { onConflict: 'participant_key' },
    )
    .select()
    .single();

  if (error) {
    console.error('[Bootcamp] getOrCreateParticipant 실패:', {
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
