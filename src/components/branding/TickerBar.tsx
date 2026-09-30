'use client';

const TICKER_ITEMS = [
  { label: '1주차 · 10/06 화 밤 9시', content: '브랜딩 전략 이해 / 음악가 → 사업가 사고전환' },
  { label: '별도 미션', content: '현재 자기소개 작성' },
  { label: '공통 미션', content: '비즈니스 점검표 1차 작성' },
  { label: '2주차 · 10/13 화 밤 9시', content: '각인: 노출 + 특징' },
  { label: '별도 미션', content: '나를 기억시키는 한 문장 + 로고 만들기' },
  { label: '공통 미션', content: '비즈니스 점검표 2차 작성' },
  { label: '3주차 · 10/20 화 밤 9시', content: '가치 + 셀프 스피치: 고객 중심 사고' },
  { label: '별도 미션', content: '고객 문제 10개 + 30초 셀프 스피치 녹음' },
  { label: '공통 미션', content: '비즈니스 점검표 3차 작성' },
  { label: '4주차 · 10/27 화 밤 9시', content: '신용: 신뢰를 자산으로 만드는 법' },
  { label: '별도 미션', content: '나의 신용 자산 리스트 작성' },
  { label: '공통 미션', content: '비즈니스 점검표 4차 작성' },
  { label: '졸업 과제', content: '4주 답변으로 최종 자기소개 완성' },
  { label: '완료 조건', content: '카톡 인증 → 완료 버튼 클릭 → 성장 배지 활성화' },
];

const DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function TickerBar() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: '52px',
        background: '#020B1A',
        borderBottom: '1px solid rgba(230,210,122,0.35)',
        borderTop: '1px solid rgba(230,210,122,0.15)',
      }}
      aria-hidden="true"
    >
      <div className="relative h-full">
        {/* Fade overlays */}
        <div
          className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #020B1A, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #020B1A, transparent)' }}
        />

        <div className="ticker-inner h-full">
          {DOUBLED.map((item, idx) => (
            <span key={idx} className="flex items-center gap-0 whitespace-nowrap">
              {/* 구분 다이아몬드 */}
              <span
                className="mx-4"
                style={{ color: 'rgba(230,210,122,0.6)', fontSize: '10px' }}
              >
                ◆
              </span>
              {/* 라벨 chip */}
              <span
                className="mr-2.5 px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase"
                style={{
                  fontSize: '10px',
                  color: '#07152F',
                  background: '#FFF2A8',
                  border: '1px solid rgba(230,210,122,0.8)',
                }}
              >
                {item.label}
              </span>
              {/* 내용 */}
              <span
                className="font-medium"
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.92)' }}
              >
                {item.content}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
