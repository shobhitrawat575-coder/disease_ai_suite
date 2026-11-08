// Native 2D Canvas to PDF Engine (Zero blank pages, direct local file download)
function canvasToDirectPDF(canvas, filename) {
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const base64Data = imgData.split(",")[1];
  const binaryImg = atob(base64Data);
  const imgLength = binaryImg.length;

  const pdfWidth = 595.28;
  const pdfHeight = 841.89;

  let pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 55 >>
stream
q
${pdfWidth} 0 0 ${pdfHeight} 0 0 cm
/Im1 Do
Q
endstream
endobj
5 0 obj
<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLength} >>
stream
`;

  const headerBytes = new TextEncoder().encode(pdfString);
  const imgBytes = new Uint8Array(imgLength);
  for (let i = 0; i < imgLength; i++) {
    imgBytes[i] = binaryImg.charCodeAt(i);
  }

  const footerString = `
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${480 + imgLength}
%%EOF`;

  const footerBytes = new TextEncoder().encode(footerString);
  const totalBlob = new Blob([headerBytes, imgBytes, footerBytes], { type: "application/pdf" });

  const downloadUrl = URL.createObjectURL(totalBlob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  }, 200);
}

// 1. Diagnostic Medical Report
function generateMedicalReportPDF(patient, assessment) {
  const cleanPatientName = (patient.name || "Patient").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  const modTitle = assessment.module?.titleEn || assessment.module?.titleHi || "General Health Screening";
  const isHigh = assessment.risk >= 50;

  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754; // A4 @ 150 DPI
  const ctx = canvas.getContext("2d");

  // White Canvas Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Indigo Accent Banner
  ctx.fillStyle = "#4f46e5";
  ctx.fillRect(60, 60, canvas.width - 120, 100);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("MEDICAL REPORT", 90, 115);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#e0e7ff";
  ctx.fillText("Patient Diagnostic Assessment Summary", 90, 142);

  ctx.font = "14px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`Date: ${assessment.date}`, canvas.width - 90, 112);
  ctx.fillText(`Record Ref: REC-${Math.floor(100000 + Math.random() * 900000)}`, canvas.width - 90, 138);
  ctx.textAlign = "left";

  let y = 200;

  // Section 1: Demographics Card
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("1. PATIENT DEMOGRAPHIC IDENTIFICATION", 60, y);
  y += 15;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, y, canvas.width - 120, 95);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, y, canvas.width - 120, 95);

  ctx.fillStyle = "#64748b";
  ctx.font = "15px sans-serif";
  ctx.fillText("Patient Name:", 85, y + 40);
  ctx.fillText("Age / Gender:", 640, y + 40);
  ctx.fillText("Contact ID:", 85, y + 75);
  ctx.fillText("Evaluation Engine:", 640, y + 75);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(patient.name, 210, y + 40);
  ctx.fillText(`${patient.age} Yrs / ${patient.gender}`, 760, y + 40);
  ctx.fillText(patient.contact, 210, y + 75);
  ctx.fillText("Digital Multi-Disease AI Suite", 780, y + 75);

  y += 135;

  // Section 2: Clinical Screening Assessment
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("2. CLINICAL SCREENING ASSESSMENT", 60, y);
  y += 15;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(60, y, canvas.width - 120, 110);
  ctx.strokeRect(60, y, canvas.width - 120, 110);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("CONDITION EVALUATED", 85, y + 40);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(modTitle, 85, y + 75);

  const badgeColor = isHigh ? "#dc2626" : "#16a34a";
  const badgeBg = isHigh ? "#fee2e2" : "#dcfce7";
  const statusStr = isHigh ? "ELEVATED RISK - CONSULT SPECIALIST" : "LOW RISK - CONSERVATIVE HOME CARE";

  ctx.textAlign = "right";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText(`${assessment.risk}%`, canvas.width - 85, y + 55);

  ctx.fillStyle = badgeBg;
  ctx.fillRect(canvas.width - 440, y + 68, 355, 30);
  ctx.strokeStyle = badgeColor;
  ctx.strokeRect(canvas.width - 440, y + 68, 355, 30);

  ctx.fillStyle = badgeColor;
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(statusStr, canvas.width - 262, y + 88);
  ctx.textAlign = "left";

  y += 150;

  // Section 3: Clinical Findings
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("3. CLINICAL OBSERVATIONS & FINDINGS", 60, y);
  y += 15;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, y, canvas.width - 120, 120);
  ctx.strokeStyle = "#e2e8f0";
  ctx.strokeRect(60, y, canvas.width - 120, 120);

  ctx.fillStyle = "#334155";
  ctx.font = "15px sans-serif";
  renderWrappedCanvasText(ctx, assessment.explanation, 85, y + 35, canvas.width - 170, 24);

  y += 160;

  // Section 4: Safe Everyday Care & Remedies
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("4. SAFE EVERYDAY CARE & PREVENTATIVE MEASURES", 60, y);
  y += 15;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, y, canvas.width - 120, 150);
  ctx.strokeRect(60, y, canvas.width - 120, 150);

  ctx.fillStyle = "#334155";
  ctx.font = "15px sans-serif";
  renderWrappedCanvasText(ctx, assessment.remedies, 85, y + 35, canvas.width - 170, 24);

  // Footer Notice
  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Notice: Preliminary AI triage report. Persistent symptoms warrant in-person correlation with a registered physician.",
    canvas.width / 2,
    canvas.height - 70
  );

  canvasToDirectPDF(canvas, `Medical_Report_${cleanPatientName}.pdf`);
}

// 2. Doctor Appointment Form & Bill
function generateAppointmentBillPDF(booking) {
  const cleanPatientName = (booking.patient?.name || "Patient").trim().replace(/[^a-zA-Z0-9_-]/g, "_");

  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Emerald Accent Banner
  ctx.fillStyle = "#10b981";
  ctx.fillRect(60, 60, canvas.width - 120, 100);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("APPOINTMENT FORM", 90, 115);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#d1fae5";
  ctx.fillText("Official Booking Slip & Consultation Receipt", 90, 142);

  ctx.font = "14px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`Booking Ref: ${booking.bookingRef}`, canvas.width - 90, 112);
  ctx.fillText(`Issued: ${booking.timestamp}`, canvas.width - 90, 138);
  ctx.textAlign = "left";

  let y = 200;

  const cardWidth = (canvas.width - 140) / 2;

  // Patient Card
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("PATIENT DETAILS", 60, y);

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, y + 15, cardWidth, 140);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, y + 15, cardWidth, 140);

  ctx.fillStyle = "#64748b";
  ctx.font = "15px sans-serif";
  ctx.fillText("Name:", 85, y + 55);
  ctx.fillText("Age / Gender:", 85, y + 88);
  ctx.fillText("Contact:", 85, y + 120);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(booking.patient.name, 195, y + 55);
  ctx.fillText(`${booking.patient.age} Yrs / ${booking.patient.gender}`, 195, y + 88);
  ctx.fillText(booking.patient.contact, 195, y + 120);

  // Logistics Card
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("CONSULTATION LOGISTICS", 60 + cardWidth + 20, y);

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60 + cardWidth + 20, y + 15, cardWidth, 140);
  ctx.strokeRect(60 + cardWidth + 20, y + 15, cardWidth, 140);

  const col2X = 60 + cardWidth + 45;
  ctx.fillStyle = "#64748b";
  ctx.font = "15px sans-serif";
  ctx.fillText("Specialist:", col2X, y + 55);
  ctx.fillText("Hospital:", col2X, y + 88);
  ctx.fillText("Allocated Slot:", col2X, y + 120);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(booking.doctor.name, col2X + 115, y + 55);
  ctx.fillText(`${booking.doctor.hospital}, ${booking.city}`, col2X + 115, y + 88);
  ctx.fillStyle = "#10b981";
  ctx.fillText(booking.slot, col2X + 115, y + 120);

  y += 200;

  // Invoice Table
  ctx.fillStyle = "#334155";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("ITEMIZED CONSULTATION INVOICE", 60, y);
  y += 15;

  const tableW = canvas.width - 120;
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(60, y, tableW, 45);
  ctx.strokeRect(60, y, tableW, 45);

  ctx.fillStyle = "#475569";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("Service Description", 85, y + 28);
  ctx.textAlign = "right";
  ctx.fillText("Amount (INR)", canvas.width - 85, y + 28);
  ctx.textAlign = "left";

  y += 45;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(60, y, tableW, 50);
  ctx.strokeRect(60, y, tableW, 50);
  ctx.fillStyle = "#334155";
  ctx.font = "15px sans-serif";
  ctx.fillText(`Specialist Consultation Fee (${booking.doctor.name})`, 85, y + 31);
  ctx.textAlign = "right";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(`Rs. ${booking.doctor.fee}.00`, canvas.width - 85, y + 31);
  ctx.textAlign = "left";

  y += 50;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(60, y, tableW, 50);
  ctx.strokeRect(60, y, tableW, 50);
  ctx.fillStyle = "#334155";
  ctx.font = "15px sans-serif";
  ctx.fillText("Automated AI Health Assessment & Record Maintenance", 85, y + 31);
  ctx.textAlign = "right";
  ctx.fillStyle = "#16a34a";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("Rs. 0.00 (Free)", canvas.width - 85, y + 31);
  ctx.textAlign = "left";

  y += 50;
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, y, tableW, 55);
  ctx.strokeRect(60, y, tableW, 55);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 17px sans-serif";
  ctx.fillText("Total Amount Payable at Hospital Desk", 85, y + 34);
  ctx.textAlign = "right";
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`Rs. ${booking.doctor.fee}.00`, canvas.width - 85, y + 34);
  ctx.textAlign = "left";

  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Please present this downloaded slip or your booking reference at the hospital reception 15 minutes prior to your allocated slot.",
    canvas.width / 2,
    canvas.height - 70
  );

  canvasToDirectPDF(canvas, `Appointment_Form_${cleanPatientName}.pdf`);
}

function renderWrappedCanvasText(ctx, text, x, startY, maxWidth, lineHeight) {
  if (!text) return;
  const lines = text.split("\n");
  let curY = startY;

  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split(" ");
    let curLine = "";

    for (let w = 0; w < words.length; w++) {
      const testLine = curLine + words[w] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && w > 0) {
        ctx.fillText(curLine.trim(), x, curY);
        curLine = words[w] + " ";
        curY += lineHeight;
      } else {
        curLine = testLine;
      }
    }
    if (curLine.trim()) {
      ctx.fillText(curLine.trim(), x, curY);
      curY += lineHeight;
    }
  }
}