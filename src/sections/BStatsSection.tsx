import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Server, Users } from "lucide-react";
import { BSTATS_PLUGIN_ID, SITE_LINKS } from "../site-config";
import { MetricCard } from "../components/MetricCard";
import { Sparkline } from "../components/Sparkline";
import { useLanguage } from "../i18n";

type Point = [number, number];
type Metrics = { servers: Point[]; players: Point[] };

const lastValue = (points: Point[]) => points.at(-1)?.[1] ?? 0;

const copy = {
  en: {
    eyebrow: "Public usage",
    title: "Anonymous bStats metrics.",
    lead: "ClaimShift reports standard anonymous bStats data and a small set of non-identifying configuration charts. No accounts or private server data are stored by this website.",
    waiting: "Waiting for bStats data",
    waitingText: "The integration is configured. Counters will appear when public bStats data is available.",
    servers: "Servers",
    players: "Players",
    serverDetail: "current reporting servers",
    playerDetail: "players on reporting servers",
    unavailable: "bStats is temporarily unavailable",
    serverChart: "Recent server activity",
    playerChart: "Recent player activity",
  },
  ru: {
    eyebrow: "Публичная статистика",
    title: "Анонимные метрики bStats.",
    lead: "ClaimShift отправляет стандартную анонимную статистику bStats и несколько обезличенных параметров конфигурации. Этот сайт не хранит аккаунты или приватные данные серверов.",
    waiting: "Ожидание данных bStats",
    waitingText: "Интеграция настроена. Счётчики появятся, когда bStats начнёт отдавать публичные данные.",
    servers: "Серверы",
    players: "Игроки",
    serverDetail: "серверов сейчас отправляют статистику",
    playerDetail: "игроков на серверах со статистикой",
    unavailable: "bStats временно недоступен",
    serverChart: "Активность серверов",
    playerChart: "Активность игроков",
  },
} as const;

export function BStatsSection() {
  const { language } = useLanguage();
  const t = copy[language];
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const formatter = useMemo(() => new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US"), [language]);

  useEffect(() => {
    if (!BSTATS_PLUGIN_ID) return;
    const controller = new AbortController();
    setStatus("loading");

    Promise.all([
      fetch(`https://bstats.org/api/v1/plugins/${BSTATS_PLUGIN_ID}/charts/servers/data?maxElements=36`, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("servers metric unavailable");
        return response.json() as Promise<Point[]>;
      }),
      fetch(`https://bstats.org/api/v1/plugins/${BSTATS_PLUGIN_ID}/charts/players/data?maxElements=36`, { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("players metric unavailable");
        return response.json() as Promise<Point[]>;
      }),
    ]).then(([servers, players]) => {
      setMetrics({ servers, players });
      setStatus("ready");
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    });

    return () => controller.abort();
  }, []);

  return (
    <section className="section stats-section" id="stats" data-reveal-group>
      <div className="section-shell">
        <div className="section-head" data-reveal-item>
          <div><p className="eyebrow"><Activity size={15} /> {t.eyebrow}</p><h2>{t.title}</h2></div>
          <p>{t.lead}</p>
        </div>

        {status !== "ready" && (!metrics || status === "error") ? (
          <div className="stats-waiting" data-reveal-item>
            <div><span className="status-dot" /><strong>{status === "error" ? t.unavailable : t.waiting}</strong><p>{t.waitingText}</p></div>
            <a href={SITE_LINKS.bstats} target="_blank" rel="noreferrer">bStats <ArrowUpRight size={15} /></a>
          </div>
        ) : (
          <div className="stats-grid" data-reveal-item>
            <MetricCard label={t.servers} value={metrics ? formatter.format(lastValue(metrics.servers)) : "—"} detail={t.serverDetail} />
            <MetricCard label={t.players} value={metrics ? formatter.format(lastValue(metrics.players)) : "—"} detail={t.playerDetail} />
            <article className="stats-chart"><div><span>{t.serverChart}</span><Server size={18} /></div><Sparkline points={metrics?.servers ?? []} /></article>
            <article className="stats-chart"><div><span>{t.playerChart}</span><Users size={18} /></div><Sparkline points={metrics?.players ?? []} /></article>
          </div>
        )}
      </div>
    </section>
  );
}
