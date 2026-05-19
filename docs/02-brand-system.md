# 1. Brand Personality
Confident, practical, student-aware, founder-friendly, globally understandable, and ethically responsible.

# 2. Visual Mood
Cinematic dark premium interface with intentional contrast, restrained gold authority accents, and subtle cyan intelligence glow.

# 3. Typography Recommendation
- Heading font: **Playfair Display** (Google Fonts)
- Body/UI font: **Manrope** (Google Fonts)
- Reason: premium editorial heading voice + high legibility body for mobile-first learning content.

# 4. Color Palette Table with HEX values and usage notes
| Token | HEX | Usage Notes |
|---|---|---|
| Background Base | `#060607` | Primary site background |
| Background Soft | `#0F1013` | Secondary sections/cards |
| Elevated Surface | `#14161A` | Cards, panel surfaces |
| Main Text | `#F4F5F7` | High-contrast body text |
| Secondary Text | `#CFD4DC` | Paragraph text |
| Muted Text | `#A1AAB8` | Microcopy and helper text |
| Metallic Gold | `#D4A84F` | Emphasis, key accents |
| Gold Highlight | `#F1C96B` | Headings, CTA highlights |
| Gold Deep | `#8B6122` | Gradient depth/shadows |
| AI Cyan | `#3ED3C9` | Secondary accent/glow |
| Soft Cyan | `#9DEEE7` | Link highlights and focus energy |
| Border Neutral | `#2A2D34` | Structural edges/dividers |

# 5. Gradient System
- Primary background: layered radial + linear dark cinematic gradients.
- Gold CTA gradient: `#8B6122 → #D4A84F → #F1C96B → #B98130`.
- Accent strip gradient: `#0F2F33 → #3ED3C9`.

# 6. Glow and Shadow System
- Gold glow: use only for high-emphasis interactions (CTA, key badge).
- Cyan glow: subtle pulse on decorative elements.
- Card shadows: deep soft black for depth, avoid oversized neon blur.

# 7. Button Styles
- Primary button: metallic gold gradient, dark text, rounded pill, strong focus ring.
- Secondary button: dark elevated background with cyan border.
- Hover style: tiny upward shift, no aggressive scaling.

# 8. Card Styles
- Dark elevated surface with gentle gold border tint.
- Medium-large radius for premium softness.
- Maintain readable contrast and generous spacing.

# 9. Icon and Illustration Style
- Use free line icons (e.g., Lucide SVG or Heroicons outline style).
- No cartoon mascots, no playful stickers.
- Keep icon strokes thin-clean with restrained glow.

# 10. Image and Poster Treatment
- Reference posters only for art direction; do not display outdated schedule posters in live UI.
- If poster gallery is added later, require updated date/time version first.
- Use dark overlays and soft vignette for visual consistency.

# 11. Accessibility Notes
- Maintain WCAG-minded contrast against dark backgrounds.
- Do not encode meaning with color only.
- Keep text readable at mobile sizes and zoom levels.

# 12. CSS Token Suggestions
```css
:root {
  --color-bg: #060607;
  --color-text: #f4f5f7;
  --color-gold: #d4a84f;
  --color-gold-strong: #f1c96b;
  --color-cyan: #3ed3c9;
  --font-heading: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
}
```
