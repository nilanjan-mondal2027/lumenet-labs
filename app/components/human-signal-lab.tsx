import { useEffect, useMemo, useState } from "react";

const frames = [
  { id: "question", step: "01", label: "The question", copy: "A real goal enters the lab." },
  { id: "connect", step: "02", label: "The connection", copy: "Human judgement meets the right tools." },
  { id: "system", step: "03", label: "The system", copy: "Research and workflow take a usable shape." },
  { id: "outcome", step: "04", label: "The outcome", copy: "A practical result leaves with a human owner." },
] as const;

export function HumanSignalLab() {
  const [active, setActive] = useState(0);
  const reducedMotion = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % frames.length), 3800);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const current = frames[active];
  return <div className="human-signal-lab" data-scene={current.id} aria-label="An animated illustration of an idea becoming a practical AI system">
    <div className="lab-topline"><span>LIVE SYSTEM MAP</span><span>{current.step} / 04</span></div>
    <svg className="lab-illustration" viewBox="0 0 760 570" role="img" aria-labelledby="lab-title lab-description">
      <title id="lab-title">From question to useful outcome</title>
      <desc id="lab-description">A person sends an idea through an AI system that becomes research, workflow, and a useful outcome.</desc>
      <defs>
        <linearGradient id="lime-path" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#D9FF3D"/><stop offset="1" stopColor="#88a923"/></linearGradient>
        <radialGradient id="core-glow"><stop stopColor="#F4FFBA" stopOpacity=".9"/><stop offset=".42" stopColor="#D9FF3D" stopOpacity=".35"/><stop offset="1" stopColor="#D9FF3D" stopOpacity="0"/></radialGradient>
        <filter id="soft-glow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <g className="lab-grid" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <line key={`v-${index}`} x1={80 + index * 76} x2={80 + index * 76} y1="54" y2="520"/>) }
        {Array.from({ length: 7 }, (_, index) => <line key={`h-${index}`} x1="56" x2="704" y1={72 + index * 67} y2={72 + index * 67}/>) }
      </g>
      <ellipse className="core-aura" cx="418" cy="280" rx="152" ry="152" fill="url(#core-glow)"/>
      <g className="lab-human">
        <circle cx="170" cy="224" r="29" className="human-head"/>
        <path d="M137 290c8-44 24-67 36-67 21 0 42 26 47 67l14 105H118z" className="human-body"/>
        <path d="M143 344l-44 39M208 344l43 30" className="human-limb"/>
        <circle cx="89" cy="392" r="8" className="human-hand"/>
        <circle cx="259" cy="379" r="8" className="human-hand"/>
      </g>
      <g className="idea-card">
        <rect x="74" y="108" width="194" height="82" rx="10"/>
        <text x="96" y="141">I need a better</text><text x="96" y="166">way to research.</text>
        <circle cx="243" cy="134" r="9"/>
      </g>
      <path className="signal-route route-one" d="M266 150 C330 160 336 222 391 242"/>
      <path className="signal-route route-two" d="M258 378 C326 366 348 327 392 308"/>
      <g className="ai-core">
        <circle cx="418" cy="278" r="66" className="core-ring outer"/>
        <circle cx="418" cy="278" r="45" className="core-ring inner"/>
        <circle cx="418" cy="278" r="13" className="core-dot"/>
        <path d="M418 195v28M501 278h-29M418 361v-28M335 278h29" className="core-tick"/>
        <path d="M373 239l22 18m68-18l-22 18m22 61l-22-18m-68 18l22-18" className="core-tick"/>
      </g>
      <g className="system-nodes">
        <g className="system-node node-source"><rect x="506" y="122" width="156" height="64" rx="9"/><text x="526" y="150">SOURCE CHECK</text><text x="526" y="171">research</text></g>
        <g className="system-node node-flow"><rect x="536" y="247" width="156" height="64" rx="9"/><text x="556" y="275">WORKFLOW</text><text x="556" y="296">sequence</text></g>
        <g className="system-node node-review"><rect x="500" y="374" width="156" height="64" rx="9"/><text x="520" y="402">HUMAN REVIEW</text><text x="520" y="423">judgement</text></g>
      </g>
      <path className="output-route" d="M484 279 C514 279 514 279 536 279"/>
      <g className="outcome-window">
        <rect x="102" y="455" width="210" height="55" rx="9"/>
        <circle cx="129" cy="482" r="9"/>
        <text x="151" y="479">USEFUL OUTCOME</text><text x="151" y="497">brief / plan / project</text>
      </g>
      <path className="return-route" d="M510 410 C448 494 371 497 312 482"/>
      <g className="lab-particles" aria-hidden="true">
        {[[326,100],[355,167],[300,259],[479,102],[507,209],[476,412],[353,434],[607,214],[677,353],[278,472]].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 3 === 0 ? 4 : 2}/>) }
      </g>
    </svg>
    <div className="lab-caption"><div><span className="lab-caption-step">{current.step}</span><strong>{current.label}</strong><p>{current.copy}</p></div><div className="lab-controls" role="tablist" aria-label="Animation scenes">{frames.map((frame, index) => <button key={frame.id} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}><span>{frame.step}</span><span className="sr-only">Show {frame.label.toLowerCase()}</span></button>)}</div></div>
  </div>;
}
