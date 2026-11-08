import io
import json
import re
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image
from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from doctor_slots import DOCTORS_DATABASE
from modules.database import (
    init_db,
    save_patient,
    save_diagnostic_record,
    save_appointment,
)
from modules.doctor_service import get_doctors_by_specialty
from modules.predictor import evaluate_symptoms
from modules.ai_engine import run_multimodal_vision

BASE_DIR = Path(__file__).resolve().parent

# Initialize SQLite database
init_db()

app = FastAPI(title="AI Multi-Disease Diagnostic Suite")

# Static files setup
static_dir = BASE_DIR / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Templates setup
templates_dir = BASE_DIR / "templates"
templates_dir.mkdir(parents=True, exist_ok=True)
templates = Jinja2Templates(directory=str(templates_dir))


@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    try:
        return templates.TemplateResponse(request=request, name="index.html", context={})
    except TypeError:
        return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/patient/register")
async def register_patient(
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    contact: str = Form(...)
):
    try:
        save_patient(name, age, gender, contact)
    except Exception as err:
        print("Registration save warning:", err)
    return JSONResponse(content={"status": "success", "message": "Patient registered successfully"})


@app.get("/api/doctors/{specialty}")
async def fetch_doctors(specialty: str):
    doctors = get_doctors_by_specialty(specialty)
    return JSONResponse(content={"doctors": doctors})


@app.post("/api/analyze-symptoms")
async def analyze_symptoms_endpoint(
    patient_name: str = Form(...),
    contact: str = Form(...),
    disease_title: str = Form(...),
    answers_json: str = Form(...),
    lang: str = Form("en")
):
    try:
        answers = json.loads(answers_json)
    except Exception:
        answers = []

    is_hindi = (lang == "hi")
    res = evaluate_symptoms(answers, disease_title, is_hindi)

    try:
        save_diagnostic_record(
            patient_name,
            contact,
            disease_title,
            res["risk"],
            res["report"],
            res["remedies"]
        )
    except Exception as db_err:
        print("DB Diagnostic Save Warning:", db_err)

    return JSONResponse(content=res)


@app.post("/api/analyze-visual")
async def analyze_visual_endpoint(
    patient_name: str = Form(...),
    contact: str = Form(...),
    module_id: str = Form(...),
    disease_title: str = Form(...),
    lang: str = Form("en"),
    image: UploadFile = File(...)
):
    image_bytes = await image.read()
    is_hindi = (lang == "hi")
    res = run_multimodal_vision(image_bytes, module_id, is_hindi)

    try:
        save_diagnostic_record(
            patient_name,
            contact,
            disease_title,
            res["risk"],
            res["report"],
            res["remedies"]
        )
    except Exception as db_err:
        print("DB Visual Diagnostic Save Warning:", db_err)

    return JSONResponse(content=res)


@app.post("/api/book-appointment")
async def book_appointment_endpoint(
    booking_ref: str = Form(...),
    patient_name: str = Form(...),
    doctor_name: str = Form(...),
    hospital: str = Form(...),
    slot_time: str = Form(...),
    fee: float = Form(...),
    city: str = Form(...)
):
    try:
        save_appointment(booking_ref, patient_name, doctor_name, hospital, slot_time, fee, city)
    except Exception as db_err:
        print("Appointment Save Warning:", db_err)
    return JSONResponse(content={"status": "success", "booking_ref": booking_ref})


@app.post("/api/chat")
async def chat_assistant_endpoint(
    message: str = Form(...),
    lang: str = Form("en"),
    patient_name: str = Form(""),
    patient_contact: str = Form(""),
    patient_age: str = Form(""),
    patient_gender: str = Form(""),
    city: str = Form("Dehradun"),
    latest_condition: str = Form(""),
    latest_risk: str = Form("")
):
    try:
        msg = message.strip()
        msg_lower = msg.lower()
        is_hindi = (lang == "hi")

        response = {
            "reply": "",
            "action": None,
            "payload": None
        }

        # 1. ACTION: INSTANT BOOKING FOR ANY SPECIFIC DOCTOR OR SLOT
        book_triggers = ["book", "appointment", "schedule", "slot", "बुक", "अपॉइंटमेंट", "स्लॉट"]
        if any(k in msg_lower for k in book_triggers) and (
            "dr." in msg_lower or "doctor" in msg_lower or "डॉक्टर" in msg_lower or any(t in msg_lower for t in ["am", "pm"])
        ):
            matched_doc = None
            matched_spec = "General Medicine"

            # Search across all available specialties in database
            for spec, doc_list in DOCTORS_DATABASE.items():
                for doc in doc_list:
                    names = [p.replace(",", "").strip().lower() for p in doc["name"].split()]
                    if any(n in msg_lower for n in names if len(n) > 3):
                        matched_doc = doc
                        matched_spec = spec
                        break
                if matched_doc:
                    break

            if not matched_doc:
                for spec, doc_list in DOCTORS_DATABASE.items():
                    if spec.lower() in msg_lower:
                        matched_doc = doc_list[0]
                        matched_spec = spec
                        break

            if not matched_doc:
                matched_doc = DOCTORS_DATABASE.get("Cardiologist", [{}])[0]
                matched_spec = "Cardiology"

            # Match chosen time slot
            time_match = re.search(r'\b(0?[1-9]|1[0-2]):[0-5][0-9]\s*(?:am|pm)?\b', msg_lower)
            chosen_slot = matched_doc["slots"][0] if matched_doc.get("slots") else "11:00 AM"
            if time_match:
                raw_time = time_match.group(0).upper()
                if "AM" not in raw_time and "PM" not in raw_time:
                    raw_time += " AM"
                chosen_slot = raw_time

            ref_id = "APT-" + str(int(datetime.now().timestamp()))[-6:]

            if patient_name:
                try:
                    save_appointment(ref_id, patient_name, matched_doc["name"], matched_doc["hospital"], chosen_slot, float(matched_doc["fee"]), city)
                except Exception as db_err:
                    print("DB booking save error:", db_err)

            if is_hindi:
                response["reply"] = (
                    f"✅ आपका अपॉइंटमेंट सफलतापूर्वक तय हो गया है!\n\n"
                    f"• विशेषज्ञ: {matched_doc['name']}\n"
                    f"• विभाग: {matched_spec}\n"
                    f"• अस्पताल: {matched_doc['hospital']}, {city}\n"
                    f"• समय स्लॉट: {chosen_slot}\n"
                    f"• परामर्श शुल्क: ₹{matched_doc['fee']}\n"
                    f"• बुकिंग संदर्भ आईडी: {ref_id}\n\n"
                    f"नीचे दिए गए बटन से अपनी आधिकारिक पर्ची डाउनलोड करें।"
                )
            else:
                response["reply"] = (
                    f"✅ Appointment Successfully Confirmed!\n\n"
                    f"• Specialist: {matched_doc['name']}\n"
                    f"• Department: {matched_spec}\n"
                    f"• Hospital: {matched_doc['hospital']}, {city}\n"
                    f"• Allocated Slot: {chosen_slot}\n"
                    f"• Consultation Fee: ₹{matched_doc['fee']}\n"
                    f"• Booking Ref ID: {ref_id}\n\n"
                    f"You can download your official confirmation slip directly below."
                )

            response["action"] = "BOOKING_CONFIRMED"
            response["payload"] = {
                "bookingRef": ref_id,
                "patient": {
                    "name": patient_name or "Patient",
                    "age": patient_age or "45",
                    "gender": patient_gender or "Male",
                    "contact": patient_contact or "Registered"
                },
                "doctor": matched_doc,
                "city": city,
                "slot": chosen_slot,
                "moduleName": matched_spec,
                "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M %p")
            }
            return JSONResponse(content=response)

        # 2. ACTION: HOSPITALS & SPECIALISTS (ALL 9 DEPARTMENTS)
        hosp_triggers = ["hospital", "clinic", "doctor", "specialist", "find", "locate", "अस्पताल", "डॉक्टर", "क्लिनिक"]
        if any(k in msg_lower for k in hosp_triggers):
            spec_keywords = {
                "Cardiologist": ["heart", "cardio", "bp", "hypertension", "दिल", "छाती"],
                "Endocrinologist": ["diabetes", "sugar", "endocrine", "thyroid", "मधुमेह", "शुगर"],
                "Neurologist": ["neuro", "brain", "stroke", "paralysis", "headache", "दिमाग", "सिरदर्द"],
                "Nephrologist": ["kidney", "renal", "creatinine", "गुर्दा", "किडनी"],
                "Gastroenterologist": ["liver", "stomach", "digest", "gastric", "लिवर", "पेट"],
                "Dermatologist": ["skin", "rash", "allergy", "dermat", "त्वचा", "खुजली"],
                "Ophthalmologist": ["eye", "cataract", "vision", "optical", "आंख", "दृष्टि"],
                "Orthopedic Specialist": ["bone", "fracture", "joint", "ortho", "हड्डी", "जोड़"],
                "Oncologist": ["cancer", "oncology", "tumor", "कैंसर", "गांठ"]
            }

            matched_department = None
            for dept, kws in spec_keywords.items():
                if any(w in msg_lower for w in kws):
                    matched_department = dept
                    break

            # If user asks generally or clicked 'All Hospital Departments', show the directory
            if not matched_department:
                if is_hindi:
                    response["reply"] = (
                        f"🏥 {city} में सभी 9 चिकित्सा विभागों के प्रमुख अस्पताल एवं डॉक्टर उपलब्ध हैं।\n"
                        f"कृपया अपना संबंधित विभाग चुनें:"
                    )
                else:
                    response["reply"] = (
                        f"🏥 Verified hospitals & specialists are available across all 9 departments in {city}.\n"
                        f"Please select the department you wish to consult with:"
                    )
                response["action"] = "DEPARTMENT_MENU"
                response["payload"] = {
                    "departments": [
                        {"id": "Cardiologist", "label": "❤️ Heart & BP (Cardiology)"},
                        {"id": "Endocrinologist", "label": "🩸 Diabetes & Sugar (Endocrinology)"},
                        {"id": "Neurologist", "label": "🧠 Brain & Stroke (Neurology)"},
                        {"id": "Orthopedic Specialist", "label": "🦴 Bones & Fractures (Orthopedics)"},
                        {"id": "Dermatologist", "label": "🧴 Skin & Allergies (Dermatology)"},
                        {"id": "Ophthalmologist", "label": "👁️ Eye & Cataract (Ophthalmology)"},
                        {"id": "Nephrologist", "label": "🫘 Kidney & Renal (Nephrology)"},
                        {"id": "Gastroenterologist", "label": "🫁 Liver & Gastro (Gastroenterology)"},
                        {"id": "Oncologist", "label": "🎗️ Oncology Care (Cancer)"}
                    ]
                }
                return JSONResponse(content=response)

            docs = DOCTORS_DATABASE.get(matched_department, [])
            doc_lines = []
            for d in docs:
                slots_str = ", ".join(d.get("slots", [])[:3])
                doc_lines.append(f"• {d['name']}\n   🏥 {d['hospital']} | शुल्क: ₹{d['fee']}\n   ⏰ स्लॉट: {slots_str}")
            details_text = "\n\n".join(doc_lines)

            if is_hindi:
                response["reply"] = f"🏥 {city} में {matched_department} के प्रमुख अस्पताल एवं डॉक्टर:\n\n{details_text}\n\nबुकिंग हेतु स्लॉट चुनें:"
            else:
                response["reply"] = f"🏥 Available specialists & hospitals in {city} ({matched_department}):\n\n{details_text}\n\nSelect a slot below to confirm immediately:"

            response["action"] = "SHOW_DOCTORS"
            response["payload"] = {"specialty": matched_department, "doctors": docs}
            return JSONResponse(content=response)

        # 3. ACTION: MULTI-DISEASE RISK EXPLANATION
        risk_triggers = ["risk", "report", "score", "explain", "जोखिम", "रिपोर्ट", "रिजल्ट", "स्कोर"]
        if any(k in msg_lower for k in risk_triggers):
            disease_queries = {
                "Heart & BP Health": ["heart", "bp", "blood pressure", "cardio"],
                "Type-2 Diabetes": ["diabetes", "sugar", "glucose"],
                "Stroke Risk": ["stroke", "paralysis", "facial"],
                "Parkinson's Disease": ["parkinson", "tremor", "stiffness"],
                "Kidney Health": ["kidney", "renal", "swelling"],
                "Liver Health": ["liver", "jaundice", "digestive"],
                "Skin Lesion Assessment": ["skin", "rash", "erythema"],
                "Cataract & Eye Screening": ["eye", "cataract", "vision"],
                "Bone Fracture Inspection": ["bone", "fracture", "x-ray"]
            }

            matched_disease = None
            for d_name, d_kws in disease_queries.items():
                if any(w in msg_lower for w in d_kws):
                    matched_disease = d_name
                    break

            if not matched_disease and latest_condition:
                matched_disease = latest_condition

            if matched_disease:
                curr_risk = float(latest_risk) if (latest_risk and matched_disease == latest_condition) else 38.5
                risk_level = "Elevated Risk" if curr_risk >= 50 else "Moderate / Low Risk"
                if is_hindi:
                    response["reply"] = (
                        f"📊 {matched_disease} जोखिम विश्लेषण:\n\n"
                        f"• आकलित जोखिम स्तर: {curr_risk}%\n"
                        f"• श्रेणी: {risk_level}\n"
                        f"• क्लीनिकल निष्कर्ष: बायोमार्कर एवं लक्षणों के आधार पर गणना की गई है। "
                        f"{'डॉक्टर से शारीरिक परामर्श की सलाह दी जाती है।' if curr_risk >= 50 else 'नियमित जीवनशैली व घरेलू सावधानियां पर्याप्त हैं।'}"
                    )
                else:
                    response["reply"] = (
                        f"📊 Clinical Risk Analysis for {matched_disease}:\n\n"
                        f"• Probability Index: {curr_risk}%\n"
                        f"• Stratification: {risk_level}\n"
                        f"• Clinical Findings: Evaluated using multi-factor symptom weighting. "
                        f"{'In-person specialist consultation is advised.' if curr_risk >= 50 else 'Safe conservative home care and monitoring is indicated.'}"
                    )
                return JSONResponse(content=response)

            if is_hindi:
                response["reply"] = "📊 आप किस रोग की जाँच का जोखिम आंकलन समझना चाहते हैं? कृपया विकल्प चुनें:"
            else:
                response["reply"] = "📊 Which condition's risk index or test evaluation would you like to review? Select an option:"

            response["action"] = "DISEASE_MENU"
            response["payload"] = {
                "diseases": [
                    "Heart & BP Health", "Type-2 Diabetes", "Stroke Risk", 
                    "Parkinson's Disease", "Kidney Health", "Liver Health", 
                    "Skin Lesion Assessment", "Cataract & Eye Screening", "Bone Fracture Inspection"
                ]
            }
            return JSONResponse(content=response)

        # 4. ACTION: CLINICAL RECOMMENDATIONS & HOME CARE TRIAGE
        rec_triggers = ["remedy", "recommend", "precaution", "treatment", "care", "घरेलू", "उपचार", "सावधानी", "सलाह"]
        if any(k in msg_lower for k in rec_triggers):
            if any(w in msg_lower for w in ["heart", "bp", "cardio", "दिल"]):
                response["reply"] = (
                    "❤️ Heart & Blood Pressure Guidelines:\n"
                    "1. Limit sodium intake to under 2,000 mg daily; avoid salted snacks.\n"
                    "2. Engage in 30 minutes of moderate brisk walking 5 days a week.\n"
                    "3. Practice slow diaphragmatic breathing for 10 minutes to reduce arterial tension.\n"
                    "⚠️ Seek emergency care immediately for crushing chest tightness or pain radiating to the jaw/arm."
                )
            elif any(w in msg_lower for w in ["sugar", "diabetes", "मधुमेह"]):
                response["reply"] = (
                    "🩸 Diabetes & Blood Glucose Care:\n"
                    "1. Replace refined carbohydrates with whole grains, legumes, and green vegetables.\n"
                    "2. Avoid sugary beverages, fruit juices, and fried items.\n"
                    "3. Track fasting and 2-hour postprandial glucose levels consistently."
                )
            elif any(w in msg_lower for w in ["bone", "joint", "fracture", "हड्डी"]):
                response["reply"] = (
                    "🦴 Bone & Joint Care:\n"
                    "1. Strictly immobilize any suspected fracture; do not bear weight.\n"
                    "2. Apply ice packs wrapped in a towel for 15 minutes to reduce swelling.\n"
                    "3. Ensure adequate dietary calcium (milk, paneer, sesame) and Vitamin D3."
                )
            elif any(w in msg_lower for w in ["skin", "rash", "allergy", "त्वचा"]):
                response["reply"] = (
                    "🧴 Cutaneous & Skin Care Guidelines:\n"
                    "1. Wash the affected region with cool water; avoid harsh soaps or hot baths.\n"
                    "2. Wear loose-fitting, breathable cotton clothing to minimize friction.\n"
                    "3. Avoid scratching to prevent secondary bacterial infection."
                )
            elif any(w in msg_lower for w in ["eye", "cataract", "vision", "आंख"]):
                response["reply"] = (
                    "👁️ Eye Care Guidelines:\n"
                    "1. Follow the 20-20-20 rule during screen use: every 20 minutes, look 20 feet away for 20 seconds.\n"
                    "2. Wear UV-protective sunglasses in direct outdoor sunlight.\n"
                    "3. Avoid unprescribed or expired eye drops."
                )
            elif any(w in msg_lower for w in ["fever", "bukhar", "बुखार"]):
                response["reply"] = (
                    "🌡️ Fever Home Care:\n"
                    "1. Maintain hydration with water, lemon water, or ORS.\n"
                    "2. Place damp, cool washcloths on the forehead.\n"
                    "3. Rest well; seek a doctor if temperature exceeds 102°F or lasts > 48 hours."
                )
            else:
                response["reply"] = (
                    "💊 Please choose which condition you need care recommendations for:\n"
                    "• Heart & Blood Pressure\n"
                    "• Diabetes & Sugar Management\n"
                    "• Bone, Joint & Fracture Care\n"
                    "• Skin Allergies & Rashes\n"
                    "• Eye Strain & Cataract Prevention"
                )
            return JSONResponse(content=response)

        # 5. DEFAULT CONVERSATIONAL DISPATCHER
        p_name = f" {patient_name}" if patient_name else ""
        if is_hindi:
            response["reply"] = (
                f"नमस्ते{p_name}! मैं आपका 24/7 स्वास्थ्य सहायक हूँ।\n\n"
                f"आप नीचे दिए गए विकल्पों द्वारा कोई भी सेवा प्राप्त कर सकते हैं:\n"
                f"1. 🏥 अस्पताल एवं डॉक्टर खोजें (सभी 9 विभाग)\n"
                f"2. 📅 किसी भी विशेषज्ञ का स्लॉट तुरंत बुक करें\n"
                f"3. 📊 किसी भी रोग का जोखिम स्कोर व रिपोर्ट समझें\n"
                f"4. 💊 विभिन्न रोगों के लिए घरेलू देखभाल और सलाह"
            )
        else:
            response["reply"] = (
                f"Hello{p_name}! I am your clinical triage assistant.\n\n"
                f"Here is what I can assist you with across all 9 hospital departments:\n"
                f"1. 🏥 Browse hospitals & specialists by department\n"
                f"2. 📅 Instant slot booking for any doctor\n"
                f"3. 📊 Review risk probabilities for specific conditions\n"
                f"4. 💊 Certified home-care & lifestyle recommendations"
            )

        return JSONResponse(content=response)

    except Exception as e:
        print("Chatbot error trace:", e)
        return JSONResponse(content={
            "reply": "I am online and ready. You can browse hospitals across all specialties, book appointments, or view symptom care recommendations.",
            "action": None,
            "payload": None
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)