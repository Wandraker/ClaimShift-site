import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Server, Users } from "lucide-react";
import { BSTATS_PLUGIN_ID } from "../site-config";
import { MetricCard } from "../components/MetricCard";
import { Sparkline } from "../components/Sparkline";

type Point = [number, number];

type Metrics = {
  servers: Point[];
  players: Point[];
};

const lastValue = (points: Point[]) => points.at(-1)?.[1] ?? 0;
const formatter = new Intl.NumberFormat("en-US");

export function BStatsSection() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!BSTATS_PLUGIN_ID) return;

    const controller = new AbortController();
    setStatus("loading");

    Promise.all([
      fetch(`https://bstats.org/api/v1/plugins/${BSTATS_PLUGIN_ID}/charts/servers/data?maxElements=36`, {
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("servers metric unavailable");
        return response.json() as Promise<Point[]>;
      }),
      fetch(`https://bstats.org/api/v1/plugins/${BSTATS_PLUGIN_ID}/charts/players/data?maxElements=36`, {
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("players metric unavailable");
        return response.json() as Promise<Point[]>;
      }),
    ])
      .then(([servers, players]) => {
        setMetrics({ servers, players });
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const bstatsUrl = useMemo(
    () => (BSTATS_PLUGIN_ID ? `https://bstats.org/plugin/bukkit/ClaimShift/${BSTATS_PLUGIN_ID}` : "https://bstats.org/"),
    [],
  );

  return (
    <section className="section stats-section" id="stats" data-reveal-group>
      <div className="section-shell">
        <div className="section-head" data-reveal-item>
          <div>
            <p className="eyebrow"><Activity size={15} /> Usage</p>
            <h2>Public metrics, not private telemetry.</h2>
          </div>
          <p>
            ClaimShift can expose aggregated bStats adoption numbers here. No account system is needed on this site.
          </p>
        </div>

        {!BSTATS_PLUGIN_ID ? (
          <div className="stats-waiting" data-reveal-item>
            <div>
              <span className="status-dot" />
              <strong>bStats connection prepared</strong>
              <p>Live server and player counters will appear here as soon as the ClaimShift bStats plugin ID is configured.</p>
            </div>
            <a href={bstatsUrl} target="_blank" rel="noreferrer">bStats <ArrowUpRight size={15} /></a>
          </div>
        ) : (
          <div className="stats-grid" data-reveal-item>
            <MetricCard
              label="Servers"
              value={status === "ready" && metrics ? formatter.format(lastValue(metrics.servers)) : "—"}
              detail={status === "error" ? "bStats is temporarily unavailable" : "current reporting servers"}
            />
            <MetricCard
              label="Players"
              value={status === "ready" && metrics ? formatter.format(lastValue(metrics.players)) : "—"}
              detail={status === "error" ? "bStats is temporarily unavailable" : "players on reporting servers"}
            />
            <article className="stats-chart">
              <div>
                <span>Recent server activity</span>
                <Server size={18} />
              </div>
              <Sparkline points={metrics?.servers ?? []} />
            </article>
            <article className="stats-chart">
              <div>
                <span>Recent player activity</span>
                <Users size={18} />
              </div>
              <Sparkline points={metrics?.players ?? []} />
            </article>
          </div>
        )}
      </div>
    </section>
  );
}
