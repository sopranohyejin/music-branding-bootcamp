'use client';

import { STRUCTURE_TABLE } from '@/lib/brandingBootcamp';

export default function BootcampStructureTable() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-xl font-bold mb-2" style={{ color: '#07152F' }}>음악인 브랜딩 부트캠프 미션</h2>
      <p className="text-sm text-[#6B7280] mb-6">4주 동안 아래 미션을 순서대로 진행합니다.</p>

      {/* Desktop table */}
      <div
        className="hidden md:block overflow-x-auto rounded-2xl"
        style={{
          border: '1px solid #EFE4B0',
          boxShadow: '12px 14px 0 rgba(10,20,50,0.08), 0 8px 28px rgba(10,20,50,0.13)',
        }}
      >
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr style={{ background: '#08224A', color: '#ffffff' }}>
              <th className="px-4 py-4 text-left font-semibold w-14">주차</th>
              <th className="px-4 py-4 text-left font-semibold w-28">일정</th>
              <th className="px-4 py-4 text-left font-semibold">강의</th>
              <th className="px-4 py-4 text-left font-semibold">별도 미션</th>
              <th className="px-4 py-4 text-left font-semibold">공통 미션</th>
            </tr>
          </thead>
          <tbody>
            {STRUCTURE_TABLE.map((row, idx) => (
              <tr
                key={row.week}
                style={{
                  borderTop: '1px solid #EFE4B0',
                  background:
                    row.week === '졸업'
                      ? '#FFFBEA'
                      : idx % 2 === 0
                      ? '#ffffff'
                      : '#FEFCF3',
                }}
              >
                <td className="px-4 py-4 font-bold" style={{ color: '#07152F' }}>
                  {row.week === '졸업' ? (
                    <span style={{ color: '#C9A830' }}>🎓 {row.week}</span>
                  ) : (
                    row.week
                  )}
                </td>
                <td className="px-4 py-4 font-medium" style={{ color: '#6B7280' }}>{row.schedule}</td>
                <td className="px-4 py-4 leading-relaxed whitespace-normal font-bold" style={{ color: '#374151' }}>{row.lecture}</td>
                <td className="px-4 py-4 whitespace-normal" style={{ color: '#374151' }}>{row.individualMission}</td>
                <td className="px-4 py-4" style={{ color: '#374151' }}>{row.commonMission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {STRUCTURE_TABLE.map((row) => (
          <div
            key={row.week}
            className="rounded-xl p-5"
            style={{
              border: row.week === '졸업' ? '1px solid rgba(230,210,122,0.5)' : '1px solid #EFE4B0',
              background: row.week === '졸업' ? '#FFFBEA' : '#ffffff',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold" style={{ color: '#07152F' }}>
                {row.week === '졸업'
                  ? <span style={{ color: '#C9A830' }}>🎓 {row.week}</span>
                  : `${row.week}차`}
              </p>
              <p className="text-xs font-medium" style={{ color: '#6B7280' }}>{row.schedule}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <span className="text-[#6B7280] mr-2">강의</span>
                <span className="font-bold" style={{ color: '#374151' }}>{row.lecture}</span>
              </div>
              <div>
                <span className="text-[#6B7280] mr-2">별도 미션</span>
                <span style={{ color: '#374151' }}>{row.individualMission}</span>
              </div>
              <div>
                <span className="text-[#6B7280] mr-2">공통 미션</span>
                <span style={{ color: '#374151' }}>{row.commonMission}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
