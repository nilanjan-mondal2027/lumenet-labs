# AdQuadra Benchmark and Lumenet Visual Gap Review

Date: 2026-11-06

## Method

The public AdQuadra homepage was inspected in Neo and captured from the live site at 1440px, 768px, and 390px. The local visual records are in `output/adquadra-benchmark-v1/` and are intentionally untracked.

This document records transferable principles only. It does not reproduce AdQuadra copy, implementation, layout, or assets.

## What AdQuadra Does Well

1. **One visual thesis per scroll chapter**: the opening field, philosophy field, and method field each make one visual claim with a controlled cluster of network nodes. The canvas is part of the composition, not a decorative background.
2. **Pacing through contrast**: generous dark space makes large type, a single gold action, and active points feel deliberate. Dense moments follow quiet moments instead of every section competing at the same intensity.
3. **Persistent system language**: the same visual grammar of fine lines, small labels, glows, and connection paths appears across the page. This makes the experience feel authored rather than assembled.
4. **Editorial hierarchy**: small utility text, decisive display type, and restrained body copy keep the eye path clear.
5. **Motion used as narrative support**: motion explains connection, process, and systems. It does not exist simply to make a card move.

## Current Lumenet Gap

| Dimension | AdQuadra observation | Previous Lumenet issue | Direction for this iteration |
| --- | --- | --- | --- |
| First impression | Full-viewport scene establishes a world before asking for action | Hero text and a boxed diagram split attention | A single learning transmission scene carries the first screen, with the CTA placed inside its visual hierarchy |
| Composition | Few large, intentional visual masses | Many similarly sized bordered panels | Use full-bleed fields, long editorial rails, and selective framed instruments |
| Motion | Connections communicate a method | Isolated routes and hover movement read as decoration | Sequence an idea into evidence, workflow, review, and a tangible outcome |
| Content rhythm | Dense technical cluster alternates with quiet narrative copy | Repeated grids create a uniform tempo | Use an asymmetric system atlas, a lab bench, and artifact spreads |
| Brand relationship | Product and visual world feel inseparable | Lime, cards, and circles can be swapped into another AI site | Build visuals from Lumenet materials: field notes, source trails, learning artefacts, review gates, and shared practice |
| Mobile | Content remains a deliberate composition | Previous visuals compress into stacked boxes | Reduce the film to a single readable route and retain one primary action per screen |

## Selected Direction: The Learning Transmission

Lumenet becomes a working research studio instead of a generic AI education page.

The signature visual is an animated transmission where a learner's initial prompt becomes a source trail, a repeatable workflow, a review gate, and an owned outcome. It is represented through original motion graphics, not stock imagery or copied source material.

The rest of the page treats resources as lab artefacts, workshops as active protocol entries, and projects as evidence cards with clearly marked status.

## Gates

- G0 Concept: pass. The page's job is to make an ambitious learner understand that Lumenet teaches AI systems, not tool tricks.
- G1 Structure: pass. The desktop, tablet, and mobile layouts preserve the same visual sequence while changing the density and layout mechanics for the available space.
- G2 Craft: pass. Two screenshot critique loops were completed at 1440px, 768px, and 390px. The interaction capture is `output/adquadra-lumenet-v4/video/lumenet-learning-transmission-loop2.webm`.
- G3 Finish: pending isolated preview deployment and authenticated live visual verification.

## Visual QA

| Rubric dimension | Loop 1 | Loop 2 |
| --- | ---: | ---: |
| Hierarchy | 5 | 5 |
| Typography | 4 | 4 |
| Color discipline | 5 | 5 |
| Spacing rhythm | 4 | 4 |
| Distinctiveness | 5 | 5 |
| Motion restraint | 4 | 5 |
| Detail finish | 4 | 4 |
| Responsive integrity | 3 | 5 |
| Accessibility | 4 | 4 |
| Copy quality | 5 | 5 |
| **Total** | **43 / 50** | **46 / 50** |

### Defects Found and Fixed

1. **Mobile signal section**: the later desktop grid declaration overrode an earlier mobile rule, leaving the headline in a narrow column and colliding with the supporting text. The final mobile rule now explicitly restores the signal section to one column at 700px and below.
2. **Hero positioning**: the original hero label did not carry the core positioning as directly as the rest of the page. It now introduces the visual story with `Beyond answers / Practical AI education`.
3. **Motion review**: the final interaction capture confirms the four hero chapters and the four-stage lab can be selected without browser console errors. The reduced-motion capture confirms the animated layers become stable without producing horizontal overflow.

## Validation Record

- `npm run check`: pass.
- `npm run test:e2e`: pass, including serious accessibility violations, mobile overflow, guardian consent, and organizer authentication checks.
- `npm audit --audit-level=high`: pass with zero vulnerabilities.
- Manual Playwright checks at 1440px, 768px, and 390px: no horizontal overflow.
