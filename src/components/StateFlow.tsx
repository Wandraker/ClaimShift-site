import { ArrowRight } from "lucide-react";

const states = [
  { key: "open", label: "OPEN", note: "raid window" },
  { key: "grace", label: "GRACE", note: "delay running" },
  { key: "protected", label: "PROTECTED", note: "claim locked" },
];

export function StateFlow() {
  return (
    <div className="state-flow" aria-label="ClaimShift state flow">
      {states.map((state, index) => (
        <div className="state-flow__part" key={state.key}>
          <div className={`state-pill state-pill--${state.key}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{state.label}</strong>
            <small>{state.note}</small>
          </div>
          {index < states.length - 1 && <ArrowRight className="state-flow__arrow" size={18} />}
        </div>
      ))}
    </div>
  );
}
