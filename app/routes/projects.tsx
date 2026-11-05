import { PageHero } from "../components/page";
import { pageMeta } from "../lib/seo";
export const meta=()=>pageMeta("Projects | Lumenet Labs","Verified project notes from Lumenet Labs, with planned work clearly separated from completed activity.","/projects");
export default function Projects(){return <main id="main-content"><PageHero eyebrow="Projects" title="Learning applied in the real world." intro="Project pages separate verified activity from planned work and never convert partner context into unearned impact claims."/><div className="program-list"><a className="program-item" href="/projects/ekya"><span>01</span><h2>Ekya</h2><p>An in-progress CAS project exploring responsible, practical AI support with an external foundation.</p><span>Read note</span></a></div></main>}
