import { NavLink } from "react-router";
import { site } from "../content/site";

const nav = [["Ecosystem", "/#ecosystem"], ["Inside the lab", "/#inside-lab"], ["Resources", "/#resources"], ["Projects", "/#projects"], ["Community", "/community"]] as const;

export function SiteHeader() {
  return <header className="site-header">
    <a className="brand" href="/" aria-label="Lumenet Labs home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><span>Lumenet Labs</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => href.startsWith("/#") ? <a key={href} href={href}>{label}</a> : <NavLink key={href} to={href}>{label}</NavLink>)}</nav>
    <a className="header-cta" href={site.registrationUrl}>Register <span aria-hidden="true">↗</span></a>
    <details className="mobile-menu"><summary aria-label="Open navigation"><span/><span/></summary><div>{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a className="mobile-register" href="/register">Register for 25 November <span aria-hidden="true">↗</span></a></div></details>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div><a className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><span>Lumenet Labs</span></a><p>Practical AI education built around judgement, systems, and useful work.</p></div><div className="footer-links"><a href="/#ecosystem">Ecosystem</a><a href="/resources">Starter kits</a><a href="/projects">Projects</a><a href="/community">Community</a></div><div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a><a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></div><p className="footer-note">© 2026 Lumenet Labs</p></footer>;
}
