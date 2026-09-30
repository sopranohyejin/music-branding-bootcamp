import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────
// 환경변수
// Vercel 배포 시에도 아래 변수를 반드시 Project Settings > Environment Variables에 추가하세요.
//
// NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// NEXT_PUBLIC_BOOTCAMP_ADMIN_CODE=관리자코드
// NEXT_PUBLIC_BOOTCAMP_SECRET_CODE=jiny-MU9K-406   ← 수강생 입장 비밀코드 (대소문자 구분)
// ─────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ─────────────────────────────────────────────────────────────
// 설정 유효성 검사
// null 반환 = 정상 / string 반환 = 오류 메시지
// ─────────────────────────────────────────────────────────────
export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl) {
    console.error('[Bootcamp] Missing NEXT_PUBLIC_SUPABASE_URL – .env.local을 확인하세요.');
    return 'NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.';
  }
  if (!supabaseAnonKey) {
    console.error('[Bootcamp] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY – .env.local을 확인하세요.');
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.';
  }
  // URL에 비ASCII 문자(한국어 등 플레이스홀더) 포함 여부 확인
  if (/[^\x00-\x7F]/.test(supabaseUrl)) {
    console.error('[Bootcamp] NEXT_PUBLIC_SUPABASE_URL에 유효하지 않은 문자가 포함됨:', supabaseUrl);
    return 'NEXT_PUBLIC_SUPABASE_URL을 실제 Supabase 프로젝트 URL로 교체해주세요.';
  }
  // Supabase anon key는 JWT(eyJ...) 또는 새 publishable key(sb_publishable_...) 형식
  if (!supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_publishable_')) {
    console.error('[Bootcamp] NEXT_PUBLIC_SUPABASE_ANON_KEY 형식이 올바르지 않음:', supabaseAnonKey.slice(0, 20));
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY를 실제 Supabase anon 키로 교체해주세요.';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 클라이언트 (모듈 레벨에서 1회 생성)
// ─────────────────────────────────────────────────────────────
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
);
