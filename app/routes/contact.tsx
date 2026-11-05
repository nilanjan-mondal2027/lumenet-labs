import { PageHero } from "../components/page";import { site } from "../content/site";
import { pageMeta } from "../lib/seo";
export const meta=()=>pageMeta("Contact | Lumenet Labs","Contact Lumenet Labs for public updates and workshop registration.","/contact");
export default function Contact(){return <main id="main-content"><PageHero eyebrow="Contact" title="Start with the right channel." intro="For workshop questions, use the address in your registration confirmation. For public updates, follow Lumenet Labs on Instagram."><div className="button-row"><a className="button button-primary" href={site.instagram} target="_blank" rel="noreferrer">Open Instagram</a><a className="button button-quiet" href="/register">Register</a></div></PageHero></main>}
