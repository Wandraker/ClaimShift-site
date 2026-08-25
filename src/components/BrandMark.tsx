export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-hidden="true">
      <span className="brand-mark__back" />
      <span className="brand-mark__front" />
    </span>
  );
}
