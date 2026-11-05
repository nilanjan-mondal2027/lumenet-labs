import { useId, useState } from "react";

const stages = [
  { id: "brief", number: "01", label: "Frame the question", description: "Give the task a goal, a boundary, and a definition of useful before opening a tool.", output: "A working brief", detail: ["Define the real decision", "Name the evidence needed", "Keep a human owner"] },
  { id: "research", number: "02", label: "Build the source trail", description: "Gather evidence, annotate uncertainty, and expose the gaps before synthesis begins.", output: "A source map", detail: ["Find the original source", "Separate fact from inference", "Mark what still needs checking"] },
  { id: "workflow", number: "03", label: "Sequence the work", description: "Turn the task into a small sequence that can be repeated, inspected, and improved.", output: "A repeatable flow", detail: ["Use clear inputs", "Put review in the flow", "Document a useful pattern"] },
  { id: "review", number: "04", label: "Keep the judgement", description: "Check accuracy, privacy, and context before the result becomes an action or a claim.", output: "An owned outcome", detail: ["Verify the important parts", "Remove private details", "Explain the final choice"] },
] as const;

export function WorkflowConsole() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const stage = stages[active];

  return <section className="workflow-console" aria-labelledby="lab-console-title" data-stage={stage.id}>
    <div className="workflow-heading">
      <p className="eyebrow">Inside the lab</p>
      <h2 id="lab-console-title">A question becomes a system only when you can inspect every move.</h2>
      <p>Choose a stage to run a small version of Lumenet’s working method. Each step leaves a usable artefact, not a black box.</p>
    </div>
    <div className="workflow-bench">
      <div className="bench-rail" role="tablist" aria-label="Workflow stages">
        {stages.map((item, index) => <button key={item.id} type="button" role="tab" id={`stage-${item.id}`} aria-selected={active === index} aria-controls={panelId} onClick={() => setActive(index)}><span>{item.number}</span><b>{item.label}</b><i aria-hidden="true"/></button>)}
      </div>
      <div className="bench-stage" id={panelId} role="tabpanel" aria-labelledby={`stage-${stage.id}`}>
        <div className="bench-noise" aria-hidden="true"/>
        <div className="bench-window bench-window-a" aria-hidden="true"><span>INPUT</span><b>{active === 0 ? "question" : active === 1 ? "sources" : active === 2 ? "steps" : "review"}</b><i/></div>
        <div className="bench-bridge" aria-hidden="true"><i/><i/><i/><i/><i/></div>
        <div className="bench-window bench-window-b" aria-hidden="true"><span>OUTPUT</span><b>{stage.output}</b><i/></div>
        <div className="bench-copy"><p className="bench-label">STAGE {stage.number} / ACTIVE</p><h3>{stage.label}</h3><p>{stage.description}</p><ul>{stage.detail.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>
        <div className="bench-status" aria-live="polite"><span>PROCESS STABLE</span><b>{stage.output}</b></div>
      </div>
    </div>
  </section>;
}
