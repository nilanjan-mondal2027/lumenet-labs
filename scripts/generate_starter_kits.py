from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.units import mm

OUT=Path('public/downloads'); OUT.mkdir(parents=True,exist_ok=True)
INK=HexColor('#0A0B09'); PAPER=HexColor('#F2F0E8'); ACID=HexColor('#D9FF3D'); MUTED=HexColor('#575A50'); LINE=HexColor('#C6C8BE')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='KitTitle',fontName='Helvetica-Bold',fontSize=27,leading=30,textColor=INK,spaceAfter=14))
styles.add(ParagraphStyle(name='KitH2',fontName='Helvetica-Bold',fontSize=16,leading=20,textColor=INK,spaceBefore=12,spaceAfter=8))
styles.add(ParagraphStyle(name='KitBody',fontName='Helvetica',fontSize=10.5,leading=16,textColor=MUTED,spaceAfter=8))
styles.add(ParagraphStyle(name='KitSmall',fontName='Helvetica',fontSize=8.5,leading=12,textColor=MUTED))
styles.add(ParagraphStyle(name='KitLabel',fontName='Helvetica-Bold',fontSize=8,leading=10,textColor=INK,spaceAfter=8))

def footer(canvas,doc):
    canvas.saveState(); w,h=A4
    canvas.setFillColor(INK); canvas.rect(0,0,w,15*mm,fill=1,stroke=0)
    canvas.setFillColor(ACID); canvas.setFont('Helvetica-Bold',8); canvas.drawString(18*mm,6*mm,'LUMENET LABS / BEYOND ANSWERS')
    canvas.setFillColor(PAPER); canvas.drawRightString(w-18*mm,6*mm,f'V1 / 05 NOV 2026 / {doc.page}')
    canvas.restoreState()

def callout(title,text):
    t=Table([[Paragraph(title,styles['KitLabel']),Paragraph(text,styles['KitBody'])]],colWidths=[42*mm,110*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),HexColor('#E6F7A3')),('BOX',(0,0),(-1,-1),.6,INK),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)])); return t

def checklist(items):
    rows=[[Paragraph('□',styles['KitBody']),Paragraph(item,styles['KitBody'])] for item in items]
    t=Table(rows,colWidths=[8*mm,145*mm]); t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.35,LINE),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)])); return t

def make(name,title,subtitle,pages):
    path=OUT/name; doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=20*mm,leftMargin=20*mm,topMargin=19*mm,bottomMargin=23*mm,title=title,author='Lumenet Labs')
    story=[Paragraph('LUMENET LABS / OPEN LEARNING KIT',styles['KitLabel']),Paragraph(title,styles['KitTitle']),Paragraph(subtitle,styles['KitBody']),Spacer(1,8),callout('HOW TO USE IT','Write directly on a printed copy or duplicate the prompts into your own notes. Synthetic examples are used. Do not paste confidential school, workplace, or personal data into AI tools.'),Spacer(1,14)]
    for idx,(heading,body,items) in enumerate(pages):
        if idx: story.append(PageBreak())
        story += [Paragraph(heading,styles['KitH2']),Paragraph(body,styles['KitBody']),Spacer(1,6),checklist(items)]
    story += [Spacer(1,18),Paragraph('This resource supports learning and reflection. It is not legal, medical, financial, or professional advice. Verify important decisions with an appropriate qualified person.',styles['KitSmall'])]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)

make('lumenet-practical-ai-starter-pack-v1.pdf','Practical AI Starter Pack','A compact system for moving from a question to a checked, useful output.',[
('1. Frame the work','Decide what success looks like before opening a tool.', ['What is the actual decision or deliverable?','Who will use the output?','What facts are known, uncertain, or missing?','What data must remain private?','What would make the output unsafe or misleading?']),
('2. Build the prompt system','Use a short sequence instead of one oversized prompt.', ['Context: explain the situation without confidential details.','Task: name one clear job.','Constraints: set length, format, sources, and exclusions.','Review: ask for assumptions and uncertainties.','Revision: improve one dimension at a time.']),
('3. Verify and deliver','Human review remains the final gate.', ['Check every material claim against a reliable source.','Remove unsupported confidence and invented citations.','Confirm the output follows school or workplace policy.','Record what you changed and why.','Deliver the final work in your own accountable voice.'])])
make('lumenet-research-to-brief-system-v1.pdf','Research to Brief System','A source-aware worksheet for turning scattered information into a clear brief.',[
('1. Research question','Narrow the topic until evidence can change your decision.', ['Write one decision-focused question.','List three sub-questions that would resolve uncertainty.','Define the date range and geography.','Note which voices or perspectives may be missing.','Set a stopping rule for research.']),
('2. Source ledger','Do not treat search results or AI summaries as evidence.', ['Record source title, publisher, date, and link.','Label primary, secondary, or opinion.','Capture the exact claim the source supports.','Check whether a newer source changes the picture.','Flag conflicts instead of hiding them.']),
('3. Decision brief','Separate evidence from recommendation.', ['One-sentence decision or recommendation.','Three strongest findings with source references.','Material uncertainty and limitations.','Risks, tradeoffs, and affected people.','Next action, owner, and review date.'])])
make('lumenet-responsible-ai-checklist-v1.pdf','Responsible AI Checklist','A final review for accuracy, privacy, fairness, attribution, and policy.',[
('1. Before use','Check whether AI is appropriate for the task.', ['I understand the rules that apply in my school, workplace, or project.','I have removed personal, confidential, and sensitive data.','I can explain why AI is being used.','I will not present generated work as evidence of an event or achievement.','A human remains accountable for the final decision.']),
('2. During use','Keep records that make review possible.', ['I can distinguish my input, source material, and generated output.','I have challenged assumptions and stereotypes.','I have asked for uncertainty, not artificial confidence.','I have not relied on invented citations or unverifiable claims.','I have paused if the task affects safety, rights, or high-stakes decisions.']),
('3. Before delivery','Treat output as a draft until verified.', ['Important claims are checked against reliable sources.','Attribution and copyright requirements are satisfied.','The final work is understandable without the AI conversation.','I can explain edits, limitations, and decisions.','The output helps the intended person without exposing anyone else.'])])
