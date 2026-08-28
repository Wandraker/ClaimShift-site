import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Code2,
  Github,
  Menu,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { SiteFooter } from "./components/SiteFooter";
import { commonCopy, useLanguage } from "./i18n";
import { SITE_LINKS, SITE_PATHS } from "./site-config";

const copy = {
  en: {
    pageTitle: "ClaimShift Wiki — setup and reference",
    pageDescription: "ClaimShift setup, WorldGuard configuration, Smart Presence, commands, permissions and troubleshooting.",
    badge: "Documentation",
    title: "ClaimShift Wiki",
    lead: "Setup, operating behavior and troubleshooting for administrators. Command syntax stays the same in every language.",
    back: "Back to site",
    github: "Plugin source",
    navTitle: "On this page",
    toc: [
      ["overview", "Overview"], ["install", "Installation"], ["dryrun", "First launch / dry-run"], ["states", "States & policies"], ["presence", "Smart Presence"], ["worldguard", "WorldGuard"], ["regions", "Admin & static regions"], ["overrides", "Per-region overrides"], ["rules", "Protection rules"], ["raids", "Raid sessions"], ["commands", "Commands & permissions"], ["localization", "Localization"], ["metrics", "bStats / telemetry"], ["recovery", "Crash recovery"], ["troubleshooting", "Troubleshooting"],
    ] as const,
    overview: {
      title: "What ClaimShift actually does",
      paragraphs: [
        "ClaimShift does not create claims. It sits on top of a supported claim system and changes the protection state of selected regions based on owner presence.",
        "A connected owner is not automatically an active owner. With Smart Presence enabled, AFK/idle accounts can stop counting as present, which prevents simple keep-alive machines from holding a claim in one state forever.",
      ],
      defaultTitle: "Fresh-install defaults",
      defaults: ["Policy: offline-open", "No active owners: 1 hour before OPEN", "Active owner returns to an OPEN claim: 5 minutes before PROTECTED", "Smart Presence: enabled", "Pattern detection: enabled", "Raid sessions: disabled", "Dry-run: enabled only on a brand-new installation"],
    },
    install: {
      title: "Installation",
      steps: ["Install a supported server implementation.", "Install WorldGuard if you want full dynamic WorldGuard regions.", "Place the ClaimShift JAR in the server plugins directory.", "Start the server once and inspect the generated configuration.", "Use dry-run to verify which regions ClaimShift would manage before enabling enforcement."],
      note: "ClaimShift targets the modern Paper ecosystem: Paper, Purpur, Leaf and Folia. Spigot is intentionally unsupported. Check the current release page for exact Minecraft and Java requirements.",
    },
    dryrun: {
      title: "First launch and dry-run",
      paragraphs: ["A new installation starts in dry-run mode. ClaimShift calculates OPEN / GRACE / PROTECTED and logs intended transitions, but it does not modify WorldGuard state and does not enforce protection.", "Operators with the dry-run permission receive a title/chat reminder while the mode is enabled. Updating an existing ClaimShift installation does not automatically turn dry-run back on."],
      ready: "When the preview looks correct, disable it:",
      commands: ["/claimshift dryrun status", "/claimshift inspect", "/claimshift dryrun off"],
    },
    states: {
      title: "States, policies and delays",
      states: [["OPEN", "The raid window is active."], ["GRACE", "A transition timer is running."], ["PROTECTED", "ClaimShift protection is active."]],
      offlineTitle: "offline-open (fresh-install default)",
      offline: "Active owner → PROTECTED. When the last active owner disappears, the claim remains protected for the inactive delay (1 hour by default), then becomes OPEN. If an active owner returns to a claim that is already OPEN, protection returns after the active delay (5 minutes by default).",
      onlineTitle: "online-open",
      online: "Active owner → OPEN. When no active owners remain, the configured transition runs toward PROTECTED. The same two delays are used in the opposite direction.",
      zero: "Set a delay to 0 or 0s to make that transition immediate.",
      config: `protection:\n  presence-policy: offline-open\n  transition-delays:\n    owner-active: 5m\n    owner-inactive: 1h`,
    },
    presence: {
      title: "Smart Presence and AFK abuse",
      paragraphs: ["Smart Presence decides whether a connected owner should still count as active. It is deliberately not a punishment system or a full bot detector.", "Repeated low-frequency actions can stop refreshing activity when their timing becomes too regular. A player who resumes normal gameplay can become active again immediately."],
      signals: ["Idle time since meaningful activity", "Meaningful movement instead of tiny jitter or camera-only movement", "Repeated actions at nearly identical intervals", "Optional AFK state from CMI", "Optional AFK state from EssentialsX"],
      config: `presence:\n  smart:\n    enabled: true\n    idle-timeout: 20m\n    minimum-movement-distance: 3.0\n    external-afk:\n      enabled: true\n      cmi: true\n      essentialsx: true\n    patterns:\n      enabled: true\n      minimum-samples: 5\n      minimum-interval: 30s\n      interval-tolerance: 3s`,
      caution: "A sophisticated macro can still resemble real gameplay. ClaimShift only reduces simple AFK/pattern abuse; anti-cheat and server rules remain separate layers.",
    },
    worldguard: {
      title: "WorldGuard setup",
      paragraphs: ["WorldGuard is the primary full dynamic integration. ClaimShift registers its own flags and, in dynamic-passthrough mode, temporarily manages the passthrough layer for selected regions.", "Regions already present when ClaimShift first observes a world are recorded as legacy/static and remain normal WorldGuard regions. Eligible player-owned regions first created while ClaimShift is running are automatically dynamic by default.", "Normal /rg claim, /rg define, owner and flag changes request a near-immediate ClaimShift reconciliation. Regions created through APIs or other plugins are still discovered by the periodic reconciler."],
      enable: "/rg flag <region> claimshift-dynamic allow",
      disable: "/rg flag <region> claimshift-dynamic deny",
      selector: `integration:\n  worldguard:\n    mode: dynamic-passthrough\n    manage-all-owned-regions: false\n    auto-manage-new-regions: true\n    manage-existing-passthrough-regions: false\n    included-regions: []\n    excluded-regions:\n      - __global__`,
      lands: "Lands is currently an optional overlay integration, not the same full dynamic-open implementation as WorldGuard.",
    },
    regions: {
      title: "Spawn, shops and administrative regions",
      paragraphs: ["Administrative regions do not have to participate in ClaimShift. A spawn, event arena or shop can stay a normal WorldGuard region forever.", "Ownerless administrative regions are not dynamically managed. For explicit safety, use claimshift-dynamic deny on regions that must never shift."],
      examples: ["/rg flag spawn claimshift-dynamic deny", "/rg flag shop claimshift-dynamic deny", "/rg flag player_base claimshift-dynamic allow"],
      bulk: "If most owned regions are player claims, manage-all-owned-regions can be enabled and static regions can be excluded by region flag or selector patterns.",
    },
    overrides: {
      title: "Per-region overrides",
      text: "A managed WorldGuard region can override the global presence policy, both transition delays and raid-session setting.",
      commands: ["/rg flag <region> claimshift-policy offline-open", "/rg flag <region> claimshift-active-delay 5m", "/rg flag <region> claimshift-inactive-delay 1h", "/rg flag <region> claimshift-raids allow", "/rg flag <region> claimshift-raids deny"],
      note: "claimshift-delay remains a compatibility alias for the inactive-owner delay. A policy/delay override does not automatically convert a legacy/static region; use claimshift-dynamic allow when you intentionally want an older region to become dynamic.",
    },
    rules: {
      title: "Protection rules",
      text: "Each action group can be enabled or disabled independently in rules.yml.",
      items: ["Block break", "Block place", "Containers", "Container automation", "Interactions", "Entity damage", "Entity interaction", "Entity grief", "Hanging entities", "Buckets", "Explosions", "Pistons", "Fluids", "Fire"],
      automation: "For hoppers, pistons, fluids, fire and similar automation, ClaimShift tries to allow normal behavior inside the same protected claim while blocking cross-boundary behavior.",
    },
    raids: {
      title: "Raid sessions",
      paragraphs: ["Raid sessions are optional and disabled by default. When enabled, qualifying activity against an already OPEN claim can create a temporary raid lock.", "The lock prevents protection from returning in the middle of an active raid. It ends after inactivity or the configured hard maximum duration."],
      config: `raids:\n  enabled: false\n  inactivity-timeout: 10m\n  maximum-duration: 30m\n  extend-on-activity: true\n  trigger-actions:\n    - block-break\n    - block-place\n    - containers\n    - interactions\n    - explosions`,
    },
    commands: {
      title: "Commands and permissions",
      commandList: ["/claimshift help", "/claimshift info", "/claimshift inspect", "/claimshift sync", "/claimshift reload", "/claimshift language <locale> [config|messages|both]", "/claimshift dryrun <on|off|status>"],
      alias: "Alias: /cshift",
      permissions: ["claimshift.admin", "claimshift.reload", "claimshift.sync", "claimshift.info", "claimshift.inspect", "claimshift.language", "claimshift.dryrun", "claimshift.bypass"],
      bypass: "claimshift.admin intentionally does not include claimshift.bypass. An operator can test the real protection path instead of silently bypassing it.",
    },
    localization: {
      title: "Localization",
      text: "Configuration comments and messages can use different built-in locales. Changing locale does not reset unrelated custom values.",
      locales: ["en_US — English", "ru_RU — Russian", "de_DE — German", "es_ES — Spanish", "fr_FR — French", "pl_PL — Polish", "pt_BR — Brazilian Portuguese", "uk_UA — Ukrainian", "zh_CN — Simplified Chinese"],
      commands: "Executable command names, subcommands and config/messages/both scope tokens are never translated. Only human-readable messages, descriptions and comments are localized.",
    },
    metrics: {
      title: "bStats and telemetry",
      text: "ClaimShift can send anonymous usage statistics through bStats. It reports normal bStats platform/plugin data plus non-identifying configuration charts such as presence policy, provider, locale and feature states.",
      no: "ClaimShift custom charts do not include usernames, player UUIDs, region names or server addresses.",
      disable: `metrics:\n  enabled: false`,
      global: "The server-wide bStats opt-out in plugins/bStats/config.yml is also respected.",
    },
    recovery: {
      title: "Runtime safety and crash recovery",
      paragraphs: ["When ClaimShift temporarily changes WorldGuard state, it records what needs to be restored. Recovery metadata is kept in plugins/ClaimShift/runtime-worldguard.yml.", "On normal shutdown, provider reload or startup after an interrupted run, ClaimShift attempts to restore the original WorldGuard state safely."],
      warning: "Do not edit runtime-worldguard.yml while the server is running. If the server crashes while a managed claim is temporarily open, start the server with ClaimShift installed again before removing the plugin or manually rewriting those regions.",
    },
    troubleshooting: {
      title: "Troubleshooting",
      items: [
        ["Nothing changes after installation", "Check whether dry-run is still enabled. A fresh install intentionally previews decisions without enforcement."],
        ["My player region stays static", "Use /claimshift inspect and check Management source. Regions that existed before ClaimShift are intentionally legacy/static. New eligible regions should be automatic; older ones can be enabled with claimshift-dynamic allow."],
        ["Spawn might become raidable", "Keep it ownerless/static or explicitly set claimshift-dynamic deny."],
        ["An online owner became inactive", "Smart Presence can mark connected AFK/idle owners inactive. Check idle settings and CMI/EssentialsX AFK state."],
        ["Reload was rejected", "That is intentional safety behavior. Fix the invalid value; the previous working configuration remains active."],
        ["Commands look English on a Russian server", "Correct. Command syntax is intentionally stable and never translated."],
      ] as const,
      report: "For a useful bug report, include /claimshift info, /claimshift inspect, reproduction steps, relevant config and console output. Remove secrets before publishing logs.",
    },
  },
  ru: {
    pageTitle: "Вики ClaimShift — настройка и справка",
    pageDescription: "Настройка ClaimShift, WorldGuard, Smart Presence, команды, права и решение проблем.",
    badge: "Документация",
    title: "Вики ClaimShift",
    lead: "Подробная настройка, поведение плагина и решение проблем для администраторов. Синтаксис команд одинаковый на всех языках.",
    back: "На главную",
    github: "Исходники плагина",
    navTitle: "На этой странице",
    toc: [
      ["overview", "Что делает ClaimShift"], ["install", "Установка"], ["dryrun", "Первый запуск / dry-run"], ["states", "Состояния и политики"], ["presence", "Smart Presence"], ["worldguard", "WorldGuard"], ["regions", "Админские регионы"], ["overrides", "Настройки для региона"], ["rules", "Правила защиты"], ["raids", "Raid Sessions"], ["commands", "Команды и права"], ["localization", "Локализация"], ["metrics", "bStats / телеметрия"], ["recovery", "Восстановление после краша"], ["troubleshooting", "Решение проблем"],
    ] as const,
    overview: {
      title: "Что ClaimShift делает на самом деле",
      paragraphs: ["ClaimShift не создаёт свои приваты. Он работает поверх поддерживаемой системы регионов и меняет состояние защиты выбранных приватов в зависимости от присутствия владельцев.", "Подключённый владелец не всегда считается активным. При включённом Smart Presence AFK/idle-аккаунт может перестать засчитываться как присутствующий, поэтому простая AFK-машина не сможет бесконечно удерживать приват в одном состоянии."],
      defaultTitle: "Дефолты чистой установки",
      defaults: ["Политика: offline-open", "Нет активных владельцев: 1 час до OPEN", "Активный владелец вернулся в уже OPEN-регион: 5 минут до PROTECTED", "Smart Presence: включён", "Поиск повторяющихся паттернов: включён", "Raid Sessions: выключены", "Dry-run: включён только на совершенно новой установке"],
    },
    install: {
      title: "Установка",
      steps: ["Установите поддерживаемое серверное ядро.", "Установите WorldGuard, если нужна полноценная динамика регионов WorldGuard.", "Положите JAR ClaimShift в папку plugins сервера.", "Один раз запустите сервер и проверьте сгенерированные конфиги.", "Сначала используйте dry-run и убедитесь, какие регионы ClaimShift собирается менять."],
      note: "ClaimShift рассчитан на современную Paper-экосистему: Paper, Purpur, Leaf и Folia. Spigot намеренно не поддерживается. Точные требования Minecraft и Java смотрите у текущего релиза.",
    },
    dryrun: {
      title: "Первый запуск и dry-run",
      paragraphs: ["На новой установке ClaimShift запускается в dry-run. Плагин рассчитывает OPEN / GRACE / PROTECTED и пишет предполагаемые переходы, но не меняет WorldGuard и не применяет защитные запреты.", "Оператор с соответствующим правом получает заметный title и сообщение в чат, пока dry-run включён. При обычном обновлении уже существующей установки dry-run сам заново не включается."],
      ready: "Когда всё проверено, отключите режим:",
      commands: ["/claimshift dryrun status", "/claimshift inspect", "/claimshift dryrun off"],
    },
    states: {
      title: "Состояния, политики и задержки",
      states: [["OPEN", "Регион открыт для рейда."], ["GRACE", "Идёт таймер перехода."], ["PROTECTED", "Защита ClaimShift активна."]],
      offlineTitle: "offline-open (дефолт чистой установки)",
      offline: "Есть активный владелец → PROTECTED. После исчезновения последнего активного владельца регион ещё остаётся защищён на время owner-inactive (по умолчанию 1 час), затем становится OPEN. Если владелец вернулся в уже OPEN-регион, защита возвращается после owner-active (по умолчанию 5 минут).",
      onlineTitle: "online-open",
      online: "Есть активный владелец → OPEN. Когда активных владельцев не осталось, начинается переход к PROTECTED. Те же две задержки работают в противоположном направлении.",
      zero: "Значение 0 или 0s полностью отключает конкретную задержку и делает переход мгновенным.",
      config: `protection:\n  presence-policy: offline-open\n  transition-delays:\n    owner-active: 5m\n    owner-inactive: 1h`,
    },
    presence: {
      title: "Smart Presence и AFK-абуз",
      paragraphs: ["Smart Presence решает, должен ли подключённый владелец всё ещё считаться активным. Это не система наказаний и не полноценный bot detector.", "Редкие повторяющиеся действия могут перестать продлевать активность, если их интервалы становятся слишком одинаковыми. Как только игрок снова нормально играет, он может сразу вернуться в активное состояние."],
      signals: ["Время без осмысленной активности", "Нормальное перемещение вместо микродвижений или одного поворота камеры", "Одинаковые действия через почти одинаковые интервалы", "Опциональный AFK-статус CMI", "Опциональный AFK-статус EssentialsX"],
      config: `presence:\n  smart:\n    enabled: true\n    idle-timeout: 20m\n    minimum-movement-distance: 3.0\n    external-afk:\n      enabled: true\n      cmi: true\n      essentialsx: true\n    patterns:\n      enabled: true\n      minimum-samples: 5\n      minimum-interval: 30s\n      interval-tolerance: 3s`,
      caution: "Сложный макрос всё равно может быть похож на реального игрока. ClaimShift снижает эффективность простого AFK/pattern-абуза, а античит и правила сервера остаются отдельными слоями.",
    },
    worldguard: {
      title: "Настройка WorldGuard",
      paragraphs: ["WorldGuard — основная полноценная динамическая интеграция. ClaimShift регистрирует свои флаги и в режиме dynamic-passthrough временно управляет passthrough выбранных регионов.", "Регионы, которые уже существовали при первом обнаружении мира ClaimShift, записываются как старые/статичные и остаются обычными регионами WorldGuard. Новые подходящие регионы игроков, впервые созданные во время работы ClaimShift, по умолчанию становятся динамическими автоматически.", "Обычные изменения через /rg claim, /rg define, владельцев и флаги вызывают почти мгновенную синхронизацию ClaimShift. Регионы, созданные через API или другие плагины, всё равно будут найдены обычным периодическим reconcile."],
      enable: "/rg flag <region> claimshift-dynamic allow",
      disable: "/rg flag <region> claimshift-dynamic deny",
      selector: `integration:\n  worldguard:\n    mode: dynamic-passthrough\n    manage-all-owned-regions: false\n    auto-manage-new-regions: true\n    manage-existing-passthrough-regions: false\n    included-regions: []\n    excluded-regions:\n      - __global__`,
      lands: "Lands сейчас используется как опциональная overlay-интеграция и не равен полноценному динамическому открытию WorldGuard-региона.",
    },
    regions: {
      title: "Спавн, магазины и админские регионы",
      paragraphs: ["Админские регионы вообще не обязаны участвовать в ClaimShift. Спавн, ивент-зона или магазин могут навсегда остаться обычными регионами WorldGuard.", "Регионы без владельцев автоматически не становятся динамическими. Для явной гарантии поставьте claimshift-dynamic deny на территории, которые никогда не должны переключаться."],
      examples: ["/rg flag spawn claimshift-dynamic deny", "/rg flag shop claimshift-dynamic deny", "/rg flag player_base claimshift-dynamic allow"],
      bulk: "Если почти все регионы с владельцами — это приваты игроков, можно включить manage-all-owned-regions, а статичные зоны исключать флагами или паттернами.",
    },
    overrides: {
      title: "Настройки для конкретного региона",
      text: "Управляемый WorldGuard-регион может переопределить глобальную политику, обе задержки и Raid Sessions.",
      commands: ["/rg flag <region> claimshift-policy offline-open", "/rg flag <region> claimshift-active-delay 5m", "/rg flag <region> claimshift-inactive-delay 1h", "/rg flag <region> claimshift-raids allow", "/rg flag <region> claimshift-raids deny"],
      note: "claimshift-delay оставлен как совместимый алиас старой задержки неактивного владельца. Сам override политики или задержки не превращает старый/статичный регион в динамический — если нужно подключить именно старый регион, используйте claimshift-dynamic allow.",
    },
    rules: {
      title: "Правила защиты",
      text: "Каждую группу действий можно включать и выключать отдельно в rules.yml.",
      items: ["Ломание блоков", "Установка блоков", "Контейнеры", "Автоматика контейнеров", "Взаимодействия", "Урон сущностям", "Взаимодействие с сущностями", "Гриф сущностями", "Рамки/стойки и hanging entities", "Вёдра", "Взрывы", "Поршни", "Жидкости", "Огонь"],
      automation: "Для воронок, поршней, жидкостей, огня и другой автоматики ClaimShift старается не ломать нормальную работу внутри одного защищённого региона, но блокирует пересечение защищённых границ.",
    },
    raids: {
      title: "Raid Sessions",
      paragraphs: ["Raid Sessions опциональны и по умолчанию выключены. Если их включить, реальная активность против уже OPEN-региона может создать временный raid lock.", "Raid lock не даёт защите внезапно вернуться посреди активного рейда. Он заканчивается после бездействия или после жёсткого максимального времени."],
      config: `raids:\n  enabled: false\n  inactivity-timeout: 10m\n  maximum-duration: 30m\n  extend-on-activity: true\n  trigger-actions:\n    - block-break\n    - block-place\n    - containers\n    - interactions\n    - explosions`,
    },
    commands: {
      title: "Команды и права",
      commandList: ["/claimshift help", "/claimshift info", "/claimshift inspect", "/claimshift sync", "/claimshift reload", "/claimshift language <locale> [config|messages|both]", "/claimshift dryrun <on|off|status>"],
      alias: "Алиас: /cshift",
      permissions: ["claimshift.admin", "claimshift.reload", "claimshift.sync", "claimshift.info", "claimshift.inspect", "claimshift.language", "claimshift.dryrun", "claimshift.bypass"],
      bypass: "claimshift.admin специально не включает claimshift.bypass. Админ может проверить настоящую защиту, а не обходить её незаметно для себя.",
    },
    localization: {
      title: "Локализация",
      text: "Комментарии конфигов и сообщения могут использовать разные встроенные локали. Смена языка не сбрасывает остальные настроенные значения.",
      locales: ["en_US — English", "ru_RU — Русский", "de_DE — Deutsch", "es_ES — Español", "fr_FR — Français", "pl_PL — Polski", "pt_BR — Português do Brasil", "uk_UA — Українська", "zh_CN — 简体中文"],
      commands: "Исполняемые команды, подкоманды и аргументы config/messages/both никогда не переводятся. Локализуются только сообщения, описания, подписи и комментарии.",
    },
    metrics: {
      title: "bStats и телеметрия",
      text: "ClaimShift может отправлять анонимную статистику через bStats. Помимо стандартных данных bStats используются обезличенные параметры конфигурации: политика присутствия, provider, локаль и состояние некоторых функций.",
      no: "Custom charts ClaimShift не добавляют имена игроков, UUID, названия регионов или адрес сервера.",
      disable: `metrics:\n  enabled: false`,
      global: "Глобальное отключение bStats в plugins/bStats/config.yml также всегда учитывается.",
    },
    recovery: {
      title: "Runtime-безопасность и восстановление после краша",
      paragraphs: ["Когда ClaimShift временно меняет WorldGuard, он запоминает состояние, которое потом нужно вернуть. Recovery-метаданные хранятся в plugins/ClaimShift/runtime-worldguard.yml.", "При нормальном выключении, reload provider или запуске после аварийного завершения ClaimShift пытается безопасно восстановить исходное состояние WorldGuard."],
      warning: "Не редактируйте runtime-worldguard.yml на работающем сервере. Если сервер упал, пока регион был временно открыт, сначала запустите сервер с ClaimShift снова и только потом удаляйте плагин или вручную переписывайте такие регионы.",
    },
    troubleshooting: {
      title: "Решение проблем",
      items: [
        ["После установки ничего не меняется", "Проверьте dry-run. На чистой установке он специально только показывает решения, но ничего не применяет."],
        ["Приват игрока остаётся статичным", "Используйте /claimshift inspect и посмотрите «Источник управления». Регионы, существовавшие до ClaimShift, специально остаются старыми/статичными. Новые подходящие регионы подхватываются автоматически; старый регион можно включить через claimshift-dynamic allow."],
        ["Боюсь, что спавн станет рейдабельным", "Оставьте его без владельцев/статичным или явно поставьте claimshift-dynamic deny."],
        ["Игрок онлайн, но перестал считаться активным", "Smart Presence может пометить AFK/idle владельца неактивным. Проверьте idle-настройки и AFK-статус CMI/EssentialsX."],
        ["Reload отклонён", "Это защитное поведение. Исправьте некорректное значение — предыдущий рабочий конфиг остаётся активным."],
        ["На русском сервере команды всё равно английские", "Так и задумано. Синтаксис команд специально стабилен и не переводится."],
      ] as const,
      report: "Для нормального баг-репорта приложите /claimshift info, /claimshift inspect, шаги воспроизведения, нужную часть конфига и лог консоли. Перед публикацией удалите секреты.",
    },
  },
} as const;

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function CodeBlock({ children }: { children: string }) {
  return <pre className="wiki-code"><code>{children}</code></pre>;
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="wiki-section" id={id}><h2>{title}</h2>{children}</section>;
}

export default function WikiApp() {
  const { language } = useLanguage();
  const t = copy[language];
  const common = commonCopy[language];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.pageDescription);
  }, [t.pageTitle, t.pageDescription]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <main className="site wiki-site">
      <header className="header wiki-header">
        <a className="brand" href={SITE_PATHS.home}><BrandMark compact /><span>CLAIMSHIFT</span></a>
        <nav className="desktop-nav"><a href={SITE_PATHS.home}>{common.home}</a><a className="is-current" href={SITE_PATHS.wiki}>{common.wiki}</a><ExternalLink href={SITE_LINKS.modrinth}>Modrinth</ExternalLink></nav>
        <div className="header-actions"><LanguageSwitch compact /><ExternalLink href={SITE_LINKS.pluginRepository} className="header-github"><Github size={17} /> GitHub</ExternalLink><button className="menu-button" aria-label={common.menu} onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </header>

      <div className={`mobile-menu${menuOpen ? " mobile-menu--open" : ""}`}><nav><a href={SITE_PATHS.home}>{common.home}<span>01</span></a><a href={SITE_PATHS.wiki}>{common.wiki}<span>02</span></a><ExternalLink href={SITE_LINKS.modrinth}>Modrinth <ArrowUpRight size={18} /></ExternalLink><LanguageSwitch /></nav></div>

      <section className="wiki-hero">
        <div className="wiki-hero__grid" />
        <div className="wiki-hero__shell">
          <p className="eyebrow"><BookOpen size={15} /> {t.badge}</p>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <div className="wiki-hero__actions"><a href={SITE_PATHS.home} className="button button--ghost"><ArrowLeft size={17} /> {t.back}</a><ExternalLink href={SITE_LINKS.pluginRepository} className="button button--primary">{t.github} <Github size={17} /></ExternalLink></div>
        </div>
      </section>

      <div className="wiki-layout">
        <aside className="wiki-sidebar">
          <span>{t.navTitle}</span>
          <nav>{t.toc.map(([id, label]) => <a href={`#${id}`} key={id}>{label}<ChevronRight size={13} /></a>)}</nav>
        </aside>

        <article className="wiki-content">
          <DocSection id="overview" title={t.overview.title}>
            {t.overview.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <div className="wiki-callout wiki-callout--violet"><ShieldCheck size={20} /><div><strong>{t.overview.defaultTitle}</strong><ul>{t.overview.defaults.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
          </DocSection>

          <DocSection id="install" title={t.install.title}>
            <ol className="wiki-steps">{t.install.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
            <div className="wiki-callout"><CircleAlert size={20} /><p>{t.install.note}</p></div>
          </DocSection>

          <DocSection id="dryrun" title={t.dryrun.title}>
            {t.dryrun.paragraphs.map((p) => <p key={p}>{p}</p>)}<p><strong>{t.dryrun.ready}</strong></p><CodeBlock>{t.dryrun.commands.join("\n")}</CodeBlock>
          </DocSection>

          <DocSection id="states" title={t.states.title}>
            <div className="wiki-state-grid">{t.states.states.map(([state, text]) => <div key={state} className={`wiki-state wiki-state--${state.toLowerCase()}`}><strong>{state}</strong><p>{text}</p></div>)}</div>
            <h3>{t.states.offlineTitle}</h3><p>{t.states.offline}</p><h3>{t.states.onlineTitle}</h3><p>{t.states.online}</p><div className="wiki-callout wiki-callout--compact"><CheckCircle2 size={19} /><p>{t.states.zero}</p></div><CodeBlock>{t.states.config}</CodeBlock>
          </DocSection>

          <DocSection id="presence" title={t.presence.title}>
            {t.presence.paragraphs.map((p) => <p key={p}>{p}</p>)}<ul className="wiki-list">{t.presence.signals.map((item) => <li key={item}>{item}</li>)}</ul><CodeBlock>{t.presence.config}</CodeBlock><div className="wiki-callout"><CircleAlert size={20} /><p>{t.presence.caution}</p></div>
          </DocSection>

          <DocSection id="worldguard" title={t.worldguard.title}>
            {t.worldguard.paragraphs.map((p) => <p key={p}>{p}</p>)}<CodeBlock>{`${t.worldguard.enable}\n${t.worldguard.disable}`}</CodeBlock><CodeBlock>{t.worldguard.selector}</CodeBlock><p className="wiki-muted">{t.worldguard.lands}</p>
          </DocSection>

          <DocSection id="regions" title={t.regions.title}>
            {t.regions.paragraphs.map((p) => <p key={p}>{p}</p>)}<CodeBlock>{t.regions.examples.join("\n")}</CodeBlock><p>{t.regions.bulk}</p>
          </DocSection>

          <DocSection id="overrides" title={t.overrides.title}>
            <p>{t.overrides.text}</p><CodeBlock>{t.overrides.commands.join("\n")}</CodeBlock><div className="wiki-callout wiki-callout--compact"><CircleAlert size={19} /><p>{t.overrides.note}</p></div>
          </DocSection>

          <DocSection id="rules" title={t.rules.title}>
            <p>{t.rules.text}</p><div className="wiki-chip-grid">{t.rules.items.map((item) => <span key={item}>{item}</span>)}</div><p>{t.rules.automation}</p>
          </DocSection>

          <DocSection id="raids" title={t.raids.title}>
            {t.raids.paragraphs.map((p) => <p key={p}>{p}</p>)}<CodeBlock>{t.raids.config}</CodeBlock>
          </DocSection>

          <DocSection id="commands" title={t.commands.title}>
            <CodeBlock>{t.commands.commandList.join("\n")}</CodeBlock><p>{t.commands.alias}</p><div className="wiki-chip-grid wiki-chip-grid--code">{t.commands.permissions.map((permission) => <code key={permission}>{permission}</code>)}</div><div className="wiki-callout wiki-callout--violet"><Terminal size={20} /><p>{t.commands.bypass}</p></div>
          </DocSection>

          <DocSection id="localization" title={t.localization.title}>
            <p>{t.localization.text}</p><div className="wiki-chip-grid">{t.localization.locales.map((locale) => <span key={locale}>{locale}</span>)}</div><div className="wiki-callout wiki-callout--compact"><Code2 size={19} /><p>{t.localization.commands}</p></div>
          </DocSection>

          <DocSection id="metrics" title={t.metrics.title}>
            <p>{t.metrics.text}</p><p>{t.metrics.no}</p><CodeBlock>{t.metrics.disable}</CodeBlock><p>{t.metrics.global}</p><ExternalLink href={SITE_LINKS.bstats} className="wiki-external">bStats <ArrowUpRight size={15} /></ExternalLink>
          </DocSection>

          <DocSection id="recovery" title={t.recovery.title}>
            {t.recovery.paragraphs.map((p) => <p key={p}>{p}</p>)}<div className="wiki-callout wiki-callout--danger"><CircleAlert size={20} /><p>{t.recovery.warning}</p></div>
          </DocSection>

          <DocSection id="troubleshooting" title={t.troubleshooting.title}>
            <div className="troubleshooting-list">{t.troubleshooting.items.map(([problem, answer]) => <details key={problem}><summary>{problem}</summary><p>{answer}</p></details>)}</div><div className="wiki-callout wiki-callout--compact"><Github size={19} /><p>{t.troubleshooting.report}</p></div>
          </DocSection>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
