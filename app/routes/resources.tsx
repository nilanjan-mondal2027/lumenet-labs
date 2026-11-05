import { PageHero } from "../components/page";import { starterKits } from "../content/site";
import type { Route } from "./+types/resources";
import { pageMeta } from "../lib/seo";

export function meta({}: Route.MetaArgs) {
  return pageMeta("Resources | Lumenet Labs", "Original Lumenet Labs starter kits for practical and responsible AI use.", "/resources");
}

export default function Resources(){return <main id="main-content"><PageHero eyebrow="Open resources" title="Start with a method, not a tool list." intro="Original, printable Lumenet Labs resources for practical and responsible AI use."/><div className="resource-list">{starterKits.map((kit,i)=><a className="resource-item" key={kit.slug} href={`/resources/${kit.slug}`}><span>0{i+1}</span><h2>{kit.title}</h2><p>{kit.summary}</p><span>Open</span></a>)}</div></main>}
