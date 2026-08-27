import { ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n";

const states = {
  en: [
    { key: "open", label: "OPEN", note: "raid window" },
    { key: "grace", label: "GRACE", note: "delay running" },
    { key: "protected", label: "PROTECTED", note: "claim locked" },
  ],
  ru: [
    { key: "open", label: "OPEN", note: "окно рейда" },
    { key: "grace", label: "GRACE", note: "идёт задержка" },
    { key: "protected", label: "PROTECTED", note: "защита активна" },
  ],
} as const;

export function StateFlow() {
  const { language } = useLanguage();
  const current = states[language];

  return (
    <div className="state-flow" aria-label="ClaimShift state flow">
      {current.map((state, index) => (
        <div className="state-flow__part" key={state.key}>
          <div className={`state-pill state-pill--${state.key}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{state.label}</strong>
            <small>{state.note}</small>
          </div>
          {index < current.length - 1 && <ArrowRight className="state-flow__arrow" size={18} />}
        </div>
      ))}
    </div>
  );
}
