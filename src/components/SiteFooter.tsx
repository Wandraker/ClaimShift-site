import { BrandMark } from "./BrandMark";
import { commonCopy, useLanguage } from "../i18n";
import { SITE_LINKS, SITE_PATHS } from "../site-config";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export function SiteFooter() {
  const { language } = useLanguage();
  const t = commonCopy[language];

  return (
    <footer className="footer">
      <a className="brand brand--footer" href={SITE_PATHS.home}><BrandMark compact /><span>CLAIMSHIFT</span></a>
      <nav>
        <a href={SITE_PATHS.wiki}>{t.wiki}</a>
        <ExternalLink href={SITE_LINKS.modrinth}>{t.modrinth}</ExternalLink>
        <ExternalLink href={SITE_LINKS.pluginRepository}>{t.source}</ExternalLink>
        <ExternalLink href={SITE_LINKS.issues}>{t.issues}</ExternalLink>
        <ExternalLink href={SITE_LINKS.websiteRepository}>{t.websiteSource}</ExternalLink>
      </nav>
      <p>{t.copyright}</p>
    </footer>
  );
}
