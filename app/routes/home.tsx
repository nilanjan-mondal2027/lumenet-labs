import type { Route } from "./+types/home";
import { HumanSignalLab } from "../components/human-signal-lab";
import { RevealController } from "../components/signal-field";
import { WorkflowConsole } from "../components/workflow-console";
import { starterKits, workshop } from "../content/site";
import { pageMeta } from "../lib/seo";

export function meta({}: Route.MetaArgs) {
  return pageMeta("Lumenet Labs | Beyond Answers", "Practical AI education that turns human questions into responsible systems and useful outcomes.");
}

const ecosystem = [
  ["01", "Education", "Practical learning experiences designed around a real output."],
  ["02", "AI systems", "Research, prompting, workflow design, and careful human review."],
  ["03", "AdQuadra", "A connected software venture exploring custom AI and digital solutions."],
  ["04", "Real work", "Projects, starter kits, and public learning artefacts that can be inspected."],
] as const;

const archive = [
  ["ACTIVE", "Evolve with AI", "A November workshop registration experience built around practical systems."],
  ["ARCHIVE REVIEW", "Prior programme record", "Historic programme materials are being reviewed before a public summary is published."],
  ["IN DEVELOPMENT", "School and community hub", "A participation space being developed with safeguarding and moderation in mind."],
] as const;

const projects = [
  ["IN PROGRESS", "Ekya Foundation CAS project", "A supervised project exploring where practical AI literacy may support community work without replacing human expertise.", "/projects/ekya"],
  ["PUBLISHED", "Lumenet starter kits", "Three original, printable resources for asking better questions, structuring research, and reviewing responsible use.", "/resources"],
  ["PLANNED", "Community learning hub", "A future space for collaboration that will be published after participation standards are approved.", "/community"],
] as const;

const team = [["Nilanjan Mondal", "Lumenet Labs team"], ["Shreyas Bhardwaj", "Lumenet Labs team"]] as const;

function Arrow() { return <span className="text-arrow" aria-hidden="true">↗</span>; }

export default function Home() {
  return <main id="main-content">
    <RevealController/>
    <section className="cinematic-hero" id="top">
      <div className="hero-orbit hero-orbit-a" aria-hidden="true"/><div className="hero-orbit hero-orbit-b" aria-hidden="true"/>
      <div className="hero-wrap">
        <div className="hero-copy">
          <p className="eyebrow reveal">Lumenet Labs / Practical AI education</p>
          <h1 className="hero-title"><span className="hero-title-line">Beyond</span><span className="hero-title-line hero-title-accent">answers.</span></h1>
          <p className="hero-lede">AI is only useful when it helps you think, build, and act with more clarity. Lumenet Labs teaches the system around the answer.</p>
          <div className="hero-actions"><a className="button button-primary" href="/register">Register for 25 November <Arrow/></a><a className="button button-quiet" href="#inside-lab">Explore the method</a></div>
          <div className="hero-facts" aria-label="Workshop facts"><span>25 November 2026</span><span>Registration open</span><span>Human judgement first</span></div>
        </div>
        <HumanSignalLab/>
      </div>
      <a className="hero-scroll" href="#signal"><span>Scroll to enter</span><i aria-hidden="true"/></a>
    </section>

    <section className="signal-section section-shell" id="signal">
      <div className="signal-copy reveal"><p className="eyebrow">The Lumenet signal</p><h2>AI is not the advantage. The system you build around it is.</h2></div>
      <div className="signal-notes reveal"><p>We work with learners who want structure over noise and outcomes over endless tool hopping.</p><p>Every session is designed to end with a usable artefact: a worksheet, a source map, a guided workflow, or an implementation asset.</p></div>
      <div className="principle-rail" aria-label="Lumenet principles"><span>Research carefully</span><span>Build visibly</span><span>Review honestly</span><span>Keep people in charge</span></div>
    </section>

    <section className="ecosystem-section section-shell" id="ecosystem">
      <div className="section-kicker reveal"><p className="eyebrow">The Lumenet ecosystem</p><p>One learning loop, connected to the work beyond it.</p></div>
      <div className="ecosystem-layout">
        <div className="ecosystem-map reveal" aria-hidden="true"><div className="map-core"><span>LL</span><small>signal</small></div>{ecosystem.map(([number, label]) => <div className={`map-point point-${number}`} key={number}><span>{number}</span><b>{label}</b></div>)}<svg viewBox="0 0 620 620"><path d="M310 310C174 238 163 165 120 120M310 310C460 229 493 151 513 118M310 310C440 375 484 462 508 506M310 310C175 393 157 465 112 506"/></svg></div>
        <div className="ecosystem-list">{ecosystem.map(([number, label, text]) => <article className="ecosystem-item reveal" key={number}><span>{number}</span><div><h3>{label}</h3><p>{text}</p></div><Arrow/></article>)}</div>
      </div>
    </section>

    <section className="lab-section section-shell" id="inside-lab"><WorkflowConsole/></section>

    <section className="kits-section section-shell" id="resources">
      <div className="section-header reveal"><div><p className="eyebrow">Free starter kits</p><h2>Useful before the first session.</h2></div><p>Original Lumenet resources for building a more useful AI practice today.</p></div>
      <div className="kit-grid">{starterKits.map((kit, index) => <article className={`kit-card kit-${index + 1} reveal`} key={kit.slug}><div className="kit-visual" aria-hidden="true"><span className="kit-code">0{index + 1}</span><div className="kit-paper"><i/><i/><i/><i/></div><div className="kit-orbit"/></div><div className="kit-content"><p className="kit-kind">Lumenet resource</p><h3>{kit.title}</h3><p>{kit.summary}</p><div className="kit-actions"><a href={kit.file} download>Download PDF <Arrow/></a><a className="kit-detail" href={`/resources/${kit.slug}`}>Details</a></div></div></article>)}</div>
    </section>

    <section className="programmes-section section-shell" id="programmes">
      <div className="programme-feature reveal"><div className="programme-visual" aria-hidden="true"><div className="date-window"><span>25</span><small>NOV</small><i>2026</i></div><div className="programme-pulse"/></div><div className="programme-copy"><p className="eyebrow">Upcoming workshop</p><h2>Evolve with AI</h2><p>Move from casual tool use to practical, reviewable systems for research, study, projects, and responsible execution.</p><dl><div><dt>Date</dt><dd>{workshop.dateLabel}</dd></div><div><dt>Status</dt><dd>{workshop.status}</dd></div></dl><div className="button-row"><a className="button button-primary" href="/register">Register now <Arrow/></a><a className="button button-quiet" href="/workshops/2026-11-25">Workshop note</a></div></div></div>
      <div className="archive-list">{archive.map(([status, title, text], index) => <article className="archive-item reveal" key={title}><span className={`archive-status status-${index}`}>{status}</span><h3>{title}</h3><p>{text}</p>{index === 0 ? <a href="/programs/evolve-with-ai">Explore program <Arrow/></a> : <span className="archive-note">Public detail pending review</span>}</article>)}</div>
    </section>

    <section className="projects-section section-shell" id="projects">
      <div className="section-header reveal"><div><p className="eyebrow">Projects and case studies</p><h2>Build in the open. Publish with care.</h2></div><p>We mark the state of work clearly. Plans are not outcomes, and private records never become public proof.</p></div>
      <div className="project-grid">{projects.map(([status, title, text, href], index) => <a className={`project-card project-${index + 1} reveal`} href={href} key={title}><div className="project-top"><span>{status}</span><span>0{index + 1}</span></div><div className="project-graphic" aria-hidden="true"><i/><i/><i/></div><div><h3>{title}</h3><p>{text}</p></div><Arrow/></a>)}</div>
    </section>

    <section className="adquadra-section section-shell" id="adquadra"><div className="adquadra-panel reveal"><div className="adquadra-wordmark"><span>ADQ</span><i>●</i><b>Custom AI and digital solutions</b></div><div><p className="eyebrow">Connected venture</p><h2>AdQuadra takes the work further.</h2><p>Where Lumenet makes practical AI learning accessible, AdQuadra explores applied software, AI workflows, and custom digital systems for real use cases.</p><a className="button button-paper" href="https://adquadra.com/" target="_blank" rel="noreferrer">Visit AdQuadra <Arrow/></a></div><div className="adquadra-graphic" aria-hidden="true"><span/><span/><span/><span/></div></div></section>

    <section className="community-section section-shell" id="community"><div className="community-panel reveal"><div><p className="eyebrow">School and community</p><h2>Bring careful experimentation into the room.</h2><p>We are developing a participation and collaboration hub for schools and communities that want practical AI literacy with clear standards.</p><a className="text-link" href="/community">Explore the community hub <Arrow/></a></div><div className="community-diagram" aria-hidden="true"><div className="diagram-room"><span>school</span><span>community</span><span>lab</span><span>project</span></div><p>Shared practice<br/>clear boundaries<br/>useful work</p></div></div></section>

    <section className="team-section section-shell" id="team"><div className="team-heading reveal"><p className="eyebrow">Our team</p><h2>Built by learners who care about the work after the answer.</h2></div><div className="team-grid">{team.map(([name, detail], index) => <article className="team-card reveal" key={name}><span>0{index + 1}</span><div className="team-monogram" aria-hidden="true">{name.split(" ").map((part) => part[0]).join("")}</div><h3>{name}</h3><p>{detail}</p></article>)}</div></section>

    <section className="final-section section-shell" id="join"><div className="final-orbit" aria-hidden="true"/><div className="final-content reveal"><p className="eyebrow">The next useful step</p><h2>Bring your question. Leave with a system.</h2><p>Register your interest for the 25 November workshop. We will share approved operational details with confirmed participants.</p><div className="button-row"><a className="button button-primary" href="/register">Register for 25 November <Arrow/></a><a className="button button-quiet" href="/contact">Talk to the team</a></div></div></section>
  </main>;
}
