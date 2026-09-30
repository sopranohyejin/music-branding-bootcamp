'use client';

interface FlameProgressProps {
  count: number;          // 완료된 주차 수
  releasedCount?: number; // 공개된 주차 수
  total?: number;
  size?: 'sm' | 'md' | 'lg';
}

// 5각형 별 SVG 컴포넌트
function StarIcon({ size, state }: {
  size: number;
  state: 'completed' | 'active' | 'locked';
}) {
  // 완료: 크림 옐로우 채움  |  활성: 네이비 bg + 크림 테두리  |  잠금: 흐릿한 별
  const fillColor =
    state === 'completed' ? '#FFE56D' :
    state === 'active'    ? 'rgba(8,34,74,0.5)' :
                            'rgba(255,255,255,0.06)';
  const strokeColor =
    state === 'completed' ? '#E6C948' :
    state === 'active'    ? 'rgba(255,242,168,0.55)' :
                            'rgba(255,255,255,0.12)';
  const strokeWidth = state === 'locked' ? 1 : 1.5;

  // 5-pointed star polygon (normalized viewBox 0 0 24 24, center 12,12, r=10 outer, r=4 inner)
  const points = (() => {
    const cx = 12, cy = 12, outerR = 10, innerR = 4;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(' ');
  })();

  // subtle shimmer only for completed
  const filter = state === 'completed'
    ? 'drop-shadow(0 0 4px rgba(255,229,109,0.6))'
    : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      style={{ filter, transition: 'all 0.3s ease' }}
    >
      <polygon points={points} />
    </svg>
  );
}

export default function FlameProgress({
  count,
  releasedCount = 0,
  total = 4,
  size = 'md',
}: FlameProgressProps) {
  const sizePx = { sm: 28, md: 36, lg: 44 }[size];

  function getState(i: number): 'completed' | 'active' | 'locked' {
    if (i < count) return 'completed';
    if (i < releasedCount) return 'active';
    return 'locked';
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            title={
              getState(i) === 'completed' ? `${i + 1}주차 완료` :
              getState(i) === 'active'    ? `${i + 1}주차 진행 중` :
                                            `${i + 1}주차 미공개`
            }
            style={{
              transform: getState(i) === 'completed' ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <StarIcon size={sizePx} state={getState(i)} />
          </div>
        ))}
      </div>
      <p className="text-xs uppercase tracking-widest" style={{ color: '#4A6080' }}>
        미션 도장
      </p>
    </div>
  );
}
