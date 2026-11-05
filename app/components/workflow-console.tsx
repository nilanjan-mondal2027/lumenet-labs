import { useId, useState } from "react";

const stages = [
  { id: "brief", number: "01", label: "Frame the brief", description: "Turn a fuzzy task into a goal, a boundary, and a definition of useful.", output: "Research brief", detail: ["Goal: compare two options", "Constraint: cite every source", "Owner: learner reviews final decision"] },
  { id: "research", number: "02", label: "Gather evidence", description: "Use AI to organise questions, not to replace the source trail.", output: "Source map", detail: ["Collect primary links", "Label uncertainty", "Flag gaps before synthesis"] },
  { id: "workflow", number: "03", label: "Build the flow", description: "Connect repeatable steps so the work can be checked and improved.", output: "Working sequence", detail: ["Input and evaluation steps", "Human decision checkpoints", "Reusable documentation"] },
  { id: "review", number: "04", label: "Review the output", description: "Test the result for accuracy, privacy, and whether it helps the original goal.", output: "Ready to use", detail: ["Verify key claims", "Remove private data", "Explain what changed"] },
] as const;

export function WorkflowConsole() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const stage = stages[active];
  return <section className="workflow-console" aria-labelledby="lab-console-title">
    <div className="workflow-title"><p className="eyebrow">Inside the lab</p><h2 id="lab-console-title">Try the method before you join it.</h2><p>Explore the four decisions behind a practical AI workflow. This is not a tool demo. It is the thinking structure behind the tool.</p></div>
    <div className="workflow-machine">
      <div className="workflow-tabs" role="tablist" aria-label="Workflow stages">{stages.map((item, index) => <button key={item.id} type="button" role="tab" id={`stage-${item.id}`} aria-selected={active === index} aria-controls={panelId} onClick={() => setActive(index)}><span>{item.number}</span>{item.label}</button>)}</div>
      <div className="workflow-screen" id={panelId} role="tabpanel" aria-labelledby={`stage-${stage.id}`}>
        <div className="screen-header"><span>WORKFLOW / {stage.number}</span><span className="screen-live">active</span></div>
        <div className="screen-content"><div><p className="screen-output">{stage.output}</p><h3>{stage.label}</h3><p>{stage.description}</p></div><ol>{stage.detail.map((line) => <li key={line}>{line}</li>)}</ol></div>
        <div className="screen-meter" aria-hidden="true"><span style={{ width: `${(active + 1) * 25}%` }}/></div>
      </div>
    </div>
  </section>;
}
