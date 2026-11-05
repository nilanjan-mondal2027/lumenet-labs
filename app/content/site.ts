export const site = {
  name: "Lumenet Labs",
  url: "https://lumenet-labs.pages.dev",
  description: "Practical AI education for students who want systems, judgement, and useful outcomes.",
  registrationUrl: "/register",
  instagram: "https://www.instagram.com/lumenet_labs",
};

export const workshop = {
  id: "evolve-2026-11-25",
  dateISO: "2026-11-25",
  dateLabel: "25 November 2026",
  title: "Evolve with AI",
  status: "Registration open",
  detailNote: "Time, venue, delivery format, and session details will be communicated to confirmed participants.",
};

export const starterKits = [
  { slug: "practical-ai-starter-pack", title: "Practical AI Starter Pack", summary: "A compact method for asking better questions, checking output, and building a repeatable workflow.", file: "/downloads/lumenet-practical-ai-starter-pack-v1.pdf" },
  { slug: "research-to-brief-system", title: "Research to Brief System", summary: "A source-aware worksheet for moving from scattered research to a clear decision brief.", file: "/downloads/lumenet-research-to-brief-system-v1.pdf" },
  { slug: "responsible-ai-checklist", title: "Responsible AI Checklist", summary: "A practical review for accuracy, attribution, privacy, bias, and school policy.", file: "/downloads/lumenet-responsible-ai-checklist-v1.pdf" },
];

export const curriculum = [
  ["01", "Frame", "Turn a vague problem into a useful brief."],
  ["02", "Research", "Find, compare, and verify information before acting."],
  ["03", "Design", "Map a workflow that keeps human judgement in control."],
  ["04", "Build", "Create a practical output with the right tool for the job."],
  ["05", "Test", "Challenge assumptions, errors, and weak evidence."],
  ["06", "Refine", "Improve clarity, usefulness, and responsible use."],
  ["07", "Document", "Make the system understandable and repeatable."],
  ["08", "Deliver", "Present an outcome and a plan for what comes next."],
] as const;

export const publicRoutes = ["/", "/programs", "/programs/evolve-with-ai", "/workshops", "/workshops/2026-11-25", "/register", "/resources", "/projects", "/projects/ekya", "/community", "/about", "/contact", "/privacy", "/terms"];
