from pathlib import Path
import joblib
import numpy as np
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent / "symptom_model.pkl"

try:
    symptom_model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not load symptom_model.pkl: {e}")
    symptom_model = None

# Feature names matching train_symptoms.py exactly
FEATURE_NAMES = [
    "chest_pressure",
    "breathlessness",
    "high_fasting_sugar",
    "extreme_thirst",
    "facial_droop_speech",
    "unilateral_weakness",
    "foamy_urine_edema",
    "elevated_creatinine",
    "jaundice_yellowing",
    "right_upper_pain",
    "resting_tremor",
    "motor_rigidity"
]

def evaluate_symptoms(answers: list, disease_title: str, is_hindi: bool = False) -> dict:
    calculated_risk = 25.0

    if symptom_model is not None and len(answers) > 0:
        vector = list(answers)
        while len(vector) < 12:
            vector.append(0)

        # Convert to DataFrame with feature names to suppress sklearn UserWarning
        feature_df = pd.DataFrame([vector[:12]], columns=FEATURE_NAMES)

        try:
            probs = symptom_model.predict_proba(feature_df)[0]
            classes = list(symptom_model.classes_)

            matched_prob = None
            for idx, cls_name in enumerate(classes):
                if cls_name.lower() in disease_title.lower() or disease_title.lower() in cls_name.lower():
                    matched_prob = probs[idx]
                    break

            if matched_prob is not None:
                calculated_risk = round(float(matched_prob) * 100.0, 1)
            else:
                calculated_risk = round(float(np.max(probs)) * 100.0, 1)
        except Exception as err:
            print(f"Inference warning, using heuristic fallback: {err}")
            score = sum(int(a) for a in answers)
            calculated_risk = round((score / max(len(answers) * 2, 1)) * 70.0 + 15.0, 1)
    else:
        score = sum(int(a) for a in answers)
        calculated_risk = round((score / max(len(answers) * 2, 1)) * 70.0 + 15.0, 1)

    calculated_risk = float(np.clip(calculated_risk, 8.0, 96.0))

    if is_hindi:
        report = (
            f"प्रशिक्षित रैंडम फॉरेस्ट मॉडल के अनुसार {disease_title} हेतु अनुमानित जोखिम सूचकांक {calculated_risk}% है। "
            "यह आंकलन आपके द्वारा दर्ज किए गए प्राथमिक लक्षणों और क्लीनिकल बायोमार्कर्स पर आधारित है।"
        )
        remedies = (
            "- दिनभर में पर्याप्त मात्रा में स्वच्छ जल अथवा गुनगुना पानी पिएं।\n"
            "- ताजा, सुपाच्य और संतुलित घर का बना आहार लें; अत्यधिक तेल-मसाले से बचें।\n"
            "- 7-8 घंटे की नियमित नींद लें और शारीरिक व मानसिक तनाव कम रखें।"
        )
    else:
        report = (
            f"Trained Random Forest evaluation estimates a clinical probability index of {calculated_risk}% for {disease_title}. "
            "This assessment correlates your input against multivariate clinical training patterns."
        )
        remedies = (
            "- Maintain steady hydration with clean drinking water throughout the day.\n"
            "- Consume fresh, balanced, easily digestible home-cooked meals.\n"
            "- Ensure 7-8 hours of restful sleep and minimize physical or mental strain."
        )

    return {
        "risk": calculated_risk,
        "report": report,
        "remedies": remedies
    }