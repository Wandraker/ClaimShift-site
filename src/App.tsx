import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Box,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Container,
  Flame,
  Github,
  LockKeyhole,
  Menu,
  PanelsTopLeft,
  Puzzle,
  ServerCog,
  ShieldCheck,
  TimerReset,
  UsersRound,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { StateFlow } from "./components/StateFlow";
import { BStatsSection } from "./sections/BStatsSection";
import { SITE_LINKS } from "./site-config";

const ruleGroups = [
  [Blocks, "Blocks", "Break and place rules"],
  [Container, "Containers", "Inventories and hoppers"],
  [Zap, "Explosions", "TNT and entity explosions"],
  [Box, "Entities", "Damage and interaction"],
  [Waves, "World", "Fluids, fire and pistons"],
  [ShieldCheck, "Boundaries", "Cross-claim automation"],
] as const;

const permissions = [
  ["claimshift.admin", "Administrative command access"],
  ["claimshift.inspect", "Inspect dynamic state at your location"],
  ["claimshift.info", "Read provider and runtime information"],
  ["claimshift.sync", "Request immediate reconciliation"],
  ["claimshift.reload", "Validate and reload configuration"],
  ["claimshift.language", "Change built-in locale settings"],
  ["claimshift.bypass", "Explicit protection bypass"],
] as const;

const commands = [
  "/claimshift info",
  "/claimshift inspect",
  "/claimshift sync",
  "/claimshift reload",
  "/claimshift language <locale>",
] as const;

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function App() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.fromTo(
        "[data-hero]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.fromTo(
          items,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          },
        );
      });

      gsap.to(".hero-orbit--one", {
        y: 24,
        x: -8,
        rotation: 4,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
      });
      gsap.to(".hero-orbit--two", {
        y: -18,
        x: 12,
        rotation: -3,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site" ref={root}>
      <header className="header">
        <a className="brand" href="#top" aria-label="ClaimShift home">
          <BrandMark compact />
          <span>CLAIMSHIFT</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#worldguard">WorldGuard</a>
          <a href="#developers">Developers</a>
          <a href="#stats">Stats</a>
        </nav>
        <div className="header-actions">
          <ExternalLink href={SITE_LINKS.pluginRepository} className="header-github"><Github size={17} /> GitHub</ExternalLink>
          <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}>
        <nav>
          <a href="#how" onClick={closeMenu}>How it works <span>01</span></a>
          <a href="#worldguard" onClick={closeMenu}>WorldGuard <span>02</span></a>
          <a href="#developers" onClick={closeMenu}>Developers <span>03</span></a>
          <a href="#stats" onClick={closeMenu}>Stats <span>04</span></a>
          <ExternalLink href={SITE_LINKS.modrinth}>Modrinth <ArrowUpRight size={18} /></ExternalLink>
        </nav>
      </div>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow" data-hero><span className="status-dot" /> Presence-based protection</p>
            <h1 data-hero>Claims that change<br />with the players.</h1>
            <p className="hero-lead" data-hero>
              ClaimShift turns existing regions into dynamic claims. Decide when a base is protected, when it can be raided, and how long the transition should take.
            </p>
            <div className="hero-actions" data-hero>
              <ExternalLink href={SITE_LINKS.modrinth} className="button button--primary">
                Get ClaimShift <ArrowUpRight size={17} />
              </ExternalLink>
              <ExternalLink href={SITE_LINKS.pluginRepository} className="button button--ghost">
                View source <Github size={17} />
              </ExternalLink>
            </div>
            <div className="hero-meta" data-hero>
              <span>Paper</span><span>Purpur</span><span>Leaf</span><span>Folia</span><span>WorldGuard</span>
            </div>
          </div>

          <div className="hero-system" data-hero>
            <div className="hero-system__top">
              <span>claim / player_base</span>
              <span className="runtime-badge">runtime</span>
            </div>
            <div className="claim-visual">
              <div className="claim-visual__plane">
                <span className="claim-block claim-block--a" />
                <span className="claim-block claim-block--b" />
                <span className="claim-block claim-block--c" />
                <span className="claim-block claim-block--d" />
              </div>
              <div className="claim-visual__status">
                <span>OWNER</span>
                <strong>ONLINE</strong>
              </div>
              <div className="claim-visual__mode">
                <span>POLICY</span>
                <strong>online-open</strong>
              </div>
            </div>
            <div className="hero-system__bottom">
              <span className="live-dot" />
              <strong>OPEN</strong>
              <span>WorldGuard passthrough managed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="how" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div>
              <p className="eyebrow"><TimerReset size={15} /> One state machine</p>
              <h2>Online, grace, protected. Nothing hidden.</h2>
            </div>
            <p>
              ClaimShift does not replace your claim system. It watches effective owners and changes only the regions you choose to manage.
            </p>
          </div>

          <div className="mode-grid" data-reveal-item>
            <article className="mode-card mode-card--open">
              <span className="mode-card__number">01</span>
              <div>
                <p>online-open</p>
                <h3>Fight while the owner is there.</h3>
                <span>Online → open. Offline → grace → protected.</span>
              </div>
              <div className="mode-card__diagram">
                <span className="mode-node mode-node--active">ONLINE</span>
                <ChevronRight size={17} />
                <span className="mode-node">OPEN</span>
              </div>
            </article>
            <article className="mode-card mode-card--protected">
              <span className="mode-card__number">02</span>
              <div>
                <p>offline-open</p>
                <h3>Make absence part of the raid rules.</h3>
                <span>Online → protected. Offline → grace → open.</span>
              </div>
              <div className="mode-card__diagram">
                <span className="mode-node mode-node--active">OFFLINE</span>
                <ChevronRight size={17} />
                <span className="mode-node">OPEN</span>
              </div>
            </article>
          </div>

          <div className="flow-panel" data-reveal-item>
            <div className="flow-panel__copy">
              <span>State transition</span>
              <h3>The delay belongs to the policy, not to a pile of event listeners.</h3>
            </div>
            <StateFlow />
          </div>
        </div>
      </section>

      <section className="section worldguard-section" id="worldguard" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div>
              <p className="eyebrow"><PanelsTopLeft size={15} /> WorldGuard first</p>
              <h2>Your spawn stays your spawn.</h2>
            </div>
            <p>
              Dynamic protection is opt-in on fresh installs. Player bases can shift while spawn, shops, event zones and staff regions remain ordinary static WorldGuard regions.
            </p>
          </div>

          <div className="wg-layout">
            <article className="terminal-card" data-reveal-item>
              <div className="terminal-card__bar"><span /><span /><span /><small>region flags</small></div>
              <div className="terminal-lines">
                <p><span>$</span> /rg flag player_base claimshift-dynamic allow</p>
                <p className="terminal-success"><Check size={14} /> dynamic management enabled</p>
                <p><span>$</span> /rg flag spawn claimshift-dynamic deny</p>
                <p className="terminal-muted"><LockKeyhole size={14} /> static WorldGuard behavior kept</p>
              </div>
            </article>

            <div className="wg-points" data-reveal-item>
              <div><span>01</span><strong>Opt in per region</strong><p>Use a WorldGuard flag when you want explicit control.</p></div>
              <div><span>02</span><strong>Bulk rules when needed</strong><p>Include and exclude patterns cover established servers without touching every region by hand.</p></div>
              <div><span>03</span><strong>Restore what existed</strong><p>Temporary passthrough state is tracked so ClaimShift can return the original value after protection changes or recovery.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section rules-section" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div>
              <p className="eyebrow"><Puzzle size={15} /> Protection rules</p>
              <h2>Protect the actions that matter.</h2>
            </div>
            <p>
              Servers do not all play by the same rules. ClaimShift splits protection into practical action groups instead of forcing one all-or-nothing switch.
            </p>
          </div>
          <div className="rule-grid" data-reveal-item>
            {ruleGroups.map(([Icon, title, text], index) => (
              <article className="rule-card" key={title}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><Icon size={20} /></div>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="boundary-note" data-reveal-item>
            <div><ServerCog size={22} /><strong>Boundary-aware automation</strong></div>
            <p>Hoppers, pistons, fluids and similar mechanics can keep working inside the same protected claim while cross-boundary behavior is blocked.</p>
          </div>
        </div>
      </section>

      <section className="section developers-section" id="developers" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div>
              <p className="eyebrow"><Code2 size={15} /> For administrators & developers</p>
              <h2>Readable from config to runtime.</h2>
            </div>
            <p>
              Separate configuration files, validated reloads, explicit permissions and a provider-based architecture make the plugin easier to operate and extend.
            </p>
          </div>

          <div className="dev-grid">
            <article className="dev-card dev-card--permissions" data-reveal-item>
              <div className="dev-card__head"><div><Braces size={18} /><span>Permissions</span></div><small>LuckPerms friendly</small></div>
              <div className="permission-list">
                {permissions.map(([permission, description]) => (
                  <div key={permission}><code>{permission}</code><span>{description}</span></div>
                ))}
              </div>
              <p className="dev-note"><strong>admin ≠ bypass</strong> — administrators can test protection without silently bypassing it.</p>
            </article>

            <article className="dev-card dev-card--commands" data-reveal-item>
              <div className="dev-card__head"><div><ServerCog size={18} /><span>Commands</span></div><small>/cshift alias</small></div>
              <div className="command-list">
                {commands.map((command) => <code key={command}>{command}</code>)}
              </div>
              <ExternalLink href={SITE_LINKS.pluginRepository} className="text-link">Browse repository <ArrowRight size={16} /></ExternalLink>
            </article>

            <article className="dev-card dev-card--architecture" data-reveal-item>
              <div className="architecture-flow">
                <span>Provider</span><ChevronRight size={16} /><span>Snapshot</span><ChevronRight size={16} /><span>Presence</span><ChevronRight size={16} /><span>State</span><ChevronRight size={16} /><span>Protection</span>
              </div>
              <h3>Provider-specific claims stay separate from protection policy.</h3>
              <p>That separation is what lets WorldGuard integration, presence calculation and event protection evolve without turning into one giant listener.</p>
              <div className="architecture-tags"><span>safe reload</span><span>multi-owner</span><span>Folia-aware</span><span>recovery state</span></div>
            </article>
          </div>
        </div>
      </section>

      <BStatsSection />

      <section className="final-section" data-reveal-group>
        <div className="final-shell" data-reveal-item>
          <BrandMark />
          <div>
            <p className="eyebrow">ClaimShift</p>
            <h2>Make claim protection part of the game rules.</h2>
          </div>
          <div className="final-actions">
            <ExternalLink href={SITE_LINKS.modrinth} className="button button--dark">Modrinth <ArrowUpRight size={17} /></ExternalLink>
            <ExternalLink href={SITE_LINKS.pluginRepository} className="button button--outline"><Github size={17} /> GitHub</ExternalLink>
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand brand--footer" href="#top"><BrandMark compact /><span>CLAIMSHIFT</span></a>
        <nav>
          <ExternalLink href={SITE_LINKS.modrinth}>Modrinth</ExternalLink>
          <ExternalLink href={SITE_LINKS.pluginRepository}>Source</ExternalLink>
          <ExternalLink href={SITE_LINKS.issues}>Issues</ExternalLink>
          <ExternalLink href={SITE_LINKS.websiteRepository}>Website source</ExternalLink>
        </nav>
        <p>© 2026 Onelsey. All rights reserved.</p>
      </footer>
    </main>
  );
}
