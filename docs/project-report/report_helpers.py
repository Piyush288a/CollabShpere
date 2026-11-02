import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_element(name):
    return OxmlElement(name)

def set_cell_border(cell, **kwargs):
    """
    Set cell borders.
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='000000', space='0')
    """
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, val in edge_data.items():
                element.set(qn('w:{}'.format(key)), str(val))

def set_table_borders(table):
    """Applies clean single black borders to all cells in a table."""
    for row in table.rows:
        for cell in row.cells:
            set_cell_border(
                cell,
                top={"sz": 4, "val": "single", "color": "161311", "space": "0"},
                bottom={"sz": 4, "val": "single", "color": "161311", "space": "0"},
                left={"sz": 4, "val": "single", "color": "161311", "space": "0"},
                right={"sz": 4, "val": "single", "color": "161311", "space": "0"}
            )

def set_cell_background(cell, fill_color):
    """Sets cell background shading."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
    tcPr.append(shd)

def add_caption_above_table(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_caption_below_figure(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_figure_container(doc, figure_title, description, img_path=None):
    """Creates a thin-bordered container box containing either an embedded PNG or a text placeholder."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.0)
    set_cell_background(cell, "FAF8F5" if not img_path else "FFFFFF")
    set_cell_border(
        cell,
        top={"sz": 6, "val": "single", "color": "161311", "space": "0"},
        bottom={"sz": 6, "val": "single", "color": "161311", "space": "0"},
        left={"sz": 6, "val": "single", "color": "161311", "space": "0"},
        right={"sz": 6, "val": "single", "color": "161311", "space": "0"}
    )
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)

    if img_path and os.path.exists(img_path):
        run = p.add_run()
        run.add_picture(img_path, width=Inches(5.7))
    else:
        r1 = p.add_run(f"[{figure_title.upper()} PLACEHOLDER]\n")
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(0xFF, 0x5A, 0x36)
        
        r2 = p.add_run(description)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(10)
        r2.font.italic = True
        r2.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
        
        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.space_before = Pt(6)
        p2.paragraph_format.space_after = Pt(12)
        r3 = p2.add_run("(Awaiting genuine screenshot / asset insertion)")
        r3.font.name = 'Times New Roman'
        r3.font.size = Pt(9.5)
        r3.font.color.rgb = RGBColor(0x77, 0x77, 0x77)
    
    add_caption_below_figure(doc, figure_title)

def add_code_listing(doc, code_text, listing_title):
    """Creates a boxed monospace snippet listing."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.0)
    set_cell_background(cell, "F5F5F5")
    set_cell_border(
        cell,
        top={"sz": 4, "val": "single", "color": "CCCCCC", "space": "0"},
        bottom={"sz": 4, "val": "single", "color": "CCCCCC", "space": "0"},
        left={"sz": 4, "val": "single", "color": "CCCCCC", "space": "0"},
        right={"sz": 4, "val": "single", "color": "CCCCCC", "space": "0"}
    )
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(4)
    p_cap.paragraph_format.space_after = Pt(12)
    r_cap = p_cap.add_run(listing_title)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10.5)
    r_cap.font.bold = True

def add_heading_1(doc, text, page_break=True):
    if page_break:
        doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_body_paragraph(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p

def add_bullet_point(doc, text, symbol="●"):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.3
    
    r_sym = p.add_run(f"{symbol}  ")
    r_sym.font.name = 'Times New Roman'
    r_sym.font.size = Pt(10.5)
    r_sym.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0x16, 0x13, 0x11)
    return p
