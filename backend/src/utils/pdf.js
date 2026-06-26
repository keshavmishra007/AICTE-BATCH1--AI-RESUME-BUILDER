import PDFDocument from 'pdfkit';

function writeSection(doc, title, lines = []) {
  doc.moveDown(0.6).fontSize(14).fillColor('#111827').text(title, { underline: true });
  doc.moveDown(0.25).fontSize(10).fillColor('#374151');
  lines.filter(Boolean).forEach((line) => doc.text(`- ${line}`));
}

export function streamResumePdf(res, resume, profile) {
  const doc = new PDFDocument({ margin: 48 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="careerforge-resume.pdf"');
  doc.pipe(res);

  const personal = profile?.personal || {};
  const content = resume.content || {};
  doc.fontSize(22).fillColor('#111827').text(personal.fullName || 'CareerForge Resume');
  doc.fontSize(10).fillColor('#4b5563').text([personal.email, personal.phone, personal.location].filter(Boolean).join(' | '));
  doc.moveDown();
  doc.fontSize(11).fillColor('#111827').text(content.professional_summary || personal.summary || '');

  writeSection(doc, 'Technical Skills', content.technical_skills || profile?.skills || []);
  writeSection(doc, 'Projects', content.project_descriptions || []);
  writeSection(doc, 'Experience', content.experience || []);
  writeSection(doc, 'Achievements', content.achievements || profile?.achievements || []);
  doc.end();
}

export function streamCoverLetterPdf(res, letter) {
  const doc = new PDFDocument({ margin: 52 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="careerforge-cover-letter.pdf"');
  doc.pipe(res);
  doc.fontSize(18).fillColor('#111827').text(`${letter.jobRole || 'Cover Letter'} - ${letter.companyName || 'Company'}`);
  doc.moveDown().fontSize(11).fillColor('#374151').text(letter.content || '', { lineGap: 6 });
  doc.end();
}
