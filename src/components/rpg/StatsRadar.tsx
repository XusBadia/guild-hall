import type { AgentStats } from "../../data/agents";
import { STAT_LABELS, STAT_KEYS } from "../../data/agents";

interface StatsRadarProps {
  stats: AgentStats;
  size?: number;
}

export default function StatsRadar({ stats, size = 160 }: StatsRadarProps) {
  const center = size / 2;
  const maxRadius = size * 0.38;
  const labelRadius = size * 0.47;
  const numAxes = STAT_KEYS.length;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2; // Start from top

  // Generate points for each stat value
  const getPoint = (index: number, value: number): [number, number] => {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * maxRadius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  // Generate polygon for grid lines
  const getGridPolygon = (scale: number): string => {
    return STAT_KEYS
      .map((_, i) => {
        const [x, y] = getPoint(i, scale * 10);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Data polygon
  const dataPoints = STAT_KEYS.map((key, i) => getPoint(i, stats[key]));
  const dataPolygon = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circles/grid */}
      {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
        <polygon
          key={scale}
          points={getGridPolygon(scale)}
          fill="none"
          stroke="var(--gh-border)"
          strokeWidth="0.5"
          opacity={scale === 1 ? 0.6 : 0.3}
        />
      ))}

      {/* Axis lines */}
      {STAT_KEYS.map((_, i) => {
        const [x, y] = getPoint(i, 10);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="var(--gh-border)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}

      {/* Data polygon — fill */}
      <polygon
        points={dataPolygon}
        fill="rgba(52, 211, 153, 0.15)"
        stroke="#34d399"
        strokeWidth="1.5"
      />

      {/* Data dots */}
      {dataPoints.map(([x, y], i) => (
        <circle
          key={`dot-${i}`}
          cx={x}
          cy={y}
          r="3"
          fill="#34d399"
          stroke="var(--gh-bg-deep)"
          strokeWidth="1"
        />
      ))}

      {/* Labels */}
      {STAT_KEYS.map((key, i) => {
        const angle = startAngle + i * angleStep;
        const lx = center + labelRadius * Math.cos(angle);
        const ly = center + labelRadius * Math.sin(angle);
        const val = stats[key];
        const color = val >= 9 ? "#fbbf24" : val >= 7 ? "#34d399" : "#94a3b8";

        return (
          <text
            key={`label-${i}`}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Press Start 2P', monospace"
            fontSize="6"
            fill={color}
          >
            {STAT_LABELS[key]}
          </text>
        );
      })}
    </svg>
  );
}
