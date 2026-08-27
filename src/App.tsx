import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Bot,
  Box,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Container,
  Github,
  LockKeyhole,
  Menu,
  PanelsTopLeft,
  Puzzle,
  Radar,
  ServerCog,
  ShieldCheck,
  TimerReset,
  UsersRound,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { SiteFooter } from "./components/SiteFooter";
import { StateFlow } from "./components/StateFlow";
import { BStatsSection } from "./sections/BStatsSection";
import { commonCopy, useLanguage } from "./i18n";
import { SITE_LINKS, SITE_PATHS } from "./site-config";

const copy = {
  en: {
    nav: { how: "How it works", worldguard: "WorldGuard", smart: "Smart Presence", developers: "Developers", stats: "Stats" },
    hero: {
      eyebrow: "Dynamic claim protection",
      titleA: "Claims that change",
      titleB: "with player presence.",
      lead: "ClaimShift adds dynamic raid rules to existing regions. Decide when a claim is protected, when it becomes raidable, and how long each transition should take.",
      get: "Get ClaimShift",
      wiki: "Open Wiki",
      source: "View source",
      owner: "OWNER",
      active: "ACTIVE",
      policy: "POLICY",
      runtime: "runtime",
      managed: "WorldGuard state managed",
      claim: "claim / player_base",
    },
    how: {
      eyebrow: "State-based protection",
      title: "OPEN, GRACE, PROTECTED.",
      lead: "ClaimShift does not replace your claim plugin. It watches active owners and changes only the regions you explicitly choose to manage.",
      defaultMode: "offline-open",
      defaultTitle: "Protect active players by default.",
      defaultText: "Active owner → protected. No active owners → 1 hour grace → open.",
      alternateMode: "online-open",
      alternateTitle: "Keep offline bases protected.",
      alternateText: "Active owner → open. No active owners → grace → protected.",
      transition: "Independent transition delays",
      transitionText: "Opening a claim and restoring protection use separate delays. Set either delay to 0 for an immediate transition.",
    },
    worldguard: {
      eyebrow: "WorldGuard first",
      title: "Your spawn stays your spawn.",
      lead: "Fresh installations are opt-in. Player bases can use dynamic protection while spawn, shops, event zones and staff regions keep their normal WorldGuard behavior.",
      enabled: "dynamic management enabled",
      static: "static WorldGuard behavior kept",
      points: [
        ["Opt in per region", "Use claimshift-dynamic when you want explicit control."],
        ["Bulk selection when needed", "Include and exclude patterns let established servers manage player regions without touching every claim by hand."],
        ["Restore the original state", "Temporary passthrough changes are tracked so ClaimShift can safely return the exact previous WorldGuard value."],
      ],
    },
    smart: {
      eyebrow: "Smart Presence",
      title: "Online does not always mean active.",
      lead: "Simple AFK machines and timed keep-alive binds should not hold protection forever. ClaimShift can decide whether a connected owner is actually active without pretending to be an anti-cheat.",
      cards: [
        ["Idle-aware", "Meaningful activity refreshes presence. Sitting connected without real activity eventually stops counting."],
        ["Pattern-aware", "Repeated actions at nearly identical intervals can stop refreshing the activity timer instead of being treated as real play."],
        ["AFK bridges", "When available, ClaimShift can also respect AFK state reported by CMI or EssentialsX."],
      ],
      noteTitle: "No punishment, no bot verdict",
      note: "Pattern detection only affects whether an owner counts as active. It does not ban, kick or label the player as cheating.",
    },
    rules: {
      eyebrow: "Protection rules",
      title: "Protect the actions that matter.",
      lead: "Servers do not all play by the same rules. Protection is split into practical action groups instead of one all-or-nothing switch.",
      groups: [
        ["Blocks", "Break and place rules"],
        ["Containers", "Inventories and hoppers"],
        ["Explosions", "TNT and entity explosions"],
        ["Entities", "Damage and interaction"],
        ["World", "Fluids, fire and pistons"],
        ["Boundaries", "Cross-claim automation"],
      ],
      boundaryTitle: "Boundary-aware automation",
      boundary: "Hoppers, pistons, fluids and similar mechanics can keep working inside the same protected claim while cross-boundary behavior is blocked.",
    },
    dev: {
      eyebrow: "For administrators & developers",
      title: "Readable from config to runtime.",
      lead: "Validated reloads, explicit permissions, dry-run diagnostics and a provider-based architecture make ClaimShift easier to operate and extend.",
      permissions: "Permissions",
      permissionsNote: "LuckPerms friendly",
      adminNote: "admin ≠ bypass — administrators can test protection without silently bypassing it.",
      commands: "Commands",
      alias: "/cshift alias",
      browse: "Browse repository",
      architectureTitle: "Claim providers stay separate from presence and protection policy.",
      architectureText: "That separation lets WorldGuard integration, Smart Presence, state calculation and event protection evolve without turning into one giant listener.",
      docs: "Read the Wiki",
      tags: ["safe reload", "multi-owner", "Smart Presence", "Folia-aware", "crash recovery"],
    },
    final: { eyebrow: "ClaimShift", title: "Make claim protection part of the game rules.", wiki: "Read the Wiki" },
  },
  ru: {
    nav: { how: "Как работает", worldguard: "WorldGuard", smart: "Активность", developers: "Админам", stats: "Статистика" },
    hero: {
      eyebrow: "Динамическая защита приватов",
      titleA: "Приваты, которые меняются",
      titleB: "вместе с игроками.",
      lead: "ClaimShift добавляет динамические правила рейдов поверх существующих регионов. Вы сами решаете, когда приват защищён, когда доступен для рейда и сколько длится переход между состояниями.",
      get: "Скачать ClaimShift",
      wiki: "Открыть вики",
      source: "Исходники",
      owner: "ВЛАДЕЛЕЦ",
      active: "АКТИВЕН",
      policy: "ПОЛИТИКА",
      runtime: "runtime",
      managed: "состояние WorldGuard управляется",
      claim: "регион / player_base",
    },
    how: {
      eyebrow: "Защита по состояниям",
      title: "OPEN, GRACE, PROTECTED.",
      lead: "ClaimShift не заменяет систему приватов. Он отслеживает активных владельцев и меняет только те регионы, которыми вы разрешили ему управлять.",
      defaultMode: "offline-open",
      defaultTitle: "По умолчанию активный игрок защищён.",
      defaultText: "Есть активный владелец → защита. Нет активных владельцев → 1 час GRACE → OPEN.",
      alternateMode: "online-open",
      alternateTitle: "Можно защищать базы офлайн.",
      alternateText: "Есть активный владелец → OPEN. Нет активных владельцев → GRACE → защита.",
      transition: "Две независимые задержки",
      transitionText: "Открытие региона и возврат защиты имеют отдельные таймеры. Любую задержку можно поставить в 0 и сделать переход мгновенным.",
    },
    worldguard: {
      eyebrow: "Сначала WorldGuard",
      title: "Спавн останется спавном.",
      lead: "На чистой установке регионы подключаются вручную. Базы игроков могут быть динамическими, а спавн, магазины, ивенты и админские регионы остаются обычными приватами WorldGuard.",
      enabled: "динамический режим включён",
      static: "обычная защита WorldGuard сохранена",
      points: [
        ["Включение для конкретного региона", "Флаг claimshift-dynamic даёт понятный ручной контроль."],
        ["Массовый выбор при необходимости", "Include/exclude-паттерны позволяют подключить существующие регионы игроков без ручной настройки каждого."],
        ["Возврат исходного состояния", "ClaimShift запоминает временные изменения passthrough и безопасно возвращает исходное значение."],
      ],
    },
    smart: {
      eyebrow: "Smart Presence",
      title: "Онлайн — ещё не значит активен.",
      lead: "Простая AFK-машина или бинд раз в несколько минут не должны держать защиту бесконечно. ClaimShift может оценивать реальную активность владельца, не превращаясь при этом в античит.",
      cards: [
        ["Учитывает простой", "Осмысленная активность обновляет присутствие. Просто подключённый и ничего не делающий игрок со временем перестаёт считаться активным."],
        ["Видит повторяющиеся паттерны", "Одинаковые действия через почти одинаковые интервалы могут перестать продлевать таймер активности."],
        ["Интеграция с AFK", "Если установлены CMI или EssentialsX, ClaimShift может учитывать их готовый AFK-статус."],
      ],
      noteTitle: "Без наказаний и ярлыков",
      note: "Обнаруженный паттерн влияет только на статус активности владельца. ClaimShift не банит, не кикает и не объявляет игрока читером.",
    },
    rules: {
      eyebrow: "Правила защиты",
      title: "Защищайте только то, что нужно.",
      lead: "У серверов разные правила. Поэтому ClaimShift разделяет защиту на группы действий, а не заставляет включать один общий запрет на всё.",
      groups: [
        ["Блоки", "Ломание и установка"],
        ["Контейнеры", "Инвентари и воронки"],
        ["Взрывы", "TNT и взрывы сущностей"],
        ["Сущности", "Урон и взаимодействие"],
        ["Мир", "Жидкости, огонь и поршни"],
        ["Границы", "Автоматика между регионами"],
      ],
      boundaryTitle: "Автоматика с учётом границ",
      boundary: "Воронки, поршни, жидкости и другие механизмы могут продолжать работать внутри одного защищённого региона, а пересечение защищённой границы блокируется.",
    },
    dev: {
      eyebrow: "Для админов и разработчиков",
      title: "Понятно от конфига до runtime.",
      lead: "Безопасный reload, отдельные permissions, dry-run диагностика и provider-архитектура упрощают настройку, тестирование и дальнейшее развитие плагина.",
      permissions: "Права",
      permissionsNote: "удобно с LuckPerms",
      adminNote: "admin ≠ bypass — администратор может нормально тестировать защиту, не обходя её автоматически.",
      commands: "Команды",
      alias: "алиас /cshift",
      browse: "Открыть репозиторий",
      architectureTitle: "Система приватов отделена от логики присутствия и защиты.",
      architectureText: "Благодаря этому WorldGuard, Smart Presence, расчёт состояний и обработка защиты могут развиваться независимо, а не превращаться в один огромный listener.",
      docs: "Открыть вики",
      tags: ["safe reload", "несколько владельцев", "Smart Presence", "Folia-aware", "crash recovery"],
    },
    final: { eyebrow: "ClaimShift", title: "Сделайте защиту приватов частью правил сервера.", wiki: "Открыть вики" },
  },
} as const;

const permissionKeys = [
  "claimshift.admin",
  "claimshift.inspect",
  "claimshift.info",
  "claimshift.sync",
  "claimshift.reload",
  "claimshift.language",
  "claimshift.dryrun",
  "claimshift.bypass",
] as const;

const permissionDescriptions = {
  en: ["Administrative commands", "Inspect state at your location", "Runtime/provider information", "Immediate reconciliation", "Validated config reload", "Change locale settings", "Dry-run diagnostics", "Explicit protection bypass"],
  ru: ["Административные команды", "Проверка состояния в текущей точке", "Информация о runtime/provider", "Принудительная синхронизация", "Безопасная перезагрузка конфигов", "Смена локали", "Управление dry-run", "Явный обход защиты"],
} as const;

const commands = [
  "/claimshift help",
  "/claimshift info",
  "/claimshift inspect",
  "/claimshift sync",
  "/claimshift reload",
  "/claimshift language <locale> [config|messages|both]",
  "/claimshift dryrun <on|off|status>",
] as const;

const ruleIcons = [Blocks, Container, Zap, Box, Waves, ShieldCheck] as const;
const smartIcons = [TimerReset, Radar, UsersRound] as const;

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export default function App() {
  const root = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = copy[language];
  const common = commonCopy[language];

  useEffect(() => {
    document.title = language === "ru" ? "ClaimShift — динамическая защита приватов" : "ClaimShift — Dynamic claim protection";
    const description = language === "ru"
      ? "ClaimShift — динамическая защита регионов Minecraft по активности владельцев."
      : "ClaimShift — dynamic Minecraft claim protection based on active owner presence.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [language]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.fromTo("[data-hero]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: "power3.out" });
      (gsap.utils.toArray("[data-reveal-group]") as HTMLElement[]).forEach((group) => {
        const items = group.querySelectorAll("[data-reveal-item]") as NodeListOf<HTMLElement>;
        gsap.fromTo(items, { y: 34, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });
      gsap.to(".hero-orbit--one", { y: 24, x: -8, rotation: 4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 } });
      gsap.to(".hero-orbit--two", { y: -18, x: 12, rotation: -3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 } });
    }, root);
    return () => ctx.revert();
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site" ref={root}>
      <header className="header">
        <a className="brand" href="#top" aria-label="ClaimShift home"><BrandMark compact /><span>CLAIMSHIFT</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how">{t.nav.how}</a>
          <a href="#worldguard">{t.nav.worldguard}</a>
          <a href="#smart">{t.nav.smart}</a>
          <a href={SITE_PATHS.wiki}>{common.wiki}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch compact />
          <ExternalLink href={SITE_LINKS.pluginRepository} className="header-github"><Github size={17} /> GitHub</ExternalLink>
          <button className="menu-button" aria-label={menuOpen ? common.closeMenu : common.menu} onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}>
        <nav>
          <a href="#how" onClick={closeMenu}>{t.nav.how}<span>01</span></a>
          <a href="#worldguard" onClick={closeMenu}>{t.nav.worldguard}<span>02</span></a>
          <a href="#smart" onClick={closeMenu}>{t.nav.smart}<span>03</span></a>
          <a href={SITE_PATHS.wiki} onClick={closeMenu}>{common.wiki}<span>04</span></a>
          <ExternalLink href={SITE_LINKS.modrinth}>Modrinth <ArrowUpRight size={18} /></ExternalLink>
          <LanguageSwitch />
        </nav>
      </div>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow" data-hero><span className="status-dot" /> {t.hero.eyebrow}</p>
            <h1 data-hero>{t.hero.titleA}<br />{t.hero.titleB}</h1>
            <p className="hero-lead" data-hero>{t.hero.lead}</p>
            <div className="hero-actions" data-hero>
              <ExternalLink href={SITE_LINKS.modrinth} className="button button--primary">{t.hero.get} <ArrowUpRight size={17} /></ExternalLink>
              <a href={SITE_PATHS.wiki} className="button button--ghost">{t.hero.wiki} <ArrowRight size={17} /></a>
              <ExternalLink href={SITE_LINKS.pluginRepository} className="button button--ghost">{t.hero.source} <Github size={17} /></ExternalLink>
            </div>
            <div className="hero-meta" data-hero><span>Paper</span><span>Purpur</span><span>Leaf</span><span>Folia</span><span>WorldGuard</span></div>
          </div>

          <div className="hero-system" data-hero>
            <div className="hero-system__top"><span>{t.hero.claim}</span><span className="runtime-badge">{t.hero.runtime}</span></div>
            <div className="claim-visual">
              <div className="claim-visual__plane"><span className="claim-block claim-block--a" /><span className="claim-block claim-block--b" /><span className="claim-block claim-block--c" /><span className="claim-block claim-block--d" /></div>
              <div className="claim-visual__status"><span>{t.hero.owner}</span><strong>{t.hero.active}</strong></div>
              <div className="claim-visual__mode"><span>{t.hero.policy}</span><strong>offline-open</strong></div>
            </div>
            <div className="hero-system__bottom"><span className="live-dot" /><strong>PROTECTED</strong><span>{t.hero.managed}</span></div>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="how" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div><p className="eyebrow"><TimerReset size={15} /> {t.how.eyebrow}</p><h2>{t.how.title}</h2></div>
            <p>{t.how.lead}</p>
          </div>
          <div className="mode-grid" data-reveal-item>
            <article className="mode-card mode-card--protected">
              <span className="mode-card__number">01</span>
              <div><p>{t.how.defaultMode}</p><h3>{t.how.defaultTitle}</h3><span>{t.how.defaultText}</span></div>
              <div className="mode-card__diagram"><span className="mode-node mode-node--active">ACTIVE</span><ChevronRight size={17} /><span className="mode-node">PROTECTED</span></div>
            </article>
            <article className="mode-card mode-card--open">
              <span className="mode-card__number">02</span>
              <div><p>{t.how.alternateMode}</p><h3>{t.how.alternateTitle}</h3><span>{t.how.alternateText}</span></div>
              <div className="mode-card__diagram"><span className="mode-node mode-node--active">ACTIVE</span><ChevronRight size={17} /><span className="mode-node">OPEN</span></div>
            </article>
          </div>
          <div className="flow-panel" data-reveal-item>
            <div className="flow-panel__copy"><span>{t.how.transition}</span><h3>{t.how.transitionText}</h3></div>
            <StateFlow />
          </div>
        </div>
      </section>

      <section className="section worldguard-section" id="worldguard" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div><p className="eyebrow"><PanelsTopLeft size={15} /> {t.worldguard.eyebrow}</p><h2>{t.worldguard.title}</h2></div>
            <p>{t.worldguard.lead}</p>
          </div>
          <div className="wg-layout">
            <article className="terminal-card" data-reveal-item>
              <div className="terminal-card__bar"><span /><span /><span /><small>region flags</small></div>
              <div className="terminal-lines">
                <p><span>$</span> /rg flag player_base claimshift-dynamic allow</p>
                <p className="terminal-success"><Check size={14} /> {t.worldguard.enabled}</p>
                <p><span>$</span> /rg flag spawn claimshift-dynamic deny</p>
                <p className="terminal-muted"><LockKeyhole size={14} /> {t.worldguard.static}</p>
              </div>
            </article>
            <div className="wg-points" data-reveal-item>
              {t.worldguard.points.map(([title, text], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section smart-section" id="smart" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div><p className="eyebrow"><Activity size={15} /> {t.smart.eyebrow}</p><h2>{t.smart.title}</h2></div>
            <p>{t.smart.lead}</p>
          </div>
          <div className="presence-grid" data-reveal-item>
            {t.smart.cards.map(([title, text], index) => {
              const Icon = smartIcons[index];
              return <article className="presence-card" key={title}><div><span>0{index + 1}</span><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></article>;
            })}
          </div>
          <div className="smart-note" data-reveal-item><Bot size={22} /><div><strong>{t.smart.noteTitle}</strong><p>{t.smart.note}</p></div></div>
        </div>
      </section>

      <section className="section rules-section" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div><p className="eyebrow"><Puzzle size={15} /> {t.rules.eyebrow}</p><h2>{t.rules.title}</h2></div>
            <p>{t.rules.lead}</p>
          </div>
          <div className="rule-grid" data-reveal-item>
            {t.rules.groups.map(([title, text], index) => {
              const Icon = ruleIcons[index];
              return <article className="rule-card" key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon size={20} /></div><strong>{title}</strong><p>{text}</p></article>;
            })}
          </div>
          <div className="boundary-note" data-reveal-item><div><ServerCog size={22} /><strong>{t.rules.boundaryTitle}</strong></div><p>{t.rules.boundary}</p></div>
        </div>
      </section>

      <section className="section developers-section" id="developers" data-reveal-group>
        <div className="section-shell">
          <div className="section-head" data-reveal-item>
            <div><p className="eyebrow"><Code2 size={15} /> {t.dev.eyebrow}</p><h2>{t.dev.title}</h2></div>
            <p>{t.dev.lead}</p>
          </div>
          <div className="dev-grid">
            <article className="dev-card dev-card--permissions" data-reveal-item>
              <div className="dev-card__head"><div><Braces size={18} /><span>{t.dev.permissions}</span></div><small>{t.dev.permissionsNote}</small></div>
              <div className="permission-list">
                {permissionKeys.map((permission, index) => <div key={permission}><code>{permission}</code><span>{permissionDescriptions[language][index]}</span></div>)}
              </div>
              <p className="dev-note"><strong>admin ≠ bypass</strong> — {t.dev.adminNote.replace("admin ≠ bypass — ", "")}</p>
            </article>
            <article className="dev-card dev-card--commands" data-reveal-item>
              <div className="dev-card__head"><div><ServerCog size={18} /><span>{t.dev.commands}</span></div><small>{t.dev.alias}</small></div>
              <div className="command-list">{commands.map((command) => <code key={command}>{command}</code>)}</div>
              <div className="dev-links"><a href={SITE_PATHS.wiki} className="text-link">{t.dev.docs} <ArrowRight size={16} /></a><ExternalLink href={SITE_LINKS.pluginRepository} className="text-link">{t.dev.browse} <ArrowRight size={16} /></ExternalLink></div>
            </article>
            <article className="dev-card dev-card--architecture" data-reveal-item>
              <div className="architecture-flow"><span>Provider</span><ChevronRight size={16} /><span>Snapshot</span><ChevronRight size={16} /><span>Presence</span><ChevronRight size={16} /><span>State</span><ChevronRight size={16} /><span>Protection</span></div>
              <h3>{t.dev.architectureTitle}</h3><p>{t.dev.architectureText}</p>
              <div className="architecture-tags">{t.dev.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          </div>
        </div>
      </section>

      <BStatsSection />

      <section className="final-section" data-reveal-group>
        <div className="final-shell" data-reveal-item>
          <BrandMark />
          <div><p className="eyebrow">{t.final.eyebrow}</p><h2>{t.final.title}</h2></div>
          <div className="final-actions"><ExternalLink href={SITE_LINKS.modrinth} className="button button--dark">Modrinth <ArrowUpRight size={17} /></ExternalLink><a href={SITE_PATHS.wiki} className="button button--outline">{t.final.wiki} <ArrowRight size={17} /></a></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
