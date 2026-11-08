let currentLang = "en";
let currentPatient = null;
let selectedModuleIdx = null;
let latestAssessmentResult = null;
let confirmedBooking = null;
let activeMediaStream = null;
let currentSelectedFile = null;

// --- 1. Registration & Session Management ---
async function handleRegistration(e) {
  e.preventDefault();
  const nameInput = document.getElementById("input-name");
  const ageInput = document.getElementById("input-age");
  const genderInput = document.getElementById("input-gender");
  const contactInput = document.getElementById("input-contact");

  const name = nameInput ? nameInput.value.trim() : "";
  const age = ageInput ? ageInput.value.trim() : "";
  const gender = genderInput ? genderInput.value : "Male";
  const contact = contactInput ? contactInput.value.trim() : "";

  if (!name || !contact) {
    alert(currentLang === "en" ? "Please fill in all required fields." : "कृपया सभी आवश्यक जानकारी भरें।");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("age", age);
  formData.append("gender", gender);
  formData.append("contact", contact);

  try {
    await API.registerPatient(formData);
  } catch (err) {
    console.error("Local registration sync error:", err);
  }

  currentPatient = { name, age, gender, contact };
  document.getElementById("section-login").classList.add("hidden");
  document.getElementById("section-dashboard").classList.remove("hidden");

  const badge = document.getElementById("patient-badge");
  badge.classList.remove("hidden");
  badge.classList.add("flex");
  document.getElementById("badge-patient-name").innerText = name;
  document.getElementById("banner-name").innerText = `${name} (${age}y)`;

  renderModulesGrid();
}

function logoutPatient() {
  currentPatient = null;
  selectedModuleIdx = null;
  latestAssessmentResult = null;
  confirmedBooking = null;

  document.getElementById("section-dashboard").classList.add("hidden");
  document.getElementById("section-login").classList.remove("hidden");
  const badge = document.getElementById("patient-badge");
  badge.classList.add("hidden");
  badge.classList.remove("flex");
  document.getElementById("test-container").classList.add("hidden");
  document.getElementById("results-container").classList.add("hidden");
}

// --- 2. Bilingual Language Switch ---
function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  const t = TRANSLATIONS[currentLang];

  document.getElementById("ui-app-title").innerText = t.appTitle;
  document.getElementById("ui-app-subtitle").innerText = t.appSubtitle;
  document.getElementById("lang-btn-text").innerText = t.langToggle;
  document.getElementById("t-login-heading").innerText = t.loginHeading;
  document.getElementById("t-login-sub").innerText = t.loginSub;
  document.getElementById("t-lbl-name").innerText = t.lblName;
  document.getElementById("t-lbl-age").innerText = t.lblAge;
  document.getElementById("t-lbl-gender").innerText = t.lblGender;
  document.getElementById("t-lbl-contact").innerText = t.lblContact;
  document.getElementById("t-btn-register").innerText = t.btnRegister;
  document.getElementById("t-greeting").innerText = t.greeting;
  document.getElementById("t-choose-instruction").innerText = t.chooseInstruction;
  document.getElementById("t-city-tag").innerText = t.cityTag;
  document.getElementById("t-modules-title").innerHTML = `<i class="fa-solid fa-stethoscope text-indigo-600"></i> ${t.modulesTitle}`;
  document.getElementById("t-symp-sub").innerText = t.sympSub;
  document.getElementById("t-btn-run-check").innerText = t.btnRunCheck;
  document.getElementById("t-img-sub").innerText = t.imgSub;
  document.getElementById("t-btn-upload").innerText = t.btnUpload;
  document.getElementById("t-cam-sub").innerText = t.camSub;
  document.getElementById("t-btn-scan-img").innerText = t.btnScanImg;
  document.getElementById("t-diag-report-title").innerText = t.diagReportTitle;
  document.getElementById("t-prob-label").innerText = t.probLabel;
  document.getElementById("t-expl-title").innerText = t.explTitle;
  document.getElementById("t-rem-title").innerHTML = `<i class="fa-solid fa-seedling"></i> ${t.remTitle}`;
  document.getElementById("t-btn-dl-report").innerText = t.btnDlReport;
  document.getElementById("t-doc-heading").innerHTML = `<i class="fa-solid fa-hospital text-indigo-600"></i> ${t.docHeading}`;
  document.getElementById("t-doc-sub").innerText = t.docSub;
  document.getElementById("t-btn-dl-slip").innerText = t.btnDlSlip;
  document.getElementById("t-ai-title").innerText = t.aiTitle;
  document.getElementById("t-ai-status").innerText = t.aiStatus;
  document.getElementById("t-ai-welcome").innerText = t.aiWelcome;
  document.getElementById("ai-chat-input").placeholder = t.aiPlaceholder;

  renderModulesGrid();
  if (selectedModuleIdx !== null) openModule(selectedModuleIdx);
}

// --- 3. Grid Rendering & Module Handling ---
function renderModulesGrid() {
  const grid = document.getElementById("modules-grid");
  if (!grid) return;
  grid.innerHTML = "";

  MODULES_DATA.forEach((mod, idx) => {
    const title = currentLang === "en" ? mod.titleEn : mod.titleHi;
    const desc = currentLang === "en" ? mod.descEn : mod.descHi;
    const isSelected = selectedModuleIdx === idx;

    const card = document.createElement("div");
    card.className = `card-touch cursor-pointer rounded-2xl p-4 border text-center flex flex-col items-center justify-center gap-2 transition bg-white ${
      isSelected ? "border-indigo-600 ring-2 ring-indigo-500 shadow-md" : "border-slate-100 hover:border-indigo-300 shadow-sm"
    }`;
    card.onclick = () => openModule(idx);

    card.innerHTML = `
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${mod.color}">
        <i class="fa-solid ${mod.icon}"></i>
      </div>
      <div>
        <h4 class="text-xs md:text-sm font-bold text-slate-800 leading-tight">${title}</h4>
        <p class="text-[10px] text-slate-400 mt-1 line-clamp-1">${desc}</p>
      </div>
      ${mod.isVisual ? `<span class="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Photo Scan</span>` : ""}
    `;
    grid.appendChild(card);
  });
}

function openModule(idx) {
  selectedModuleIdx = idx;
  renderModulesGrid();

  const mod = MODULES_DATA[idx];
  const title = currentLang === "en" ? mod.titleEn : mod.titleHi;
  const desc = currentLang === "en" ? mod.descEn : mod.descHi;

  document.getElementById("test-container").classList.remove("hidden");
  document.getElementById("results-container").classList.add("hidden");
  document.getElementById("active-mod-title").innerText = title;
  document.getElementById("active-mod-desc").innerText = desc;
  document.getElementById("active-mod-icon").innerHTML = `<i class="fa-solid ${mod.icon}"></i>`;

  if (mod.isVisual) {
    document.getElementById("panel-questions").classList.add("hidden");
    document.getElementById("panel-multimodal").classList.remove("hidden");
    document.getElementById("preview-box").classList.add("hidden");
  } else {
    document.getElementById("panel-questions").classList.remove("hidden");
    document.getElementById("panel-multimodal").classList.add("hidden");

    const qList = currentLang === "en" ? mod.questionsEn : mod.questionsHi;
    const qContainer = document.getElementById("questions-list");
    qContainer.innerHTML = "";

    qList.forEach((item, qIdx) => {
      const block = document.createElement("div");
      block.className = "bg-slate-50 p-3.5 rounded-2xl border border-slate-100";
      block.innerHTML = `
        <label class="block text-xs font-bold text-slate-700 mb-2">${item.q}</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${item.opts.map((opt, optIdx) => `
            <label class="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer text-xs font-medium hover:border-indigo-400">
              <input type="radio" name="q_${qIdx}" value="${optIdx}" ${optIdx === 0 ? "checked" : ""} class="text-indigo-600 focus:ring-indigo-500" />
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      `;
      qContainer.appendChild(block);
    });
  }

  document.getElementById("test-container").scrollIntoView({ behavior: "smooth" });
}

function closeActiveModule() {
  selectedModuleIdx = null;
  renderModulesGrid();
  document.getElementById("test-container").classList.add("hidden");
  document.getElementById("results-container").classList.add("hidden");
  stopCamera();
}

// --- 4. Clinical Analysis (Symptom & Visual) ---
async function evaluateSymptomModule() {
  const mod = MODULES_DATA[selectedModuleIdx];
  const qList = currentLang === "en" ? mod.questionsEn : mod.questionsHi;

  const answers = [];
  for (let i = 0; i < qList.length; i++) {
    const val = document.querySelector(`input[name="q_${i}"]:checked`)?.value || "0";
    answers.push(parseInt(val));
  }

  const formData = new FormData();
  formData.append("patient_name", currentPatient.name);
  formData.append("contact", currentPatient.contact);
  formData.append("disease_title", currentLang === "en" ? mod.titleEn : mod.titleHi);
  formData.append("answers_json", JSON.stringify(answers));
  formData.append("lang", currentLang);

  try {
    const data = await API.analyzeSymptoms(formData);
    showResults(data.risk, data.report, data.remedies);
  } catch (err) {
    alert("Analysis failed: " + err.message);
  }
}

function handleImageSelection(e) {
  const file = e.target.files[0];
  if (!file) return;
  currentSelectedFile = file;

  const reader = new FileReader();
  reader.onload = function(evt) {
    document.getElementById("image-preview").src = evt.target.result;
    document.getElementById("preview-box").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function startCamera() {
  const camBox = document.getElementById("cam-box");
  const video = document.getElementById("webcam-feed");
  camBox.classList.remove("hidden");
  camBox.classList.add("flex");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      activeMediaStream = stream;
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Camera unavailable: " + err.message);
      camBox.classList.add("hidden");
      camBox.classList.remove("flex");
    });
}

function stopCamera() {
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach(track => track.stop());
    activeMediaStream = null;
  }
  const camBox = document.getElementById("cam-box");
  camBox.classList.add("hidden");
  camBox.classList.remove("flex");
}

function captureCameraSnapshot() {
  const video = document.getElementById("webcam-feed");
  const canvas = document.getElementById("cv-canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    currentSelectedFile = new File([blob], "camera_snapshot.png", { type: "image/png" });
    document.getElementById("image-preview").src = canvas.toDataURL("image/png");
    document.getElementById("preview-box").classList.remove("hidden");
    stopCamera();
  }, "image/png");
}

async function evaluateVisualModule() {
  if (!currentSelectedFile) {
    alert("Please select or capture a photo first!");
    return;
  }

  const mod = MODULES_DATA[selectedModuleIdx];
  const formData = new FormData();
  formData.append("patient_name", currentPatient.name);
  formData.append("contact", currentPatient.contact);
  formData.append("module_id", mod.id);
  formData.append("disease_title", currentLang === "en" ? mod.titleEn : mod.titleHi);
  formData.append("lang", currentLang);
  formData.append("image", currentSelectedFile);

  try {
    const data = await API.analyzeVisual(formData);
    showResults(data.risk, data.report, data.remedies);
  } catch (err) {
    alert("Visual processing error: " + err.message);
  }
}

// --- 5. Assessment Results Display ---
async function showResults(risk, explanation, remedies) {
  latestAssessmentResult = {
    risk,
    explanation,
    remedies,
    module: MODULES_DATA[selectedModuleIdx],
    date: new Date().toLocaleString()
  };

  const resultsBox = document.getElementById("results-container");
  resultsBox.classList.remove("hidden");

  const t = TRANSLATIONS[currentLang];
  document.getElementById("risk-score-display").innerText = `${risk}%`;
  document.getElementById("risk-progress-bar").style.width = `${risk}%`;

  const riskPill = document.getElementById("risk-pill");
  const comment = document.getElementById("risk-badge-comment");

  if (risk >= 50) {
    riskPill.className = "px-4 py-1.5 rounded-full text-xs font-black uppercase bg-rose-100 text-rose-700";
    riskPill.innerText = currentLang === "en" ? "High Risk" : "अधिक जोखिम";
    comment.innerText = t.riskHigh;
    document.getElementById("risk-progress-bar").className = "h-full bg-rose-500 transition-all duration-700";
  } else {
    riskPill.className = "px-4 py-1.5 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-700";
    riskPill.innerText = currentLang === "en" ? "Low Risk" : "कम जोखिम";
    comment.innerText = t.riskLow;
    document.getElementById("risk-progress-bar").className = "h-full bg-emerald-500 transition-all duration-700";
  }

  document.getElementById("report-explanation").innerText = explanation;
  document.getElementById("report-remedies").innerText = remedies;

  await loadDoctors(latestAssessmentResult.module.specialist);
  resultsBox.scrollIntoView({ behavior: "smooth" });
}

// --- 6. Doctor Consultation & Appointments ---
async function loadDoctors(specialty) {
  const cityInput = document.getElementById("city-input");
  const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : "Dehradun";
  document.getElementById("badge-city-display").innerText = `City: ${city}`;

  const data = await API.getDoctors(specialty);
  const doctors = data.doctors || [];

  const listContainer = document.getElementById("doctors-list");
  listContainer.innerHTML = "";
  const t = TRANSLATIONS[currentLang];

  doctors.forEach((doc, dIdx) => {
    const card = document.createElement("div");
    card.className = "border rounded-2xl p-4 bg-slate-50 flex flex-col justify-between gap-3";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between">
          <h5 class="text-sm font-bold text-slate-900">${doc.name}</h5>
          <span class="text-xs font-black text-indigo-600">Rs. ${doc.fee}</span>
        </div>
        <p class="text-xs text-slate-500"><i class="fa-solid fa-hospital mr-1"></i> ${doc.hospital}, ${city}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-[11px] font-bold text-slate-600">${t.selectSlot}</label>
        <select id="slot_select_${dIdx}" class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none">
          ${doc.slots.map(s => `<option value="${s}">${s}</option>`).join("")}
        </select>
        <button onclick="bookSlot(${dIdx}, '${doc.name}', '${doc.hospital}', ${doc.fee})" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs shadow transition">
          ${t.btnBook} - ${doc.name.split(",")[0]}
        </button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

async function bookSlot(dIdx, docName, hospital, fee) {
  const cityInput = document.getElementById("city-input");
  const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : "Dehradun";
  const slotSelect = document.getElementById(`slot_select_${dIdx}`);
  const slot = slotSelect ? slotSelect.value : "11:00 AM";
  const mod = latestAssessmentResult ? latestAssessmentResult.module : { titleEn: "General Consultation", titleHi: "सामान्य परामर्श" };
  const bookingRef = "APT-" + Math.floor(100000 + Math.random() * 900000);

  confirmedBooking = {
    patient: currentPatient,
    doctor: { name: docName, hospital, fee },
    city,
    slot,
    moduleName: currentLang === "en" ? mod.titleEn : mod.titleHi,
    bookingRef,
    timestamp: new Date().toLocaleString()
  };

  const formData = new FormData();
  formData.append("booking_ref", bookingRef);
  formData.append("patient_name", currentPatient.name);
  formData.append("doctor_name", docName);
  formData.append("hospital", hospital);
  formData.append("slot_time", slot);
  formData.append("fee", fee);
  formData.append("city", city);

  try {
    await API.bookAppointment(formData);
  } catch (err) {
    console.error("Booking sync issue:", err);
  }

  const box = document.getElementById("booking-confirmation-box");
  box.classList.remove("hidden");
  document.getElementById("booking-details-text").innerText = `Confirmed with ${docName} at ${hospital} (${slot}).`;
  box.scrollIntoView({ behavior: "smooth" });
}

// --- 7. Download Triggers ---
function triggerMedicalReportDownload() {
  if (!currentPatient) {
    alert("Patient information not found. Please register first.");
    return;
  }
  if (!latestAssessmentResult) {
    alert("Please run a health assessment first before downloading the report.");
    return;
  }
  generateMedicalReportPDF(currentPatient, latestAssessmentResult);
}

function triggerAppointmentSlipDownload() {
  if (!confirmedBooking) {
    alert("Please book an appointment slot first before downloading the slip.");
    return;
  }
  generateAppointmentBillPDF(confirmedBooking);
}

// --- 8. AI Chatbot (Interactive Multi-Task Agent) ---
function toggleAIChat() {
  const drawer = document.getElementById("ai-chat-drawer");
  drawer.classList.toggle("hidden");
  if (!drawer.classList.contains("hidden")) {
    document.getElementById("ai-chat-input").focus();
    scrollChatToBottom();
  }
}

function sendQuickMessage(text) {
  document.getElementById("ai-chat-input").value = text;
  handleSendAIMessage(new Event("submit"));
}

function scrollChatToBottom() {
  const container = document.getElementById("chat-messages");
  if (container) {
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }
}

async function handleSendAIMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById("ai-chat-input");
  const msg = input ? input.value.trim() : "";
  if (!msg) return;

  const container = document.getElementById("chat-messages");

  // Render User Message
  const userBubble = document.createElement("div");
  userBubble.className = "flex justify-end";
  userBubble.innerHTML = `
    <div class="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-right font-medium max-w-[85%] shadow-sm text-xs">
      ${msg}
    </div>
  `;
  container.appendChild(userBubble);
  input.value = "";
  scrollChatToBottom();

  // Show Typing Indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "chat-typing-indicator";
  typingIndicator.className = "flex justify-start";
  typingIndicator.innerHTML = `
    <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 text-slate-400 font-medium text-xs flex items-center gap-1.5 shadow-sm">
      <i class="fa-solid fa-circle-notch fa-spin text-indigo-500"></i> Processing Clinical Options...
    </div>
  `;
  container.appendChild(typingIndicator);
  scrollChatToBottom();

  const cityInput = document.getElementById("city-input");
  const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : "Dehradun";

  const formData = new FormData();
  formData.append("message", msg);
  formData.append("lang", currentLang || "en");
  formData.append("patient_name", currentPatient?.name || "Guest");
  formData.append("patient_contact", currentPatient?.contact || "N/A");
  formData.append("patient_age", String(currentPatient?.age || ""));
  formData.append("patient_gender", currentPatient?.gender || "");
  formData.append("city", city);

  const modTitle = latestAssessmentResult?.module 
    ? (currentLang === "en" ? latestAssessmentResult.module.titleEn : latestAssessmentResult.module.titleHi) 
    : "";
  formData.append("latest_condition", modTitle || "");
  formData.append("latest_risk", String(latestAssessmentResult?.risk || ""));

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const indicator = document.getElementById("chat-typing-indicator");
    if (indicator) indicator.remove();

    const aiBubble = document.createElement("div");
    aiBubble.className = "flex justify-start flex-col gap-2";

    let dynamicControlsHtml = "";

    // OPTION 1: DEPARTMENT SELECTION MENU
    if (data.action === "DEPARTMENT_MENU" && data.payload?.departments) {
      dynamicControlsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          ${data.payload.departments.map(dept => `
            <button onclick="sendQuickMessage('Find ${dept.id} doctors in${city}')" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1.5 px-2.5 rounded-lg text-[10px] border border-indigo-200 transition">
              ${dept.label}
            </button>
          `).join("")}
        </div>
      `;
    }

    // OPTION 2: MULTI-DOCTOR & MULTI-SLOT DISPLAY
    if (data.action === "SHOW_DOCTORS" && data.payload?.doctors) {
      dynamicControlsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
          ${data.payload.doctors.map(d => `
            <div class="p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1.5">
              <div class="flex justify-between items-center text-[11px] font-bold text-slate-800">
                <span>${d.name}</span>
                <span class="text-indigo-600">₹${d.fee}</span>
              </div>
              <div class="text-[10px] text-slate-500">${d.hospital}</div>
              <div class="flex flex-wrap gap-1 mt-1">
                ${d.slots.map(slot => `
                  <button onclick="sendQuickMessage('Book ${d.name.split(',')[0]} at ${slot}')" class="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold px-2 py-0.5 rounded text-[10px] transition">
                    ⏰ ${slot}
                  </button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    // OPTION 3: MULTI-DISEASE EVALUATION MENU
    if (data.action === "DISEASE_MENU" && data.payload?.diseases) {
      dynamicControlsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          ${data.payload.diseases.map(dis => `
            <button onclick="sendQuickMessage('Explain risk for ${dis}')" class="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-1.5 px-2.5 rounded-lg text-[10px] border border-purple-200 transition">
              🔍 ${dis}
            </button>
          `).join("")}
        </div>
      `;
    }

    // OPTION 4: DIRECT BOOKING CONFIRMATION & SLIP DOWNLOAD
    if (data.action === "BOOKING_CONFIRMED" && data.payload) {
      confirmedBooking = data.payload;
      dynamicControlsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 flex gap-2">
          <button onclick="triggerAppointmentSlipDownload()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] shadow flex items-center gap-1.5 transition">
            <i class="fa-solid fa-file-pdf"></i> Download Appointment Slip
          </button>
        </div>
      `;
      const box = document.getElementById("booking-confirmation-box");
      if (box) {
        box.classList.remove("hidden");
        const detailsElem = document.getElementById("booking-details-text");
        if (detailsElem) {
          detailsElem.innerText = `Confirmed with ${data.payload.doctor.name} at ${data.payload.doctor.hospital} (${data.payload.slot}).`;
        }
      }
    }

    aiBubble.innerHTML = `
      <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 text-slate-800 leading-relaxed font-medium max-w-[92%] shadow-sm text-xs whitespace-pre-line">
        ${data.reply}
        ${dynamicControlsHtml}
      </div>
    `;
    container.appendChild(aiBubble);
    scrollChatToBottom();

  } catch (err) {
    console.error("Chat error:", err);
    const indicator = document.getElementById("chat-typing-indicator");
    if (indicator) indicator.remove();

    const errBubble = document.createElement("div");
    errBubble.className = "flex justify-start";
    errBubble.innerHTML = `
      <div class="bg-rose-50 text-rose-700 p-3 rounded-2xl rounded-tl-none border border-rose-100 font-medium text-xs">
        Server connection issue. Please verify backend is running on port 8000.
      </div>
    `;
    container.appendChild(errBubble);
    scrollChatToBottom();
  }
}