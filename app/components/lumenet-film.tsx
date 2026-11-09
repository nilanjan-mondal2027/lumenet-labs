import { useEffect, useMemo, useState } from "react";

const chapters = [
  { id: "spark", no: "01", title: "A real question", detail: "A learner brings a goal, not a blank prompt." },
  { id: "evidence", no: "02", title: "Evidence gathers", detail: "Research, context, and source checks take shape." },
  { id: "system", no: "03", title: "A method forms", detail: "Tools become a sequence that can be repeated." },
  { id: "outcome", no: "04", title: "Work leaves the lab", detail: "A useful, reviewable outcome stays with its human owner." },
] as const;

export function LumenetFilm() {
  const [active, setActive] = useState(0);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % chapters.length), 4400);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const chapter = chapters[active];

  return <section className="lumenet-film" data-chapter={chapter.id} aria-label="An animated visual story about a learner building an AI workflow">
    <div className="film-utility"><span>LEARNING TRANSMISSION</span><span>{chapter.no} / 04</span></div>
    <div className="film-aurora" aria-hidden="true"/>
    <svg className="film-art" viewBox="0 0 920 670" role="img" aria-labelledby="film-title film-desc">
      <title id="film-title">A question turns into a responsible AI workflow</title>
      <desc id="film-desc">An animated field of notes, sources, connected interfaces, and a practical output.</desc>
      <defs>
        <radialGradient id="filmBloom" cx="50%" cy="50%" r="52%"><stop stopColor="#f2ffae" stopOpacity=".98"/><stop offset=".35" stopColor="#d9ff3d" stopOpacity=".42"/><stop offset="1" stopColor="#d9ff3d" stopOpacity="0"/></radialGradient>
        <linearGradient id="filmStroke" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d9ff3d"/><stop offset=".5" stopColor="#fafaf7"/><stop offset="1" stopColor="#d9ff3d"/></linearGradient>
        <filter id="filmGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <g className="film-grid" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => <line key={`v-${index}`} x1={72 + index * 86} y1="52" x2={72 + index * 86} y2="620"/>)}
        {Array.from({ length: 8 }, (_, index) => <line key={`h-${index}`} x1="42" y1={65 + index * 76} x2="876" y2={65 + index * 76}/>)}
      </g>
      <g className="film-stars" aria-hidden="true">
        {[[100,102],[174,528],[268,77],[306,188],[385,570],[456,92],[545,523],[680,110],[780,218],[835,470],[731,578],[96,417]].map(([cx,cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 4 === 0 ? 4 : 2}/>) }
      </g>
      <g className="film-prompt">
        <rect x="78" y="147" width="236" height="176" rx="5"/>
        <path d="M102 205h122M102 232h161M102 259h132"/>
        <text x="103" y="179">QUESTION / 01</text>
        <text className="film-prompt-copy" x="102" y="300">How do I make</text>
        <text className="film-prompt-copy" x="102" y="320">this research useful?</text>
        <circle cx="279" cy="180" r="8"/>
      </g>
      <g className="film-learner" aria-hidden="true">
        <path d="M167 492c0-75 36-120 79-120 48 0 75 48 80 120"/>
        <circle cx="245" cy="347" r="31"/>
        <path d="M183 444l-71 47M306 444l68 25"/>
        <circle cx="106" cy="495" r="7"/><circle cx="380" cy="469" r="7"/>
      </g>
      <g className="film-source source-a"><rect x="415" y="114" width="154" height="86" rx="4"/><text x="435" y="145">SOURCE NOTE</text><path d="M435 165h94M435 180h62"/></g>
      <g className="film-source source-b"><rect x="486" y="235" width="168" height="94" rx="4"/><text x="506" y="267">CONTEXT MAP</text><path d="M506 287h105M506 303h72"/></g>
      <g className="film-source source-c"><rect x="398" y="372" width="166" height="92" rx="4"/><text x="418" y="404">CHECKPOINT</text><path d="M418 424h111M418 440h77"/></g>
      <g className="film-core">
        <circle cx="553" cy="338" r="126" fill="url(#filmBloom)" className="film-core-glow"/>
        <circle cx="553" cy="338" r="74" className="film-core-ring outer"/>
        <circle cx="553" cy="338" r="47" className="film-core-ring inner"/>
        <circle cx="553" cy="338" r="10" className="film-core-dot"/>
        <path d="M553 245v26M646 338h-26M553 431v-26M460 338h26M488 273l19 19M618 273l-19 19M618 403l-19-19M488 403l19-19"/>
      </g>
      <g className="film-routes" aria-hidden="true">
        <path className="route-prompt" d="M315 245C378 248 402 290 478 316"/>
        <path className="route-human" d="M381 468C432 443 449 407 487 374"/>
        <path className="route-source-a" d="M569 195C592 229 594 251 585 274"/>
        <path className="route-source-b" d="M654 285C628 300 621 314 618 331"/>
        <path className="route-source-c" d="M565 416C592 398 601 385 608 367"/>
      </g>
      <g className="film-output">
        <rect x="682" y="251" width="168" height="204" rx="6"/>
        <rect x="702" y="277" width="128" height="21" rx="2"/>
        <path d="M702 326h86M702 346h108M702 366h73M702 400h127"/>
        <rect x="702" y="414" width="74" height="16" rx="2"/>
        <text x="702" y="235">OWNED OUTPUT</text>
        <circle cx="812" cy="286" r="5"/>
      </g>
      <path className="route-output" d="M628 338C651 338 666 338 683 338"/>
      <g className="film-particles" aria-hidden="true">{[[351,128],[376,165],[448,226],[671,163],[698,364],[600,492],[531,544],[314,547],[454,515],[730,502],[828,158]].map(([cx,cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 3 === 0 ? 4 : 2}/>)}</g>
    </svg>
    <div className="film-caption"><div><span className="film-chapter-no">{chapter.no}</span><div><strong>{chapter.title}</strong><p>{chapter.detail}</p></div></div><div className="film-controls" role="tablist" aria-label="Learning transmission chapters">{chapters.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}><span>{item.no}</span><span className="sr-only">Show {item.title.toLowerCase()}</span></button>)}</div></div>
  </section>;
}
