'use client';

const STEPS = [
  {
    key: '각인',
    desc: '사람들이 나를 알게 만든다.',
    icon: '👁',
  },
  {
    key: '가치',
    desc: '"나에게 필요한 사람이네"라고 느끼게 한다.',
    icon: '💎',
  },
  {
    key: '신용',
    desc: '"이 사람이라면 믿고 맡겨도 되겠다"가 쌓인다.',
    icon: '🏆',
  },
  {
    key: '선택',
    desc: '고객이 나를 선택한다.',
    icon: '✅',
  },
  {
    key: '매출',
    desc: '선택이 실제 거래로 이어진다. 재구매/소개.',
    icon: '💰',
  },
];

export default function BrandingFormula() {
  return (
    <section style={{ background: '#04152D' }} className="text-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: '#FFF2A8' }}
        >
          헬퍼지니 브랜딩 공식
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          각인 → 가치 → 신용 → 선택 → 매출
        </h2>
        <p className="text-sm mb-10 leading-relaxed" style={{ color: '#B8C5D9' }}>
          단순한 "인스타 잘하는 법 / 자기소개 잘하는 법"이 아닌 이유입니다.
        </p>

        {/* Desktop: 5칸 동일 너비 grid */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-0">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="contents">
              <div
                className="rounded-xl px-5 py-5 flex flex-col items-start justify-start min-h-[120px] transition-colors"
                style={{
                  background: 'rgba(255,242,168,0.04)',
                  border: '1px solid rgba(230,210,122,0.18)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,242,168,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,242,168,0.04)';
                }}
              >
                <p className="text-xl mb-2">{step.icon}</p>
                <p className="font-bold mb-1.5 text-base" style={{ color: '#F3D96B' }}>{step.key}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#B8C5D9' }}>{step.desc}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className="flex items-center justify-center px-1.5 text-lg flex-shrink-0 min-h-[120px]"
                  style={{ color: '#E6D27A' }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col gap-3">
          {STEPS.map((step, idx) => (
            <div key={step.key}>
              <div
                className="rounded-xl p-5 flex items-start gap-4"
                style={{
                  background: 'rgba(255,242,168,0.04)',
                  border: '1px solid rgba(230,210,122,0.18)',
                }}
              >
                <p className="text-2xl flex-shrink-0">{step.icon}</p>
                <div>
                  <p className="font-bold mb-1 text-base" style={{ color: '#F3D96B' }}>{step.key}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#B8C5D9' }}>{step.desc}</p>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="text-center py-1" style={{ color: '#E6D27A' }}>↓</div>
              )}
            </div>
          ))}
        </div>

        {/* 순환 구조 */}
        <div
          className="mt-8 rounded-xl p-5"
          style={{
            background: 'rgba(255,242,168,0.06)',
            border: '1px solid rgba(230,210,122,0.25)',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#F3D96B' }}>순환 구조</p>
          <p className="text-sm" style={{ color: '#B8C5D9' }}>
            매출 → 가치 제공 → 신용 축적 → 재구매·소개
          </p>
        </div>

        <p
          className="mt-8 text-sm leading-relaxed pt-8"
          style={{ color: '#6B7280', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          음악가가 자기 실력을 상품으로 연결하고, 고객을 이해하고,
          선택받는 구조를 만드는{' '}
          <strong className="text-white">비즈니스 사고 훈련</strong>입니다.
        </p>
      </div>
    </section>
  );
}
