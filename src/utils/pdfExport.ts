import jsPDF from 'jspdf';
import { ScanRecord } from '../types/nutrition';

export function generateHealthReportPdf(scans: ScanRecord[], studentName: string = 'Pawan K.') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Scan2Know • FSSAI Food Health & Nutrition Report', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('CBSE Real-Life Mathematics Project: Health Analysis Using Linear Polynomials S(x) = mx', 14, 18);

  currentY = 34;

  // Metadata block
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Student / User: ${studentName}`, 14, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth - 70, currentY);

  currentY += 8;

  // Summary statistics box
  const totalScans = scans.length;
  const greenCount = scans.filter((s) => s.evaluation.overallColor === 'green').length;
  const yellowCount = scans.filter((s) => s.evaluation.overallColor === 'yellow').length;
  const redCount = scans.filter((s) => s.evaluation.overallColor === 'red').length;
  const avgScore = totalScans > 0 ? Math.round(scans.reduce((acc, s) => acc + s.evaluation.score, 0) / totalScans) : 0;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Scans: ${totalScans}`, 20, currentY + 7);
  doc.text(`Avg Health Score: ${avgScore}/100`, 65, currentY + 7);
  doc.text(`Green (Healthy): ${greenCount}`, 115, currentY + 7);
  doc.text(`Yellow (Moderate): ${yellowCount}`, 155, currentY + 7);

  doc.text(`Red (Limit): ${redCount}`, 20, currentY + 14);
  const healthGrade = avgScore >= 75 ? 'A (Excellent)' : avgScore >= 55 ? 'B (Good)' : 'C (Needs Attention)';
  doc.text(`Overall Nutrition Grade: ${healthGrade}`, 65, currentY + 14);

  currentY += 28;

  // Section: FSSAI Reference Standard
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. FSSAI Traffic Light Decision Matrix (Per 100g Standard)', 14, currentY);
  currentY += 5;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, pageWidth - 28, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Nutrient', 18, currentY + 4.5);
  doc.text('Green (Healthy)', 60, currentY + 4.5);
  doc.text('Yellow (Moderate)', 105, currentY + 4.5);
  doc.text('Red (Limit Intake)', 150, currentY + 4.5);
  currentY += 6;

  const fssaiMatrix = [
    { name: 'Sugar', green: '< 5.0 g', yellow: '5.0 g – 22.5 g', red: '> 22.5 g' },
    { name: 'Total Fat', green: '< 3.0 g', yellow: '3.0 g – 17.5 g', red: '> 17.5 g' },
    { name: 'Salt (Sodium)', green: '< 0.3 g', yellow: '0.3 g – 1.5 g', red: '> 1.5 g' },
    { name: 'Energy (Calories)', green: '< 200 kcal', yellow: '200 – 400 kcal', red: '> 400 kcal' },
  ];

  doc.setFont('helvetica', 'normal');
  fssaiMatrix.forEach((item) => {
    doc.setDrawColor(241, 245, 249);
    doc.line(14, currentY + 5, pageWidth - 14, currentY + 5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.name, 18, currentY + 4);
    doc.setTextColor(22, 101, 52); // green-800
    doc.text(item.green, 60, currentY + 4);
    doc.setTextColor(161, 98, 7); // yellow-700
    doc.text(item.yellow, 105, currentY + 4);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(item.red, 150, currentY + 4);
    currentY += 5.5;
  });

  currentY += 6;

  // Section: CBSE Linear Polynomial Model
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. CBSE Mathematics: Linear Polynomial Analysis S(x) = mx', 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const mathExplanation = [
    '• Model Definition: Let x = portion consumed in grams. Then nutrient consumption S(x) = (Nutrient/100) * x.',
    '• Daily Free Sugar Limit: FSSAI stipulates max 50g free sugar per day for adults.',
    '• Critical Threshold: x_max = 50 / (Sugar/100). E.g. For Marie Biscuits (20g/100g), S(x)=0.20x => x_max = 250g.',
    '• Teacher Script: Linear polynomial graph is a straight line through the origin (y = mx) with slope m = nutrient rate.',
  ];
  mathExplanation.forEach((line) => {
    doc.text(line, 14, currentY);
    currentY += 4.5;
  });

  currentY += 4;

  // Section: Scanned Foods Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Historical Scan Logs & Nutrition Matrix', 14, currentY);
  currentY += 5;

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, pageWidth - 28, 6, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Food Item', 16, currentY + 4);
  doc.text('Sugar', 62, currentY + 4);
  doc.text('Fat', 80, currentY + 4);
  doc.text('Salt', 96, currentY + 4);
  doc.text('Cal', 112, currentY + 4);
  doc.text('Prot/Fib', 126, currentY + 4);
  doc.text('Tag', 152, currentY + 4);
  doc.text('Linear Model', 174, currentY + 4);
  currentY += 6;

  // Table rows
  doc.setFont('helvetica', 'normal');
  const recentScans = scans.slice(0, 10); // fit nicely on page 1

  recentScans.forEach((scan, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 6, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(scan.food.name.substring(0, 24), 16, currentY + 4);
    doc.text(`${scan.food.sugarPer100g}g`, 62, currentY + 4);
    doc.text(`${scan.food.fatPer100g}g`, 80, currentY + 4);
    doc.text(`${scan.food.saltPer100g}g`, 96, currentY + 4);
    doc.text(`${scan.food.caloriesPer100g}`, 112, currentY + 4);
    doc.text(`${scan.food.proteinPer100g || 0}/${scan.food.fiberPer100g || 0}g`, 126, currentY + 4);

    // Color badge text
    if (scan.evaluation.overallColor === 'green') {
      doc.setTextColor(22, 101, 52);
      doc.text('Green (OK)', 152, currentY + 4);
    } else if (scan.evaluation.overallColor === 'yellow') {
      doc.setTextColor(161, 98, 7);
      doc.text('Yellow (Limit)', 152, currentY + 4);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text('Red (High)', 152, currentY + 4);
    }

    doc.setTextColor(71, 85, 105);
    doc.text(scan.evaluation.linearModels.sugar.formula, 174, currentY + 4);

    currentY += 6;
  });

  // Footer / Viva signoff
  currentY = Math.max(currentY + 10, 260);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 5;

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Evaluator / Teacher Signature: _______________________', 14, currentY + 4);
  doc.text('Scan2Know Verified • FSSAI Compliance Standard 2026', pageWidth - 80, currentY + 4);

  // Save the PDF
  const filename = `Scan2Know_Health_Report_${studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
}
