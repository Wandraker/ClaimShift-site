import { Languages } from "lucide-react";
import { useLanguage } from "../i18n";

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`language-switch${compact ? " language-switch--compact" : ""}`} aria-label="Language selector">
      {!compact && <Languages size={15} />}
      <button className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} type="button">EN</button>
      <span>/</span>
      <button className={language === "ru" ? "is-active" : ""} onClick={() => setLanguage("ru")} type="button">RU</button>
    </div>
  );
}
