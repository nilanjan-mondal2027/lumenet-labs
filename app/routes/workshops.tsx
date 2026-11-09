import { PageHero, StatusTag } from "../components/page";import { workshop } from "../content/site";
import { pageMeta } from "../lib/seo";
export const meta=()=>pageMeta("Workshops | Lumenet Labs","Confirmed Lumenet Labs workshop dates and transparent operational status notes.","/workshops");
export default function Workshops(){return <main id="main-content"><PageHero eyebrow="Workshops" title="Live practice. Clear outputs." intro="Workshop pages publish only confirmed information. Details that are still being finalised are labelled clearly."/><div className="program-list"><a className="program-item" href="/workshops/2026-11-25"><span>01</span><h2>{workshop.title}</h2><p>{workshop.dateLabel}. {workshop.detailNote}</p><StatusTag>{workshop.status}</StatusTag></a></div></main>}
