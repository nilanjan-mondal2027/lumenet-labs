const PRODUCTION_ORIGIN = "https://lumenet-labs.pages.dev";

export function pageMeta(title: string, description: string, path = "/", noIndex = false) {
  const canonical = new URL(path, PRODUCTION_ORIGIN).toString();
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { name: "twitter:card", content: "summary" },
    ...(noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
  ];
}
