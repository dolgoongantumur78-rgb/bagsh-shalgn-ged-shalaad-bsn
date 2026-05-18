interface Props {
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

const TRAITS = [
  { key: "openness",          label: "Нээлттэй",     short: "O", color: "#4B7BF5" },
  { key: "conscientiousness", label: "Хариуцлага",   short: "C", color: "#059669" },
  { key: "extraversion",      label: "Нийгэмшил",    short: "E", color: "#EA580C" },
  { key: "agreeableness",     label: "Нийцтэй",      short: "A", color: "#0284C7" },
  { key: "neuroticism",       label: "Сэтгэл хөдлөл",short: "N", color: "#9333EA" },
] as const;

const CX = 130, CY = 130, R = 95;
const N = TRAITS.length;

function point(i: number, pct: number): [number, number] {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / N;
  return [
    CX + (pct / 100) * R * Math.cos(angle),
    CY + (pct / 100) * R * Math.sin(angle),
  ];
}

function labelPoint(i: number): [number, number] {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / N;
  const dist = R + 22;
  return [CX + dist * Math.cos(angle), CY + dist * Math.sin(angle)];
}

export default function OceanRadar({ scores }: Props) {
  const vals = TRAITS.map((t) => scores[t.key]);

  // Grid rings at 25%, 50%, 75%, 100%
  const rings = [25, 50, 75, 100];

  // Polygon path for the score area
  const polyPoints = TRAITS.map((_, i) => point(i, vals[i]).join(",")).join(" ");

  // Axis lines from center to each vertex
  const axes = TRAITS.map((_, i) => {
    const [x, y] = point(i, 100);
    return { x, y };
  });

  // Grid ring polygons
  const ringPolys = rings.map((pct) =>
    TRAITS.map((_, i) => point(i, pct).join(",")).join(" ")
  );

  return (
    <div className="rounded-2xl p-5 border" style={{ background: "#F9FAFB", borderColor: "#E2E7EF" }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "#6B7280" }}>
        OCEAN Radar — зан чанарын зураглал
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Chart */}
        <svg width={260} height={260} viewBox="0 0 260 260" className="shrink-0">
          {/* Grid rings */}
          {ringPolys.map((pts, ri) => (
            <polygon
              key={ri}
              points={pts}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={ri === 3 ? 1.5 : 1}
              strokeDasharray={ri < 3 ? "4 3" : "none"}
            />
          ))}

          {/* % labels on top axis */}
          {rings.slice(0, 3).map((pct) => {
            const [x, y] = point(0, pct);
            return (
              <text key={pct} x={x + 4} y={y} fontSize={8} fill="#9CA3AF" dominantBaseline="middle">
                {pct}
              </text>
            );
          })}

          {/* Axis lines */}
          {axes.map(({ x, y }, i) => (
            <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#E5E7EB" strokeWidth={1} />
          ))}

          {/* Score polygon — filled */}
          <polygon
            points={polyPoints}
            fill="rgba(75,123,245,0.15)"
            stroke="#4B7BF5"
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* Score dots */}
          {TRAITS.map((t, i) => {
            const [x, y] = point(i, vals[i]);
            return (
              <circle key={i} cx={x} cy={y} r={4} fill={t.color} stroke="#fff" strokeWidth={1.5} />
            );
          })}

          {/* Labels */}
          {TRAITS.map((t, i) => {
            const [lx, ly] = labelPoint(i);
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                fontSize={9}
                fontWeight="700"
                fill={t.color}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {t.short}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full">
          {TRAITS.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="text-[10px] flex-1" style={{ color: "#6B7280" }}>{t.label}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${vals[i]}%`, background: t.color }}
                />
              </div>
              <span className="text-[10px] font-bold w-7 text-right" style={{ color: t.color }}>{vals[i]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
