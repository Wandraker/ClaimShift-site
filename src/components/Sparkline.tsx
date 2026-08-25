type Point = [number, number];

export function Sparkline({ points }: { points: Point[] }) {
  if (points.length < 2) return <div className="sparkline sparkline--empty" />;

  const values = points.map(([, value]) => value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 520;
  const height = 120;
  const pad = 8;

  const path = points
    .map(([, value], index) => {
      const x = pad + (index / (points.length - 1)) * (width - pad * 2);
      const y = height - pad - ((value - min) / range) * (height - pad * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="sparkline__line" d={path} />
    </svg>
  );
}
