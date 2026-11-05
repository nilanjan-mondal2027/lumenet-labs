# Lumenet Labs Visual Redesign, 6 November 2026

## Objective
Build a visual front door for Lumenet Labs that makes practical AI education feel as considered as the systems it teaches, while preserving the existing secure registration platform and preview isolation.

## Reference Review
`Lumenet-Cinematic-V2-Fresh.html` successfully used a dark editorial canvas, an animated system graph, interface artefacts, moving typography, and course narrative pacing. Its weaknesses for the new platform are reliance on unapproved historic impact claims, a less mobile-focused interaction model, and visual moments that sometimes existed separately from a real user action.

The earlier platform preview retained the dark palette and copy accuracy, but lost the reference's diagrammatic visual rhythm, layered scene composition, and animated relationship between human intent and output. It also made the hero particle canvas too subtle to carry the page.

## Directions Evaluated

| Direction | Description | Distinction | Mobile resilience | Reuse | Decision |
| --- | --- | --- | --- | --- | --- |
| A. Cinematic Human and AI Collaboration | A stylised human scene moves from a real question to a concrete output. | Strong emotional entry and immediate educational meaning. | High using SVG and CSS transforms. | High for campaigns and explainers. | Selected as hero foundation. |
| B. Living Digital Laboratory | An interactive lab maps source checking, workflows, judgement, and delivery. | Makes Lumenet's method tangible. | High because controls are normal buttons, not scroll hijacking. | High for lessons and starter kits. | Selected as the interaction model. |
| C. Experimental Technology Studio | A dramatic gallery of abstract 3D objects and editorial transitions. | Visually striking but less specific to education. | Medium due GPU and complexity cost. | Medium. | Used only as restrained visual influence. |

## Selected Direction: Human Signal Lab
A hybrid of A and B. A learner's visible question moves through a live AI system map, becomes research and workflow, then resolves into an inspectable output. It is an original SVG scene with a timed four-state sequence and user controlled scene buttons. A second interactive workflow console lets visitors inspect the same method in real terms.

### Tokens
- `--ink: #0A0A0B` for depth and focus.
- `--paper: #FAFAF7` for readable editorial type.
- `--lime: #D9FF3D` for live signal and action.
- `--mist: #B4B7AE` for supporting copy.
- `--panel: #151716` for laboratory surfaces.
- `--gold: #C7A85B` for archive and status detail.

### Type
- Bricolage Grotesque is the display face, scaled with a 1.25 ratio and tightly tracked for the editorial title moments.
- Source Sans 3 remains the high legibility working face.
- Monospace is used only for live system labels and timecodes.

### Motion
The hero is the one orchestrated signature moment. Major sections use a short entrance reveal after becoming visible. Interactive cards have small tactile transforms. Motion stops when reduced motion is requested. No canvas, autoplay media, scroll lock, or dependency is introduced.

### Verified Copy Boundaries
No historic attendance figures, partner logos, unverified testimonials, private CAS material, or unapproved impact claims appear in this redesign. The Ekya project remains clearly labelled in progress.

## Quality Gates

### G0 Concept, pass
Premise: Lumenet turns a learner's question into a useful, reviewable system. The page's job is to make that transformation visible before asking for registration. The selected Human Signal Lab direction is more specific to practical AI education than abstract studio spectacle.

### G1 Structure, pass
The narrative is hero, signal, ecosystem, interactive method, starter kits, workshop, projects, connected venture, community, team, and registration. It was checked at 390px, 768px, and 1440px before decorative refinement.

### G2 Craft, pass after two loops
- v1 defect: observer-only reveals created blank regions in full document and low-scroll contexts. Fixed by rendering content by default and reserving motion for intentional hero and interaction states.
- v1 defect: programme metadata contrast was insufficient. Fixed by raising the quiet token to `#92968C`.
- v1 defect: hero scene tabs did not include their visible numbering in their accessible name. Fixed with visually-hidden, descriptive text while retaining the visible state number.
- v1 defect: mobile layout had a 42px horizontal overflow caused by the rotated community diagram and collapsed mobile menu contents. Fixed by clipping the visual composition and hiding the closed menu panel.
- v2 result: visual review at 390px, 768px, and 1440px shows no oversized empty regions, no horizontal overflow, legible calls to action, and a consistent editorial rhythm.

### G3 Technical verification, pass locally
- `npm run test:e2e`: 8 passed, including serious axe violations, mobile overflow, registration consent, and organizer redirect.
- `npm run typecheck`, `npm run test`, `npm run build`, and `npm run check:copy`: passed.
- Reduced-motion hero captured at 390px.
- Browser motion recording confirms the animated hero scene controls, workflow console, and page transition to AdQuadra.

Artifacts are versioned in `output/visual-redesign-v1`, `output/visual-redesign-v2`, and `output/visual-redesign-v3` and are intentionally excluded from the deployment bundle.
