import { PageHero } from "../components/page";
import { pageMeta } from "../lib/seo";
export const meta=()=>pageMeta("Page not found | Lumenet Labs","The requested page could not be found.","/",true);
export function loader(){throw new Response("Not found",{status:404})}
export default function NotFound(){return <main id="main-content"><PageHero eyebrow="404" title="This route has moved." intro="Return to the Lumenet Labs home page or continue to registration."/></main>}
