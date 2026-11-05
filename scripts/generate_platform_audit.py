from pathlib import Path
from datetime import datetime
from PIL import Image as PILImage

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "Lumenet-Labs-Platform-Audit-2026-11-05.pdf"
SCREENSHOTS = ROOT / "output" / "visual-qa" / "v3"

INK = colors.HexColor("#0a0b09")
PAPER = colors.HexColor("#f3f0e7")
LIME = colors.HexColor("#d9ff3d")
MUTED = colors.HexColor("#66675f")
LINE = colors.HexColor("#c9c8bf")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, A4[0], 14 * mm, fill=1, stroke=0)
    canvas.setFillColor(LIME)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(16 * mm, 5.5 * mm, "LUMENET LABS / PLATFORM AUDIT")
    canvas.setFillColor(PAPER)
    canvas.drawRightString(A4[0] - 16 * mm, 5.5 * mm, f"05 NOV 2026 / {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7, leading=9, textColor=MUTED, spaceAfter=5, tracking=1.2))
styles.add(ParagraphStyle(name="Display", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=29, textColor=INK, spaceAfter=10))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=23, textColor=INK, spaceAfter=9))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=INK, spaceBefore=5, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=13, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.3, leading=10, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="TableHead", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7.1, leading=9, textColor=PAPER))
styles.add(ParagraphStyle(name="TableBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.1, leading=9.4, textColor=INK))


def heading(kicker, title, intro=None):
    items = [Paragraph(kicker.upper(), styles["Kicker"]), Paragraph(title, styles["H1x"])]
    if intro:
        items.append(Paragraph(intro, styles["Bodyx"]))
    return items


def screenshot(path, width):
    image = Image(str(path))
    image.drawWidth = width
    image.drawHeight = image.imageHeight * width / image.imageWidth
    return image


def cropped_screenshot(path, width, crop_height, name):
    source = PILImage.open(path).convert("RGB")
    cropped = source.crop((0, 0, source.width, min(crop_height, source.height)))
    target = Path("/tmp") / name
    cropped.save(target, optimize=True)
    return screenshot(target, width)


def audit_table(rows, widths=None):
    wrapped = []
    for row_index, row in enumerate(rows):
        style = styles["TableHead"] if row_index == 0 else styles["TableBody"]
        wrapped.append([cell if not isinstance(cell, str) else Paragraph(cell, style) for cell in row])
    table = Table(wrapped, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), PAPER),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.3),
        ("LEADING", (0, 0), (-1, -1), 10),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f5ef")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


story = []
story.extend([
    Spacer(1, 38 * mm),
    Paragraph("LUMENET LABS / RELEASE GATE", styles["Kicker"]),
    Paragraph("Complete Website Architecture & Component Audit", styles["Display"]),
    Paragraph("A source-backed review of the 2026 platform rebuild, registration system, privacy boundary, visual system, and deployment readiness.", styles["Bodyx"]),
    Spacer(1, 10 * mm),
    audit_table([
        ["Audit date", "Branch", "Health score", "Release state"],
        [datetime.now().strftime("%d %B %Y, %H:%M IST"), "feature/2026-platform-rebuild", "92 / 100", "Code complete; private preview blocked by expired Cloudflare authentication"],
    ], [38*mm, 48*mm, 32*mm, 60*mm]),
    Spacer(1, 65 * mm),
    Paragraph("Confidentiality boundary", styles["H2x"]),
    Paragraph("This document describes the implementation only. It does not reproduce private school correspondence, signatures, partner records, participant data, or unapproved achievements.", styles["Smallx"]),
    PageBreak(),
])

story.extend(heading("01 / Executive summary", "A lightweight learning platform with a real operations layer."))
story.append(audit_table([
    ["Area", "Status", "Evidence"],
    ["Frontend", "PASS", "Responsive React Router interface; no horizontal overflow at 390, 768, or 1440 pixels."],
    ["Registration", "PASS", "D1 persistence, unique public IDs, idempotency, guardian workflow, queue-backed email jobs, Excel and CSV exports."],
    ["Accessibility", "PASS", "Eight Playwright tests; axe critical and serious checks include colour contrast."],
    ["Security", "PASS WITH CONFIG", "No committed secrets found. CSP, HSTS, secure sessions, Turnstile, origin checks, and hashed rate-limit identifiers implemented."],
    ["SEO", "PASS", "Unique metadata, canonical URLs, sitemap, robots policy, and preserved Cloudflare Pages production origin."],
    ["Deployment", "BLOCKED EXTERNALLY", "Cloudflare CLI token expired. No production DNS or live site was modified."],
], [37*mm, 36*mm, 105*mm]))
story.append(Spacer(1, 7*mm))
story.append(Paragraph("Architecture", styles["H2x"]))
story.append(Paragraph("React Router 8 and TypeScript render on Cloudflare Workers. D1 stores registrations and consent records. Cloudflare Queues decouple email delivery. Resend is provider-ready but suppressed when no key is present. Public pages receive canonical metadata; operational routes are noindex and access controlled.", styles["Bodyx"]))
story.append(Paragraph("Hosting decision", styles["H2x"]))
story.append(Paragraph("Cloudflare was selected over Netlify for the rebuild because the current indexed production origin is already on Cloudflare Pages and the registration requirements benefit from a single D1, Queues, Turnstile, and Worker boundary. Netlify remains a documented static fallback, but it would add database and queue vendors for the same workflow.", styles["Bodyx"]))
story.append(PageBreak())

story.extend(heading("02 / Visual system", "Systems in Motion", "Selected after evaluating three complete directions: Systems in Motion, Human to Human, and Living Lab."))
story.append(cropped_screenshot(SCREENSHOTS / "home-1440.png", 176*mm, 980, "lumenet-audit-home-crop.png"))
story.append(Spacer(1, 5*mm))
story.append(audit_table([
    ["Decision", "Implementation"],
    ["Concept", "Beyond Answers is expressed as movement from prompts to workflows, systems, and outcomes."],
    ["Typography", "Bricolage Grotesque for editorial hierarchy; Source Sans 3 for readable body copy; both served locally."],
    ["Palette", "Near-black, paper, and acid-lime. No generic AI gradient or stock illustration layer."],
    ["Motion", "One lightweight canvas signal field with reduced-motion fallback. No scroll hijacking or autoplay media."],
    ["Visual QA", "Three screenshot rounds. Final score: 47 / 50. Initial hidden reveal gaps and registration spacing were fixed."],
], [44*mm, 134*mm]))
story.append(PageBreak())

story.extend(heading("03 / Global shell and homepage", "Component map and content audit"))
story.append(audit_table([
    ["Component and path", "Rendered content", "Health and action"],
    ["SiteHeader / app/components/site-shell.tsx", "Lumenet Labs; System; Programs; Resources; Project; About; Register", "Keyboard-accessible navigation. Accessible name now matches visible brand text."],
    ["HomeHero / app/routes/home.tsx", "Beyond answers. Register for 25 November. See the system.", "Canvas is decorative and reduced-motion safe. CTA appears early on mobile."],
    ["EvolutionSequence / app/routes/home.tsx", "Prompts; Workflows; Systems; Outcomes", "Semantic list-like sequence with strong scanning order and no dependency on animation."],
    ["Outputs / app/routes/home.tsx", "Research briefs; Study systems; Project workflows; Responsible use", "No invented metrics or partner claims."],
    ["EventPanel / app/routes/home.tsx", "Evolve with AI; 25 / 11 / 26", "Only confirmed date is public. Time, venue, delivery format, and fee remain explicitly unconfirmed."],
    ["SiteFooter / app/components/site-shell.tsx", "Privacy; Terms; Contact; Instagram", "Minimal footer with direct policy access."],
], [51*mm, 63*mm, 64*mm]))
story.append(PageBreak())

story.extend(heading("04 / Registration", "Minimal data, explicit consent, operational clarity"))
story.append(cropped_screenshot(SCREENSHOTS / "register-390.png", 48*mm, 900, "lumenet-audit-register-crop.png"))
story.append(Spacer(1, 4*mm))
story.append(audit_table([
    ["Block", "Exact purpose", "Implementation note"],
    ["Event facts", "25 November 2026; time and venue to be confirmed; guardian approval under 18", "Prevents invented operational certainty."],
    ["Participant fields", "Name, email, school or community, learner category, age band, optional interest", "Zod limits lengths and enum values server-side."],
    ["Consent", "Operational communication, privacy acknowledgement, optional marketing", "Marketing is separate and unchecked by default."],
    ["Abuse controls", "Honeypot, Turnstile, same-origin checks, salted IP hash rate limit", "Raw IP addresses are not stored in registration rows."],
    ["Persistence", "Unique public ID, idempotency key, active registration uniqueness", "D1 batch writes registration, guardian consent, and email job before queue publication."],
    ["Operations", "Authenticated dashboard, Excel and CSV export", "Exports neutralise spreadsheet formulas and use no-store responses."],
], [35*mm, 71*mm, 72*mm]))
story.append(PageBreak())

story.extend(heading("05 / Privacy and security", "Controls implemented before preview"))
story.append(audit_table([
    ["Control", "Result"],
    ["Secrets", "No current secret pattern, private key, personal email, or tracked real environment file found."],
    ["Sessions", "Eight-hour HttpOnly, Secure, SameSite Strict organizer cookie with HMAC verification."],
    ["Authorization", "Organizer dashboard and export require a valid signed session."],
    ["Guardian consent", "One-time random token stored only as SHA-256 hash; expiry enforced; successful completion no longer reuses the token."],
    ["Email safety", "Participant content is HTML-escaped; preview email sends are suppressed without a provider key."],
    ["Headers", "CSP, HSTS, frame denial, content-type protection, strict referrer policy, and restricted browser permissions."],
    ["Preview indexability", "Non-production Worker responses include X-Robots-Tag: noindex, nofollow."],
    ["Retention", "Documented schedule separates operational records, consent evidence, optional marketing consent, and diagnostics."],
], [49*mm, 129*mm]))
story.append(Spacer(1, 7*mm))
story.append(Paragraph("Privacy boundary", styles["H2x"]))
story.append(Paragraph("The public project note states that Ekya is in progress. It does not publish private CAS correspondence, signatures, partner records, participant data, unapproved logos, testimonials, or impact claims.", styles["Bodyx"]))
story.append(PageBreak())

story.extend(heading("06 / Release evidence", "Tests run and passed"))
story.append(audit_table([
    ["Gate", "Result", "Evidence"],
    ["TypeScript", "PASS", "Cloudflare type generation, React Router type generation, and tsc project build."],
    ["Unit tests", "PASS", "2 tests for CSV and XLSX formula neutralisation and workbook output."],
    ["Browser tests", "PASS", "8 Playwright tests for axe, mobile overflow, registration labels, guardian completion, and organizer redirect."],
    ["Accessibility", "PASS", "Axe critical and serious checks with colour contrast enabled on home, registration, privacy, and resources."],
    ["Production build", "PASS", "Client and Worker builds complete. Home route is 2.49 KB gzipped; shared client runtime is 69.76 KB gzipped."],
    ["Dependency audit", "PASS", "npm audit reports zero vulnerabilities."],
    ["Cloudflare package", "PASS", "Wrangler dry run reports approximately 219 KB gzipped upload before cached assets."],
    ["Registration smoke", "PASS", "A real local POST returned HTTP 302 with a unique public ID and confirmed D1 record."],
    ["Visual review", "PASS", "Final screenshots at 390, 768, and 1440 pixels show no overflow, clipping, or hidden sections."],
], [44*mm, 28*mm, 106*mm]))
story.append(Spacer(1, 8*mm))
story.append(Paragraph("Top three next steps", styles["H2x"]))
story.append(Paragraph("1. Reauthenticate Wrangler, create the preview D1 database and queues, set secrets, run remote migrations, and deploy the noindex preview.", styles["Bodyx"]))
story.append(Paragraph("2. Configure a verified Resend sender only after communication copy, school safeguarding requirements, and data controller responsibilities are approved.", styles["Bodyx"]))
story.append(Paragraph("3. Complete stakeholder review of time, venue, format, fee, facilitators, capacity, consent wording, and publication approval before any production DNS or indexed-site change.", styles["Bodyx"]))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=16*mm, leftMargin=16*mm, topMargin=16*mm, bottomMargin=22*mm, title="Lumenet Labs: Complete Website Architecture & Component Audit", author="Lumenet Labs")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
