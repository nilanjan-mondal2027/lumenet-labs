import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return <section className="page-hero"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{intro}</p>{children}</section>;
}
export function StatusTag({ children }: { children: ReactNode }) { return <span className="status-tag"><span aria-hidden="true"></span>{children}</span>; }
export function Callout({ title, children }: { title: string; children: ReactNode }) { return <aside className="callout"><p className="eyebrow">Note</p><h2>{title}</h2><div>{children}</div></aside>; }
