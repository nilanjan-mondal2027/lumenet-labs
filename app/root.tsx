import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/source-sans-3";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { SiteFooter, SiteHeader } from "./components/site-shell";
import "./app.css";

export const links: Route.LinksFunction = () => [{ rel: "icon", href: "/favicon.ico" }];

export function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/><meta name="theme-color" content="#0a0b09"/><Meta/><Links/></head><body><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader/>{children}<SiteFooter/><ScrollRestoration/><Scripts/></body></html>;
}
export default function App() { return <Outlet/>; }
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return <main id="main-content" className="error-page"><p className="eyebrow">{notFound ? "404" : "System note"}</p><h1>{notFound ? "This route has moved." : "Something did not load."}</h1><p>{notFound ? "Return to the Lumenet Labs home page or continue to registration." : "Please try again. No registration data has been submitted from this screen."}</p><div className="button-row"><a className="button button-primary" href="/">Go home</a><a className="button button-quiet" href="/register">Register</a></div></main>;
}
