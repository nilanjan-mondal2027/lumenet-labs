import { site } from "../content/site";
export function loader(){return new Response(`User-agent: *\nAllow: /\nDisallow: /organizer\nSitemap: ${site.url}/sitemap.xml\n`,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}
